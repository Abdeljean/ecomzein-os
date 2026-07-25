import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { validate, prospectSchema } from '../validators/index.js';
import * as salesController from '../controllers/salesController.js';

const router = Router();

router.get('/prospects', authenticateToken, salesController.getProspects);
router.post('/prospects', authenticateToken, validate(prospectSchema), salesController.createProspect);
router.get('/quotes', authenticateToken, salesController.getQuotes);
router.post('/quotes', authenticateToken, salesController.createQuote);

export default router;
