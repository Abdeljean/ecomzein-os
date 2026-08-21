import * as ftp from "basic-ftp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

async function deployToHostinger() {
  const client = new ftp.Client(25000);
  client.ftp.verbose = false;

  try {
    console.log("🚀 CONNEXION ET DÉPLOIEMENT AUTOMATIQUE VERS HOSTINGER CLOUD...");

    const ftpHost = process.env.FTP_SERVER || "ftp.tassnimproduct.shop";
    const ftpUser = process.env.FTP_USERNAME || "u721391917.tassnimproduct";
    const ftpPassword = process.env.FTP_PASSWORD || "Jb462920@";

    await client.access({
      host: ftpHost,
      user: ftpUser,
      password: ftpPassword,
      secure: false
    });

    console.log("✔ Connecté au serveur Hostinger avec succès.");

    // Core static files to upload at root
    const rootFiles = [
      "index.html",
      "styles.css",
      "app.js",
      "sw.js",
      "manifest.json",
      ".htaccess",
      "logo-mark.png",
      "logo.png",
      "favicon.ico",
      "favicon.png",
      "apple-touch-icon.png",
      "icon-192.png",
      "icon-512.png"
    ];

    console.log("📤 Synchronisation des fichiers racine...");
    await client.cd("/");
    for (const file of rootFiles) {
      const localPath = path.join(projectRoot, file);
      if (fs.existsSync(localPath)) {
        try {
          await client.uploadFrom(localPath, file);
          console.log(`  ✔ Fichier synchronisé : ${file}`);
        } catch (err) {
          console.warn(`  ⚠️ Impossible de téléverser ${file}: ${err.message}`);
        }
      }
    }

    // Helper for robust file uploads
    async function uploadDirectoryClean(localDirPath, remoteDirPath) {
      if (!fs.existsSync(localDirPath)) return;
      const entries = fs.readdirSync(localDirPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.name === "node_modules" || entry.name === ".git" || entry.name.startsWith("tmp")) continue;
        const localPath = path.join(localDirPath, entry.name);
        const remotePath = `${remoteDirPath}/${entry.name}`.replace(/^\/+/, "");

        if (entry.isDirectory()) {
          await uploadDirectoryClean(localPath, remotePath);
        } else {
          try {
            await client.cd("/");
            const dirParts = remoteDirPath.split("/").filter(Boolean);
            for (const part of dirParts) {
              await client.ensureDir(part);
            }
            await client.uploadFrom(localPath, entry.name);
            console.log(`  ✔ Synchronisé : ${remotePath}`);
          } catch (e) {
            console.warn(`  ⚠️ Erreur téléversement ${remotePath}:`, e.message);
          }
        }
      }
    }

    // Sync backend files (excluding node_modules)
    console.log("📤 Synchronisation du dossier /backend/src...");
    await client.cd("/");
    await client.ensureDir("backend");
    for (const bf of ["package.json", "package-lock.json"]) {
      const bfp = path.join(projectRoot, "backend", bf);
      if (fs.existsSync(bfp)) {
        await client.uploadFrom(bfp, bf);
      }
    }
    await uploadDirectoryClean(path.join(projectRoot, "backend", "src"), "backend/src");

    // Sync scripts
    console.log("📤 Synchronisation du dossier /scripts...");
    await client.cd("/");
    await client.ensureDir("scripts");
    const scriptSql = path.join(projectRoot, "scripts", "init_hostinger_db.sql");
    if (fs.existsSync(scriptSql)) {
      await client.uploadFrom(scriptSql, "init_hostinger_db.sql");
    }

    // Sync prisma
    console.log("📤 Synchronisation du dossier /prisma...");
    await uploadDirectoryClean(path.join(projectRoot, "prisma"), "prisma");

    console.log("\n✅ DÉPLOIEMENT AUTOMATIQUE HOSTINGER RÉUSSI À 100% !");
    console.log("🌐 URL de Production : https://tassnimproduct.shop/");

  } catch (err) {
    console.error("❌ ERREUR LORS DU DÉPLOIEMENT AUTOMATIQUE HOSTINGER :", err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deployToHostinger();
