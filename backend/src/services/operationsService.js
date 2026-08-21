import { prisma } from '../database/prisma.js';
import { logger } from '../logger/index.js';

export async function fetchOrders() {
  return await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
}

// Rule 001: Mandatory deposit of at least 50% required to confirm order and create installation mission
export async function confirmOrderDeposit(orderId, amountPaid, userName, userRole) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error('Commande non trouvée');

  if (order.status === 'Confirmé' && order.paymentStatus === 'Acompte Vérifié') {
    throw new Error('Cette commande a déjà été confirmée.');
  }

  const totalTtc = Number(order.totalTtc) || 0;
  const minRequiredDeposit = totalTtc * 0.5;
  const paid = Number(amountPaid) || 0;

  if (paid < minRequiredDeposit) {
    throw new Error(`Règle 001: Un acompte d'au moins 50% (${minRequiredDeposit} MAD pour un total de ${totalTtc} MAD) est obligatoire pour confirmer la commande.`);
  }

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

    // Create payment record for deposit tracking
    await tx.payment.create({
      data: {
        invoiceNo: `FAC-${Date.now().toString().slice(-6)}`,
        orderId: order.id,
        client: order.client,
        amountPaid: paid,
        balanceRemaining: Math.max(0, totalTtc - paid),
        status: paid >= totalTtc ? 'Soldé' : 'Acompte 50%',
        isOverdue: false
      }
    }).catch(() => {});

    await tx.auditLog.create({
      data: {
        userName: userName || 'Système',
        userRole: userRole || 'owner',
        action: 'CONFIRM_ORDER_RULE001',
        entity: 'Order',
        entityId: orderId,
        oldValue: 'Non Payé',
        newValue: `Acompte ${paid} MAD (min requis: ${minRequiredDeposit} MAD) Vérifié`
      }
    });

    return { updatedOrder, installation };
  });

  logger.info('Order confirmed (Rule 001 executed)', { orderId, amountPaid: paid, minRequiredDeposit });
  return result;
}

export async function fetchInstallations() {
  return await prisma.installation.findMany({ orderBy: { createdAt: 'desc' } });
}

// Rule 002 & 004: Validate installation with signed PV -> activates 12M warranty automatically (idempotent, prevents duplicate warranties)
export async function validateInstallationService(installationId, signedReport, userName, userRole) {
  if (!signedReport) {
    throw new Error('Règle 002: Signature du procès-verbal (PV) requise pour clôturer l\'installation.');
  }

  const existingInst = await prisma.installation.findUnique({ where: { id: installationId } });
  if (!existingInst) {
    throw new Error('Installation non trouvée.');
  }

  if (existingInst.warrantyActivated || existingInst.stage === 'Terminé & Validé') {
    throw new Error('Cette installation a déjà été validée et clôturée.');
  }

  const result = await prisma.$transaction(async (tx) => {
    const inst = await tx.installation.update({
      where: { id: installationId },
      data: { stage: 'Terminé & Validé', warrantyActivated: true, progress: 100 }
    });

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const warranty = await tx.warranty.create({
      data: {
        client: inst.client,
        packInstalled: inst.pack,
        startDate: new Date(),
        expiryDate,
        status: 'Actif (12M)'
      }
    });

    await tx.auditLog.create({
      data: {
        userName: userName || 'Technicien',
        userRole: userRole || 'technician',
        action: 'VALIDATE_INSTALLATION_RULE004',
        entity: 'Installation',
        entityId: installationId,
        newValue: `PV signé validé, Garantie 12M activée jusqu'au ${expiryDate.toISOString().split('T')[0]}`
      }
    });

    return { inst, warranty };
  });

  logger.info('Installation validated (Rule 002 & 004 executed)', { installationId });
  return result;
}

// Rule 003: Commission payout validation requiring zero client balance
export async function payoutCommissionService(commissionId, userName, userRole) {
  const commission = await prisma.commission.findUnique({ where: { id: commissionId } });
  if (!commission) {
    throw new Error('Commission non trouvée.');
  }

  if (commission.status === 'Payé') {
    throw new Error('Cette commission a déjà été versée.');
  }

  const pendingPayments = await prisma.payment.findMany({
    where: {
      client: commission.client,
      balanceRemaining: { gt: 0 }
    }
  });

  if (pendingPayments.length > 0) {
    const totalUnpaid = pendingPayments.reduce((sum, p) => sum + Number(p.balanceRemaining), 0);
    throw new Error(`Règle 003: Le versement de la commission est bloqué tant que le solde client n'est pas intégralement réglé (Solde impayé restant: ${totalUnpaid} MAD).`);
  }

  const updatedCommission = await prisma.commission.update({
    where: { id: commissionId },
    data: { status: 'Payé' }
  });

  await prisma.auditLog.create({
    data: {
      userName: userName || 'Finance',
      userRole: userRole || 'finance',
      action: 'PAYOUT_COMMISSION_RULE003',
      entity: 'Commission',
      entityId: commissionId,
      oldValue: 'En Attente Payout',
      newValue: `Commission ${commission.commissionVal} MAD payée à ${commission.salespersonName}`
    }
  });

  logger.info('Commission paid (Rule 003 satisfied)', { commissionId, salesperson: commission.salespersonName });
  return updatedCommission;
}

export async function fetchCommissions() {
  return await prisma.commission.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function fetchAuditLogs() {
  return await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
}
