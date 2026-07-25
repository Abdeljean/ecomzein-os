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
router.post('/upload/:category', authenticateToken, uploadMiddleware.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier téléchargé.' });
  }
  res.json({
    status: 'success',
    fileUrl: `/storage/uploads/${req.params.category}/${req.file.filename}`,
    filename: req.file.filename
  });
});

router.use('/auth', authRoutes);
router.use('/', salesRoutes);
router.use('/', operationsRoutes);

export default router;
