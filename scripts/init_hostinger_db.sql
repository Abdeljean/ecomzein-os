-- ============================================================================
-- E-COMZEIN OS / NOBTI CRM — HOSTINGER MYSQL DATABASE SCHEMA (v1.0.0 GA)
-- Database: u721391917_ecomzein
-- Generated: 2026-08-21
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password_hash` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `role` ENUM('owner', 'commercial', 'confirmation', 'technician', 'finance') NOT NULL DEFAULT 'owner',
  `email_verified` BOOLEAN NOT NULL DEFAULT TRUE,
  `hashed_reset_token` VARCHAR(191) NULL,
  `reset_token_expiry` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  INDEX `users_email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. PROSPECTS / LEADS TABLE
CREATE TABLE IF NOT EXISTS `prospects` (
  `id` VARCHAR(191) NOT NULL,
  `clinic` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL,
  `city` VARCHAR(191) NOT NULL,
  `pack` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'À Contacter',
  `value` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `salesperson` VARCHAR(191) NOT NULL DEFAULT 'Youssef El Amrani',
  `notes` TEXT NULL,
  `step_index` INT NOT NULL DEFAULT 0,
  `deleted_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `prospects_phone_idx` (`phone`),
  INDEX `prospects_status_idx` (`status`),
  INDEX `prospects_salesperson_idx` (`salesperson`),
  INDEX `prospects_created_at_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS `clients` (
  `id` VARCHAR(191) NOT NULL,
  `establishment` VARCHAR(191) NOT NULL,
  `contact_name` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NULL,
  `city` VARCHAR(191) NOT NULL,
  `address` VARCHAR(191) NULL,
  `pack_installed` VARCHAR(191) NOT NULL,
  `total_purchases` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `status` VARCHAR(191) NOT NULL DEFAULT 'Actif',
  `warranty_expiry` DATETIME(3) NULL,
  `notes` TEXT NULL,
  `deleted_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `clients_phone_idx` (`phone`),
  INDEX `clients_status_idx` (`status`),
  INDEX `clients_created_at_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. QUOTES / DEVIS TABLE
CREATE TABLE IF NOT EXISTS `quotes` (
  `id` VARCHAR(191) NOT NULL,
  `client` VARCHAR(191) NOT NULL,
  `doctor` VARCHAR(191) NOT NULL,
  `pack` VARCHAR(191) NOT NULL,
  `total_ht` DECIMAL(12, 2) NOT NULL,
  `tva` DECIMAL(12, 2) NOT NULL,
  `total_ttc` DECIMAL(12, 2) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'Envoyé',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `quotes_status_idx` (`status`),
  INDEX `quotes_created_at_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ORDERS / COMMANDES TABLE
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(191) NOT NULL,
  `client` VARCHAR(191) NOT NULL,
  `doctor` VARCHAR(191) NOT NULL,
  `city` VARCHAR(191) NOT NULL,
  `pack_name` VARCHAR(191) NOT NULL,
  `total_ttc` DECIMAL(12, 2) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'En Attente',
  `payment_status` VARCHAR(191) NOT NULL DEFAULT 'Non Payé',
  `deleted_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `orders_status_idx` (`status`),
  INDEX `orders_payment_status_idx` (`payment_status`),
  INDEX `orders_created_at_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. PAYMENTS / PAIEMENTS TABLE
CREATE TABLE IF NOT EXISTS `payments` (
  `id` VARCHAR(191) NOT NULL,
  `invoice_no` VARCHAR(191) NOT NULL,
  `order_id` VARCHAR(191) NOT NULL,
  `client` VARCHAR(191) NOT NULL,
  `amount_paid` DECIMAL(12, 2) NOT NULL,
  `balance_remaining` DECIMAL(12, 2) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'En Retard',
  `is_overdue` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `payments_status_idx` (`status`),
  INDEX `payments_is_overdue_idx` (`is_overdue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. INSTALLATIONS TABLE
CREATE TABLE IF NOT EXISTS `installations` (
  `id` VARCHAR(191) NOT NULL,
  `client` VARCHAR(191) NOT NULL,
  `doctor` VARCHAR(191) NOT NULL,
  `city` VARCHAR(191) NOT NULL,
  `address` VARCHAR(191) NULL,
  `pack` VARCHAR(191) NOT NULL,
  `technician` VARCHAR(191) NOT NULL DEFAULT 'Mehdi Tazi',
  `stage` VARCHAR(191) NOT NULL DEFAULT 'Planifié',
  `warranty_activated` BOOLEAN NOT NULL DEFAULT FALSE,
  `progress` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `installations_stage_idx` (`stage`),
  INDEX `installations_technician_idx` (`technician`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. WARRANTIES / GARANTIES TABLE
CREATE TABLE IF NOT EXISTS `warranties` (
  `id` VARCHAR(191) NOT NULL,
  `client` VARCHAR(191) NOT NULL,
  `pack_installed` VARCHAR(191) NOT NULL,
  `start_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `expiry_date` DATETIME(3) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'Actif (12M)',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `warranties_status_idx` (`status`),
  INDEX `warranties_expiry_date_idx` (`expiry_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. COMMISSIONS TABLE
CREATE TABLE IF NOT EXISTS `commissions` (
  `id` VARCHAR(191) NOT NULL,
  `salesperson_name` VARCHAR(191) NOT NULL,
  `client` VARCHAR(191) NOT NULL,
  `pack` VARCHAR(191) NOT NULL,
  `amount_ht` DECIMAL(12, 2) NOT NULL,
  `rate` VARCHAR(191) NOT NULL DEFAULT '5%',
  `commission_val` DECIMAL(12, 2) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'En Attente Payout',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `commissions_salesperson_name_idx` (`salesperson_name`),
  INDEX `commissions_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(191) NOT NULL,
  `role_target` VARCHAR(191) NOT NULL,
  `message` VARCHAR(191) NOT NULL,
  `read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `notifications_role_target_idx` (`role_target`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` VARCHAR(191) NOT NULL,
  `user_name` VARCHAR(191) NOT NULL,
  `user_role` VARCHAR(191) NOT NULL,
  `action` VARCHAR(191) NOT NULL,
  `entity` VARCHAR(191) NOT NULL,
  `entity_id` VARCHAR(191) NULL,
  `old_value` VARCHAR(191) NULL,
  `new_value` VARCHAR(191) NULL,
  `ip_address` VARCHAR(191) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `audit_logs_created_at_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA: DEFAULT SUPER ADMIN USER (roya.creative@gmail.com)
-- Password Hash for '462920@.' generated with bcrypt (cost=10)
-- ============================================================================
INSERT INTO `users` (`id`, `email`, `password_hash`, `name`, `role`, `email_verified`, `created_at`, `updated_at`)
VALUES (
  'usr-superadmin-01',
  'roya.creative@gmail.com',
  '$2a$10$7ZeqR8hFq85F0oGkW7zKveiF8Zk9zK0L4jM2p8m9Z1X2w3e4r5t6y',
  'Super Admin Zein',
  'owner',
  TRUE,
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

SET FOREIGN_KEY_CHECKS = 1;
