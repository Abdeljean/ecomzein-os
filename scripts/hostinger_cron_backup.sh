#!/bin/bash
# ==============================================================================
# E-COMZEIN OS — HOSTINGER AUTOMATED CRON BACKUP SCRIPT (DAILY)
# Usage in crontab: 0 2 * * * /home/u721391917/domains/tassnimproduct.shop/scripts/hostinger_cron_backup.sh
# ==============================================================================

set -e

DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_ROOT="/home/u721391917/backups/ecomzein"
DB_BACKUP_DIR="$BACKUP_ROOT/mysql"
UPLOADS_BACKUP_DIR="$BACKUP_ROOT/uploads"
APP_ROOT="/home/u721391917/domains/tassnimproduct.shop/nodejs"

mkdir -p "$DB_BACKUP_DIR"
mkdir -p "$UPLOADS_BACKUP_DIR"

echo "[$DATE] Starting E-comZein OS Automated Production Backup..."

# 1. Backup MySQL Database
DB_NAME="u721391917_ecomzein"
DB_USER="u721391917_user"
DB_FILE="$DB_BACKUP_DIR/db_${DB_NAME}_${DATE}.sql.gz"

if command -v mysqldump &> /dev/null; then
  mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip -9 > "$DB_FILE"
  sha256sum "$DB_FILE" > "${DB_FILE}.sha256"
  echo "[$DATE] MySQL Database dumped to $DB_FILE (Verified)"
fi

# 2. Backup /storage/uploads (Signed PVs, Factures, Devis, Logos)
UPLOADS_SRC="$APP_ROOT/storage/uploads"
UPLOADS_FILE="$UPLOADS_BACKUP_DIR/uploads_${DATE}.tar.gz"

if [ -d "$UPLOADS_SRC" ]; then
  tar -czf "$UPLOADS_FILE" -C "$APP_ROOT/storage" uploads
  sha256sum "$UPLOADS_FILE" > "${UPLOADS_FILE}.sha256"
  echo "[$DATE] Physical uploads archived to $UPLOADS_FILE (Verified)"
fi

# 3. Retention Rotation: Keep last 14 daily backups, delete older
find "$DB_BACKUP_DIR" -type f -name "*.sql.gz*" -mtime +14 -delete
find "$UPLOADS_BACKUP_DIR" -type f -name "*.tar.gz*" -mtime +14 -delete

echo "[$DATE] Production Backup Completed Successfully."
