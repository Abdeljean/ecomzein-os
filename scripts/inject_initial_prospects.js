import fs from "fs";

const initialData = JSON.parse(fs.readFileSync("scripts/initial_prospects.json", "utf8"));
let appJs = fs.readFileSync("app.js", "utf8");

const dataDeclaration = `// ─── BASE DE DONNÉES INITIALE RÉELLE (${initialData.length} CONTACTS IMPORTÉS DEPUIS CSV) ───\nconst initialRealProspects = ${JSON.stringify(initialData, null, 2)};\n\n`;

// Insert initialRealProspects before state declaration
if (!appJs.includes("const initialRealProspects =")) {
  appJs = appJs.replace("// État Global de l'Application", `${dataDeclaration}// État Global de l'Application`);
}

// In state declaration:
appJs = appJs.replace("prospects: [],", "prospects: [...initialRealProspects],");

// In loadStateFromLocalStorage:
const oldCleanBlock = `    const cleanMarker = 'nobti_clean_prod_v5';
    const isCleaned = localStorage.getItem('nobti_crm_clean_marker');

    // Purge previous test mock data if present
    if (isCleaned !== cleanMarker) {
      localStorage.removeItem('nobti_crm_state_v2');
      localStorage.removeItem('nobti_crm_state');
      localStorage.setItem('nobti_crm_clean_marker', cleanMarker);
      state.prospects = [];`;

const newCleanBlock = `    const cleanMarker = 'nobti_real_db_v1';
    const isCleaned = localStorage.getItem('nobti_crm_clean_marker');

    // Load initial real dataset into storage if clean marker changed
    if (isCleaned !== cleanMarker) {
      localStorage.removeItem('nobti_crm_state_v2');
      localStorage.removeItem('nobti_crm_state');
      localStorage.setItem('nobti_crm_clean_marker', cleanMarker);
      state.prospects = [...initialRealProspects];`;

if (appJs.includes(oldCleanBlock)) {
  appJs = appJs.replace(oldCleanBlock, newCleanBlock);
}

fs.writeFileSync("app.js", appJs, "utf8");
console.log("Successfully injected initialRealProspects into app.js!");
