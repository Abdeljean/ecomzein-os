import * as operationsService from '../services/operationsService.js';

export async function getOrders(req, res, next) {
  try {
    const orders = await operationsService.fetchOrders();
    return res.json({ orders });
  } catch (err) {
    next(err);
  }
}

export async function confirmOrder(req, res, next) {
  try {
    const { orderId, amountPaid } = req.body;
    const result = await operationsService.confirmOrderDeposit(orderId, amountPaid, req.user.name, req.user.role);
    return res.json({ status: 'success', result });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function getInstallations(req, res, next) {
  try {
    const installations = await operationsService.fetchInstallations();
    return res.json({ installations });
  } catch (err) {
    next(err);
  }
}

export async function validateInstallation(req, res, next) {
  try {
    const { installationId, signedReport } = req.body;
    const result = await operationsService.validateInstallationService(installationId, signedReport, req.user.name, req.user.role);
    return res.json({ status: 'success', result });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function getAuditLogs(req, res, next) {
  try {
    const auditLogs = await operationsService.fetchAuditLogs();
    return res.json({ auditLogs });
  } catch (err) {
    next(err);
  }
}
