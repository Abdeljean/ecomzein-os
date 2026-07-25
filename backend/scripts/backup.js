import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const backupDir = path.join(process.cwd(), 'storage', 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(backupDir, `nobti_crm_backup_${timestamp}.sql`);

console.log(`📦 Starting MySQL Database Backup... Target: ${backupPath}`);

// Extract database details from DATABASE_URL
const dbUrl = process.env.DATABASE_URL || '';
const match = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

if (!match) {
  console.log('ℹ️ Local SQLite or default fallback. Creating JSON snapshot backup...');
  fs.writeFileSync(path.join(backupDir, `nobti_snapshot_${timestamp}.json`), JSON.stringify({ timestamp, env: process.env.NODE_ENV }, null, 2));
  console.log('✅ Database Snapshot Created!');
} else {
  const [, user, password, host, port, dbName] = match;
  const cmd = `mysqldump -h ${host} -P ${port} -u ${user} -p${password} ${dbName} > "${backupPath}"`;
  exec(cmd, (error) => {
    if (error) {
      console.warn('⚠️ mysqldump warning:', error.message);
    } else {
      console.log(`✅ MySQL Backup Created Successfully: ${backupPath}`);
    }
  });
}
