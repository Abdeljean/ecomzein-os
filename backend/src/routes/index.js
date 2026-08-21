import { Router } from 'express';
import authRoutes from './authRoutes.js';
import salesRoutes from './salesRoutes.js';
import operationsRoutes from './operationsRoutes.js';
import { uploadMiddleware } from '../middlewares/upload.js';
import { authenticateToken } from '../middlewares/auth.js';
import { prisma } from '../database/prisma.js';

const router = Router();

// Simple Public Health Check Endpoint with Uptime & Database Auto-Status
router.get('/health', async (req, res) => {
  let dbStatus = 'connected';
  let tablesCount = 0;
  try {
    const result = await prisma.$queryRaw`SHOW TABLES`;
    tablesCount = Array.isArray(result) ? result.length : 0;
  } catch (e) {
    dbStatus = 'disconnected: ' + (e.message || 'error');
  }

  res.json({
    status: 'ok',
    version: '1.0.0',
    database: dbStatus,
    tables: tablesCount,
    uptime: Math.round(process.uptime())
  });
});

// Auto-Migrate & Initialize Hostinger Database Schema
router.post('/system/init-database', async (req, res) => {
  const adminSecret = req.headers['x-admin-key'] || req.query.key;
  if (adminSecret !== 'ZeinPass2026!' && adminSecret !== 'Jb462920@' && req.headers['authorization'] === undefined) {
    return res.status(401).json({ error: 'Accès non autorisé' });
  }

  try {
    const tableQueries = [
      `CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`email\` VARCHAR(191) NOT NULL UNIQUE,
        \`password_hash\` VARCHAR(191) NOT NULL,
        \`name\` VARCHAR(191) NOT NULL,
        \`role\` ENUM('owner', 'commercial', 'confirmation', 'technician', 'finance') NOT NULL DEFAULT 'owner',
        \`email_verified\` BOOLEAN NOT NULL DEFAULT TRUE,
        \`hashed_reset_token\` VARCHAR(191) NULL,
        \`reset_token_expiry\` DATETIME(3) NULL,
        \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS \`prospects\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`clinic\` VARCHAR(191) NOT NULL,
        \`name\` VARCHAR(191) NOT NULL,
        \`phone\` VARCHAR(191) NOT NULL,
        \`city\` VARCHAR(191) NOT NULL,
        \`pack\` VARCHAR(191) NOT NULL,
        \`status\` VARCHAR(191) NOT NULL DEFAULT 'À Contacter',
        \`value\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        \`salesperson\` VARCHAR(191) NOT NULL DEFAULT 'Youssef El Amrani',
        \`notes\` TEXT NULL,
        \`step_index\` INT NOT NULL DEFAULT 0,
        \`deleted_at\` DATETIME(3) NULL,
        \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS \`clients\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`establishment\` VARCHAR(191) NOT NULL,
        \`contact_name\` VARCHAR(191) NOT NULL,
        \`phone\` VARCHAR(191) NOT NULL,
        \`email\` VARCHAR(191) NULL,
        \`city\` VARCHAR(191) NOT NULL,
        \`address\` VARCHAR(191) NULL,
        \`pack_installed\` VARCHAR(191) NOT NULL,
        \`total_purchases\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        \`status\` VARCHAR(191) NOT NULL DEFAULT 'Actif',
        \`warranty_expiry\` DATETIME(3) NULL,
        \`notes\` TEXT NULL,
        \`deleted_at\` DATETIME(3) NULL,
        \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS \`quotes\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`client\` VARCHAR(191) NOT NULL,
        \`doctor\` VARCHAR(191) NOT NULL,
        \`pack\` VARCHAR(191) NOT NULL,
        \`total_ht\` DECIMAL(12, 2) NOT NULL,
        \`tva\` DECIMAL(12, 2) NOT NULL,
        \`total_ttc\` DECIMAL(12, 2) NOT NULL,
        \`status\` VARCHAR(191) NOT NULL DEFAULT 'Envoyé',
        \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS \`orders\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`client\` VARCHAR(191) NOT NULL,
        \`doctor\` VARCHAR(191) NOT NULL,
        \`city\` VARCHAR(191) NOT NULL,
        \`pack_name\` VARCHAR(191) NOT NULL,
        \`total_ttc\` DECIMAL(12, 2) NOT NULL,
        \`status\` VARCHAR(191) NOT NULL DEFAULT 'En Attente',
        \`payment_status\` VARCHAR(191) NOT NULL DEFAULT 'Non Payé',
        \`deleted_at\` DATETIME(3) NULL,
        \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS \`payments\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`invoice_no\` VARCHAR(191) NOT NULL,
        \`order_id\` VARCHAR(191) NOT NULL,
        \`client\` VARCHAR(191) NOT NULL,
        \`amount_paid\` DECIMAL(12, 2) NOT NULL,
        \`balance_remaining\` DECIMAL(12, 2) NOT NULL,
        \`status\` VARCHAR(191) NOT NULL DEFAULT 'En Retard',
        \`is_overdue\` BOOLEAN NOT NULL DEFAULT FALSE,
        \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS \`installations\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`client\` VARCHAR(191) NOT NULL,
        \`doctor\` VARCHAR(191) NOT NULL,
        \`city\` VARCHAR(191) NOT NULL,
        \`address\` VARCHAR(191) NULL,
        \`pack\` VARCHAR(191) NOT NULL,
        \`technician\` VARCHAR(191) NOT NULL DEFAULT 'Mehdi Tazi',
        \`stage\` VARCHAR(191) NOT NULL DEFAULT 'Planifié',
        \`warranty_activated\` BOOLEAN NOT NULL DEFAULT FALSE,
        \`progress\` INT NOT NULL DEFAULT 0,
        \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS \`warranties\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`client\` VARCHAR(191) NOT NULL,
        \`pack_installed\` VARCHAR(191) NOT NULL,
        \`start_date\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`expiry_date\` DATETIME(3) NOT NULL,
        \`status\` VARCHAR(191) NOT NULL DEFAULT 'Actif (12M)',
        \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS \`commissions\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`salesperson_name\` VARCHAR(191) NOT NULL,
        \`client\` VARCHAR(191) NOT NULL,
        \`pack\` VARCHAR(191) NOT NULL,
        \`amount_ht\` DECIMAL(12, 2) NOT NULL,
        \`rate\` VARCHAR(191) NOT NULL DEFAULT '5%',
        \`commission_val\` DECIMAL(12, 2) NOT NULL,
        \`status\` VARCHAR(191) NOT NULL DEFAULT 'En Attente Payout',
        \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS \`notifications\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`role_target\` VARCHAR(191) NOT NULL,
        \`message\` VARCHAR(191) NOT NULL,
        \`read\` BOOLEAN NOT NULL DEFAULT FALSE,
        \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS \`audit_logs\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`user_name\` VARCHAR(191) NOT NULL,
        \`user_role\` VARCHAR(191) NOT NULL,
        \`action\` VARCHAR(191) NOT NULL,
        \`entity\` VARCHAR(191) NOT NULL,
        \`entity_id\` VARCHAR(191) NULL,
        \`old_value\` VARCHAR(191) NULL,
        \`new_value\` VARCHAR(191) NULL,
        \`ip_address\` VARCHAR(191) NULL,
        \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
    ];

    for (const sql of tableQueries) {
      await prisma.$executeRawUnsafe(sql);
    }

    res.json({
      status: 'success',
      message: 'Base de données MySQL Hostinger initialisée avec succès (11 tables créées/vérifiées).'
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'initialisation de la base : ' + err.message });
  }
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
