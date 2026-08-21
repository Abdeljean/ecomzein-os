import { Router } from 'express';
import { authenticateToken, requireRole } from '../middlewares/auth.js';
import { validate, confirmOrderSchema, validateInstallationSchema, payoutCommissionSchema } from '../validators/index.js';
import * as operationsController from '../controllers/operationsController.js';

const router = Router();

router.get('/orders', authenticateToken, operationsController.getOrders);
router.post('/orders/confirm', authenticateToken, requireRole('owner', 'confirmation'), validate(confirmOrderSchema), operationsController.confirmOrder);
router.get('/installations', authenticateToken, operationsController.getInstallations);
router.post('/installations/validate', authenticateToken, requireRole('owner', 'technician'), validate(validateInstallationSchema), operationsController.validateInstallation);
router.get('/commissions', authenticateToken, requireRole('owner', 'finance', 'commercial'), operationsController.getCommissions);
router.post('/commissions/payout', authenticateToken, requireRole('owner', 'finance'), validate(payoutCommissionSchema), operationsController.payoutCommission);
router.get('/audit-logs', authenticateToken, requireRole('owner'), operationsController.getAuditLogs);

export default router;
