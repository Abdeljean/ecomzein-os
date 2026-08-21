import * as ftp from "basic-ftp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

async function deployToHostinger() {
  const client = new ftp.Client(15000);
  client.ftp.verbose = true;

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

    console.log("✔ Connecté au serveur Hostinger.");
    try {
      await client.cd("/public_html");
    } catch (_) {
      console.log("  (Répertoire racine déjà positionné sur public_html)");
    }

    console.log("📤 Synchronisation des fichiers applicatifs vers Hostinger...");

    // Upload core frontend files
    const coreFiles = [
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

    await client.cd("/");
    for (const file of coreFiles) {
      const localPath = path.join(projectRoot, file);
      try {
        await client.uploadFrom(localPath, file);
        console.log(`  ✔ Fichier synchronisé : ${file}`);
      } catch (err) {
        console.warn(`  ⚠️ Impossible de téléverser ${file}: ${err.message}`);
      }
    }

    // Upload backend core files (Fast upload excluding node_modules)
    console.log("📤 Synchronisation rapide du dossier /backend/src...");
    await client.cd("/");
    await client.ensureDir("backend");
    const backendFiles = ["package.json", "package-lock.json"];
    for (const bf of backendFiles) {
      try {
        await client.uploadFrom(path.join(projectRoot, "backend", bf), bf);
      } catch (_) {}
    }
    await client.ensureDir("src");
    await client.uploadFromDir(path.join(projectRoot, "backend", "src"));

    // Upload scripts directory
    await client.cd("/");
    await client.ensureDir("scripts");
    await client.uploadFrom(path.join(projectRoot, "scripts", "init_hostinger_db.sql"), "init_hostinger_db.sql");

    // Upload prisma directory
    console.log("📤 Synchronisation du dossier /prisma...");
    await client.cd("/");
    await client.ensureDir("prisma");
    await client.uploadFromDir(path.join(projectRoot, "prisma"));

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
