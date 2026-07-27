import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './db.js';
import { config } from './config.js';

/* ==========================================================================
   1. AUTHENTICATION & USER CONTROLLER
   ========================================================================== */
export async function login(req, res) {
  const { email, password } = req.body;

  // Single admin default mock user fallback for MVP seed if DB empty
  let user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  
  if (!user && email.toLowerCase() === 'roya.creative@gmail.com') {
    const hash = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        email: 'roya.creative@gmail.com',
        passwordHash: hash,
        name: 'Roya Creative',
        role: 'owner'
      }
    });
  }

  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role, name: user.name },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return res.json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}

export async function requestPasswordReset(req, res) {
  const { email } = req.body;
  const resetToken = `RST-${Math.floor(100000 + Math.random() * 900000)}`;
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry }
    });
  }

  return res.json({
    status: 'success',
    message: `Jeton de réinitialisation généré et prêt pour envoi email à ${email}`,
    resetToken
  });
}

export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gte: new Date() }
    }
  });

  if (!user) {
    return res.status(400).json({ error: 'Jeton de réinitialisation invalide ou expiré.' });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: newHash,
      resetToken: null,
      resetTokenExpiry: null
    }
  });

  return res.json({ status: 'success', message: 'Mot de passe réinitialisé avec succès.' });
}

export async function getMe(req, res) {
  return res.json({ user: req.user });
}

/* ==========================================================================
   2. VENTES & PROSPECTS CONTROLLER
   ========================================================================== */
export async function getProspects(req, res) {
  const prospects = await prisma.prospect.findMany({ orderBy: { createdAt: 'desc' } });
  return res.json({ prospects });
}

export async function createProspect(req, res) {
  const { clinic, name, phone, city, pack, value, salesperson, notes } = req.body;
  const prospect = await prisma.prospect.create({
    data: {
      clinic,
      name: name || 'Contact Maître',
      phone,
      city: city || 'Casablanca',
      pack: pack || 'Pack Dentaire & TV',
      value: value || 0,
      salesperson: salesperson || req.user.name,
      notes
    }
  });

  // Audit Log
  await prisma.auditLog.create({
    data: {
      userName: req.user.name,
      userRole: req.user.role,
      action: 'CREATE_PROSPECT',
      entity: 'Prospect',
      entityId: prospect.id,
      newValue: `Prospect ${clinic} créé`
    }
  });

  return res.status(201).json({ status: 'success', prospect });
}

export async function getQuotes(req, res) {
  const quotes = await prisma.quote.findMany({ orderBy: { createdAt: 'desc' } });
  return res.json({ quotes });
}

export async function createQuote(req, res) {
  const { client, doctor, pack, totalHt, tva, totalTtc } = req.body;
  const quote = await prisma.quote.create({
    data: {
      client,
      doctor: doctor || '',
      pack,
      totalHt,
      tva,
      totalTtc
    }
  });
  return res.status(201).json({ status: 'success', quote });
}

/* ==========================================================================
   3. OPÉRATIONS & INSTALLATIONS CONTROLLER (BUSINESS RULES 001 & 002 & 004)
   ========================================================================== */
export async function getOrders(req, res) {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  return res.json({ orders });
}

// Rule 001: Mandatory deposit confirmation creates installation mission
export async function confirmOrder(req, res) {
  const { orderId, amountPaid } = req.body;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return res.status(404).json({ error: 'Commande non trouvée' });

  // Execute in transaction
  const result = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: 'Confirmé', paymentStatus: 'Acompte Vérifié' }
    });

    const installation = await tx.installation.create({
      data: {
        client: order.client,
        doctor: order.doctor,
        city: order.city,
        pack: order.packName,
        stage: 'Planifié',
        progress: 15
      }
    });

    await tx.auditLog.create({
      data: {
        userName: req.user.name,
        userRole: req.user.role,
        action: 'CONFIRM_ORDER_RULE001',
        entity: 'Order',
        entityId: orderId,
        oldValue: 'Non Payé',
        newValue: `Acompte ${amountPaid} MAD Vérifié`
      }
    });

    return { updatedOrder, installation };
  });

  return res.json({ status: 'success', result });
}

export async function getInstallations(req, res) {
  const installations = await prisma.installation.findMany({ orderBy: { createdAt: 'desc' } });
  return res.json({ installations });
}

// Rule 002 & 004: Validate installation with signed PV -> activates 12M warranty automatically
export async function validateInstallation(req, res) {
  const { installationId, signedReport } = req.body;

  if (!signedReport) {
    return res.status(400).json({ error: 'Règle 002: Signature du procès-verbal (PV) requise pour clôturer l\'installation.' });
  }

  const result = await prisma.$transaction(async (tx) => {
    const inst = await tx.installation.update({
      where: { id: installationId },
      data: { stage: 'Terminé & Validé', warrantyActivated: true, progress: 100 }
    });

    // Rule 004: Create warranty record
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const warranty = await tx.warranty.create({
      data: {
        client: inst.client,
        packInstalled: inst.pack,
        expiryDate
      }
    });

    await tx.auditLog.create({
      data: {
        userName: req.user.name,
        userRole: req.user.role,
        action: 'VALIDATE_INSTALLATION_RULE004',
        entity: 'Installation',
        entityId: installationId,
        newValue: 'Garantie 12M Activée'
      }
    });

    return { inst, warranty };
  });

  return res.json({ status: 'success', result });
}

/* ==========================================================================
   4. AUDIT LOGS & HEALTH CONTROLLER
   ========================================================================== */
export async function getAuditLogs(req, res) {
  const auditLogs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  return res.json({ auditLogs });
}
