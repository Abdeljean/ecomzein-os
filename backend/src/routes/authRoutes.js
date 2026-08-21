import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';
import { validate, loginSchema, passwordResetRequestSchema, passwordResetConfirmSchema } from '../validators/index.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.post('/logout', authenticateToken, authController.logout);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', validate(passwordResetRequestSchema), authController.requestPasswordReset);
router.post('/reset-password', validate(passwordResetConfirmSchema), authController.resetPassword);
router.get('/me', authenticateToken, authController.getMe);

export default router;
