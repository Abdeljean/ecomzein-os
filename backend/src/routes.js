import { Router } from 'express';
import { authenticateToken, requireRole } from './auth.js';
import * as controllers from './controllers.js';
import * as validators from './validators.js';

const router = Router();

// Zod Validation Middleware Helper
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors[0].message });
    }
    req.body = result.data;
    next();
  };
}

/* Auth Routes */
router.post('/auth/login', validate(validators.loginSchema), controllers.login);
router.post('/auth/forgot-password', validate(validators.passwordResetRequestSchema), controllers.requestPasswordReset);
router.post('/auth/reset-password', validate(validators.passwordResetConfirmSchema), controllers.resetPassword);
router.get('/auth/me', authenticateToken, controllers.getMe);

/* Sales & Prospects Routes */
router.get('/prospects', authenticateToken, controllers.getProspects);
router.post('/prospects', authenticateToken, validate(validators.prospectSchema), controllers.createProspect);
router.get('/quotes', authenticateToken, controllers.getQuotes);
router.post('/quotes', authenticateToken, validate(validators.quoteSchema), controllers.createQuote);

/* Operations & Installations Routes */
router.get('/orders', authenticateToken, controllers.getOrders);
router.post('/orders/confirm', authenticateToken, requireRole('owner', 'confirmation'), validate(validators.confirmOrderSchema), controllers.confirmOrder);
router.get('/installations', authenticateToken, controllers.getInstallations);
router.post('/installations/validate', authenticateToken, requireRole('owner', 'technician'), validate(validators.validateInstallationSchema), controllers.validateInstallation);

/* Audit Logs */
router.get('/audit-logs', authenticateToken, requireRole('owner'), controllers.getAuditLogs);

export default router;
