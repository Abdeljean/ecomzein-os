import { prisma } from '../database/prisma.js';
import { logger } from '../logger/index.js';

export async function fetchOrders() {
  return await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
}

// Rule 001: Mandatory deposit creates installation mission
export async function confirmOrderDeposit(orderId, amountPaid, userName, userRole) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error('Commande non trouvée');

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
        userName,
        userRole,
        action: 'CONFIRM_ORDER_RULE001',
        entity: 'Order',
        entityId: orderId,
        oldValue: 'Non Payé',
        newValue: `Acompte ${amountPaid} MAD Vérifié`
      }
    });

    return { updatedOrder, installation };
  });

  logger.info('Order confirmed (Rule 001 executed)', { orderId, amountPaid });
  return result;
}

export async function fetchInstallations() {
  return await prisma.installation.findMany({ orderBy: { createdAt: 'desc' } });
}

// Rule 002 & 004: Validate installation with signed PV -> activates 12M warranty automatically
export async function validateInstallationService(installationId, signedReport, userName, userRole) {
  if (!signedReport) {
    throw new Error('Règle 002: Signature du procès-verbal (PV) requise pour clôturer l\'installation.');
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
        expiryDate
      }
    });

    await tx.auditLog.create({
      data: {
        userName,
        userRole,
        action: 'VALIDATE_INSTALLATION_RULE004',
        entity: 'Installation',
        entityId: installationId,
        newValue: 'Garantie 12M Activée'
      }
    });

    return { inst, warranty };
  });

  logger.info('Installation validated (Rule 002 & 004 executed)', { installationId });
  return result;
}

export async function fetchAuditLogs() {
  return await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
}
