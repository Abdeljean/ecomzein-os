import { Router } from 'express';
import authRoutes from './authRoutes.js';
import salesRoutes from './salesRoutes.js';
import operationsRoutes from './operationsRoutes.js';
import { uploadMiddleware } from '../middlewares/upload.js';
import { authenticateToken } from '../middlewares/auth.js';
import { prisma } from '../database/prisma.js';

const router = Router();

// Simple Public Health Check Endpoint with Uptime
router.get('/health', async (req, res) => {
  let dbStatus = 'connected';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {
    dbStatus = 'disconnected';
  }

  res.json({
    status: 'ok',
    version: '1.0.0',
    database: dbStatus,
    uptime: Math.round(process.uptime())
  });
});

// Secure File Upload Endpoint (PV, Factures, Devis, Logos)
const ALLOWED_UPLOAD_CATEGORIES = ['pv', 'factures', 'devis', 'logos'];
router.post('/upload/:category', authenticateToken, (req, res, next) => {
  const cat = String(req.params.category || '').toLowerCase();
  if (!ALLOWED_UPLOAD_CATEGORIES.includes(cat)) {
    return res.status(400).json({ error: 'Catégorie de fichier non autorisée. Catégories valides: pv, factures, devis, logos.' });
  }
  next();
}, uploadMiddleware.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier valide téléchargé.' });
  }
  const cleanCat = String(req.params.category).toLowerCase();
  res.json({
    status: 'success',
    fileUrl: `/storage/uploads/${cleanCat}/${req.file.filename}`,
    filename: req.file.filename
  });
});

router.use('/auth', authRoutes);
router.use('/', salesRoutes);
router.use('/', operationsRoutes);

export default router;
