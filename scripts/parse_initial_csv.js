import fs from "fs";

const csvData = `Date,Nom,Téléphone,Ville,Type d'établissement,Pack proposé,Statut,Date de rappel,Commentaire,Supplémentaires,Total HT,Total TTC
2026-07-22,,+212610249226,,,,,,sans reponse,,,
2026-07-22,,+212642967113,,,,,,sans reponse,,,
2026-07-22,,+212662629665,,,,,,sans reponse,,,
2026-07-22,,+212674817158,,,,,,sans reponse,,,
2026-07-22,dr achiri khalid,+212658170325,taroudant,,,Contacté,,quand il sera pret il me recontactera ,,,
2026-07-22,,+212668959656,,,,Perdu,,,,,
2026-07-22,,+212629119947,,,,Perdu,,,,,
2026-07-22,,+212672318980,,,,Perdu,,,,,
2026-07-22,,+212661836236,,,,,,sans reponse,,,
2026-07-22,,+212661412303,,,,,,sans reponse,,,
2026-07-22,,+212641503104,,,,,,.,,,
2026-07-22,,+212661878148,rabat hopital cheikh zaid ,Hopital,,À rappeler,,lundi prochain inchallah,,,
2026-07-22,,+212706445265,,,,,,a rappeler lundi c'est une assistante,,,
2026-07-22,,+212708241814,,,,Perdu,,,,,
2026-07-22,,+212661659363,,,,À rappeler,,Client en congé  À recontacter après,,,
2026-07-22,,+212770719840,,,,Perdu,,,,,
2026-07-22,,+212661661110,,,,,,lundi inchallah,,,
2026-07-22,,+212762609718,,,,,,sans reponse,,,
2026-07-22,,+212662340262,,,,Perdu,,,,,
2026-07-22,,+212674537140,,,,,,sans reponse,,,
2026-07-22,,+212640789111,,,,,,hta ydkhol medecin l cabinet hedrat meaya l'assistante dialo,,,
2026-07-22,,+212603518001,,,,Contacté,,,,,
2026-07-22,,+212667713813,,,,Perdu,,,,,
2026-07-22,,+212610876394,,,,Perdu,,,,,
2026-07-22,,+212600606499,,,,,,sans reponse ,,,
2026-07-22,Dr moujib omar,+212662877410,Guelmim,Cabinet médical,,Intéressé,,Bgha afficheur guichet led,,,
2026-07-22,,+212696573210,,,,,,sans reponse ,,,
2026-07-22,,+212699723855,,,,,,sans reponse ,,,
2026-07-22,,+212641055522,,,,,,sans reponse ,,,
2026-07-22,,+212604377425,,,,,,sans reponse ,,,
2026-07-22,,+212661658305,,,,À rappeler,,,,,
2026-07-22,,+212660605373,,,,Perdu,,Client n'est plus intéressé,,,
2026-07-22,,+212662446603,,,,,,sans reponse ,,,
2026-07-22,,+212678141142,,,,,,sans reponse ,,,
2026-07-22,,+212693549092,,,,,,sans reponse ,,,
2026-07-22,,+212674766411,,,,,,sans reponse ,,,
2026-07-22,,+212694645415,,,,Perdu,,Client n'est plus intéressé,,,
2026-07-22,,+212616625647,,,,Perdu,,,,,
2026-07-22,,+212611114711,,,,À rappeler,,,,,
2026-07-22,,+212647354293,,,,,,sans reponse,,,
2026-07-22,,+212666322650,,,,Perdu,,,,,
2026-07-22,,+212676713990,,,,Perdu,,Client n'est plus intéressé,,,
2026-07-22,,+212660911092,,,,,,sans reponse,,,
2026-07-22,,+212666467176,,,,En réflexion,,En attente de confirmation de disponibilité,,,
2026-07-22,,+212661957917,,,,Perdu,,Client n'est plus intéressé,,,
2026-07-22,,+212661170813,,,,,,,,,
2026-07-22,,+212607088089,,,,Contacté,,elle qui va me rappeler,,,
2026-07-22,,+212661470525,,,,,,sans reponse,,,
2026-07-22,,+212671285556,,,,Perdu,,Client n'est plus intéressé,,,
2026-07-22,dr azeroual mohammed,+212663089496,agadir ,,,Intéressé,,عيادة بطبيب,,,
2026-07-22,,+212606143291,,,,,,sans reponse,,,
2026-07-22,,+212766859253,,,,Perdu,,,,,
2026-07-22,,+212666266889,,,,,,sans reponse,,,
2026-07-22,,+212661456911,,,,Perdu,,,,,
2026-07-22,,+212636789201,,,,,,sans reponse,,,
2026-07-22,,+212696800548,,,,Contacté,,assistante : docteur en congé,,,
2026-07-22,,+212635867778,,,,,,sans reponse,,,
2026-07-23,,+212699199716,,,,,,sans reponse,,,
2026-07-23,,+212640342605,,Cabinet médical,,Perdu,,عيادة طبيب مهتم ومتردد,,,
2026-07-23,,+212708274965,,,,,,sans reponse,,,
2026-07-23,abdelhak NARSA,+212660153080,,Établissement,,Intéressé,,Narsa Agadir,,,
2026-07-23,,+212641897142,,,,,,sans reponse,,,
2026-07-23,,+212774846275,,,,Perdu,,,,,
2026-07-23,,+212666651240,,,,À rappeler,,,,,
2026-07-23,dr hamza sbihi,+212699202052,marrakech,Cabinet médical,,À rappeler,,,,,
2026-07-23,,+212712246215,,Cabinet médical,,En réflexion,,عيادة طبيبة مهتمة sans reponse,,,
2026-07-23,Abderrahim Boukhlf,+212669075720,Agadir bay,Autres,,Intéressé,,مركز صحي تلاتة غرف طبية ,,,
2026-07-23,Dr Aouial Mohsine,+212662800672,,Cabinet médical,,En réflexion,,هذا طبيب مهتم كاين ف مراكش وبغا لي امشي عندو العيادة...,,,
2026-07-23,dr houda sefraoui,+212718866829,,Cabinet médical,,Contacté,,,,,
2026-07-23,,+212639383823,,,,Contacté,,,,,
2026-07-23,,+212658815396,,,,Perdu,,,,,
2026-07-23,,+212635735533,,,,,,sans reponse,,,
2026-07-23,,+212661419891,,,,Perdu,,,,,
2026-07-23,,+212633822865,,,,Contacté,,,,,
2026-07-23,DR LARGOU,+212661282775,,Cabinet médical,,À rappeler,, cabient fiha 4 medecins contactiih contact avec technicien,,,
2026-07-23,Mr abdellah,+212622818135,tamazouzt,Autres,,Intéressé,,,,,
2026-07-23,,+212695206232,,,,Perdu,,,,,
2026-07-23,,+212693171788,,,,,,sans reponse,,,
2026-07-23,,+212707141060,,,,,,sans reponse,,,
,,+212621793426,dentiste,,,Contacté,,,,,
,,+212677303491,,,,Contacté,,,,,
,,+212626493675,,,,Contacté,,,,,
,,+212661155269,,,,Contacté,,,,,
,,+212671088944,Dentiste,,,Contacté,,,,,
,,+212640382272,,,,Contacté,,,,,
,,+212661158532,,,,,,,,,
,,+212667353321,,,,,,,,,
,ahmed mansori,+212665052710,Professor Polyclinique assil marrakech,,,,,,,,
,,+212628359431,,,,,,,,,
,Dr soukaina,+212678160264,,,,,,,,,
,dr idoumou amarha,+212661320389,Laayoune,Cabinet médical,,Gagné,,,,,
,,+212654080630,Pharmacien,,,,,,,,
,,+351932119921,,,,,,,,,
,,+212611758539,,,,,,,,,
,,+212650347072,,,,,,,,,
,dr rabie chendoudi ,+212672540025,cardiologue - Inezgane,Cabinet médical,,Gagné,,,,,
,,+212666615502,,,,,,,,,
,dr ahmed fadloulah,+212673942930,marrakech,Cabinet médical,,Démo envoyée,,contacte le lundi inchallah,,,
,,+212661478357,,,,,,,,,
,Dr yassine elqyami,+212775225975,Agadir,,,,,,,,
,Dr adil bahdoul,+212660849735,Aitourir,,,,,,,,
,,+212600382641,,,,,,,,,
,,+212674677373,,,,,,,,,
,dr amri mohamed,+212667636885,temara,Cabinet médical,,,,,,,
,,+212661154643,,,,,,,,,
,,+212661304410,,,,,,,,,
,,+212630254986,,,,,,,,,
,,+212662202413,,,,,,,,,
,,+212661070598,,,,,,,,,
,,+34600743824,,,,,,,,,
,,+212663788774,,,,,,,,,
,,+212664694532,agadir,,,,,,,,
,dr abderrahman,+212661136689,,,,,,,,,
,,+212668485757,,,,,,,,,
,,+212661823383,,,,,,,,,
,,+212629338751,,,,,,,,,
,dr oussama el faqry,+212632424202,chichaoua,Cabinet médical,,,,,,,
,,+212651602425,,,,,,,,,
,,+212661882387,,,,,,,,,
,,+212653222507,,,,,,,,,
,,+212661519100,,,,,,,,,
,houcien,+212691439364,pharmacien ,,,,,,,,
,,+212702472478,,,,,,,,,
,dr hamdani,+212667717576, laboratoire ait melloul,,,,,,,,
,,+212689070477,,,,,,,,,
,,+212672121484,,,,,,,,,
,,+212767298467,,,,,,,,,
,informaticien abd lkbr el tenani,+212661671560,,,,,,,,,
,,+212673096581,,,,,,,,,
,amine abou sandia ,+212625429762,ait melloul,,,Perdu,,kayder roqya,,,
,,+212633525192,,,,Perdu,,,,,
,frere de dr alaeddine sounny,+212661929294,inzegane,Cabinet médical,,,,,,,
,,+212600692900,,,,,,,,,
,dr boughaza ilham,+212662629162,agadir,,,,,,,,
,,+212762506330,,,,,,,,,
,dr benzahra tarik,+212662033747,sbae eyoun,Cabinet médical,,,,pack blanc installation fin aout debut sep,,,
,,+212600639665,,,,,,,,,
,,+212661723536,,,,,,,,,
,,+212775699836,,,,,,,,,
,,+212627667794,,,,,,,,,
,,+212632904401,,,,,,a rappeler l'apres midi,,,
,,+212666367901,,,,,,,,,
,,+212660605566,,,,,,,,,
,,+212661555340,,,,,,,,,
,,+212661500605,,,,,,,,,
,,+212663171757,,,,,,,,,
,,+212677330892,,,,,,,,,
,,+212609618500,,,,,,,,,
,,+212651054054,,,,,,,,,
,,+212662692118,,,,,,,,,
,,+212661670909,,,,,,,,,
,,+212621000985,,,,,,,,,
,,+212601539582,,,,,,,,,
,,+212601152828,,,,,,,,,
,salon de beaute,+212671481821,,,,Perdu,,,,,
,,+212665247995,,,,,,,,,
,,+212621573352,,,,,,,,,
,,+212680032576,,,,,,,,,
,,+212663442129,,,,,,,,,
,dr ikrame,+212661956105,ouarzazte,Cabinet médical,,,,,,,
,,+212661941941,,,,,,,,,
,,+212681318936,,,,,,,,,
,assistant,+212638497412,,,,,,,,,
,,+212667725728,,,,,,,,,
,,+212661184238,,,,,,,,,
,,+212629202147,,,,,,,,,
,,+212616815490,,,,,,,,,
,dr bourjdal,+212619255045,ain harrouda,,,,,,,,
,dr ahid hicham,+212695072437,,,,,,,,,
,,+212607680607,,,,,,,,,
,,+212695712827,,,,,,,,,
,,+212662184770,,,,,,,,,
,,+212676636885,,,,,,,,,
,,+212625454823,,,,,,,,,
,,+212668600403,,,,,,,,,
,,+212623302459,,,,,,,,,
,,+212610492880,,,,,,,,,
,,+212663725560,,,,,,,,,
,dr aicha alaoui,+212661456225,meknes,,,,,,,,
,,+212624583507,,,,,,,,,
,,+212779301104,,,,,,,,,
,amine vet,+212669830539,settat,,,,,,,,
,hamza el mahdaoui,+212699741625,centre de soin ihchach agadir,,,,,,,,
,,+212600678934,,,,,,,,,
,saad,+212614363830,mektaba chichaoau,,,,,,,,
,,+212678968645,,,,,,,,,
,,+212704222896,,,,,,,,,
,,+212621119111,,,,,,,,,
,,+212617342064,,,,,,,,,
,,+212669653690,,,,,,,,,
,,+212645654047,,,,,,,,,
,,+212661354036,,,,,,,,,
,dr jamal opticien,+212633314645,hay dakhla et massa ,Cabinet médical,,,,rendez vous 21-08 à 20h30,,,
2026-08-19,,+212661169969,,,,,,rappele demain,,,
2026-08-19,,+212640583451,,,,,,,,,
2026-08-19,,+212639327727,,,,,,,,,
2026-08-19,,+212660022523,,,,,,a rappeler demain,,,
2026-08-19,,+212668496420,,,,,,,,,
2026-08-19,,+212620004786,,,,,,mabghach y3tini smiyto,,,
2026-08-19,librairie,+212661889133,,,,,,,,,
2026-08-19,librairie,+212693260605,,,,Démo envoyée,,,,,
2026-08-19,librairie,+212643843445,,,,Démo envoyée,,,,,
2026-08-20,librairie akrich,+212700103834,,,,Démo envoyée,,,,,
2026-08-20,librairie,+212666852633,,,,Démo envoyée,,,,,
2026-08-20,,+212689730093,,,,Démo envoyée,,,,,
2026-08-20,serraj immobilier,+212661078532,casa,,,,,A rappeler le 1er septembre,,,
2026-08-20,librairie,+212661364594,,,,,,,,,
2026-08-20,mr sabir ,+212672731885,atelier mécanique sidi ifni,,,,,,,,
2026-08-20,librairie,+212662671704,,,,Démo envoyée,,,,,
2026-08-20,,+212670387373,,,,,,,,,
2026-08-20,librairie,+212661837148,,,,Démo envoyée,,,,,
2026-08-20,librairie,+212677948651,,,,Démo envoyée,,,,,
2026-08-20,librairie,+212667474940,,,,Démo envoyée,,,,,
2026-08-20,librairie,+212668645631,,,,Démo envoyée,,,,,
2026-08-20,,+212659361528,,,,,,,,,
2026-08-20,,+212667156754,,,,,,,,,
2026-08-20,,+212669566596,,,,,,,,,
2026-08-20,,+212669615185,,,,,,,,,
2026-08-20,wafacash,@Service.sahdani24h,,,,,,,,,
2026-08-20,dr smahane oudassi,+212662595407,tanger,Cabinet médical,,,,,,,
2026-08-20,librairie,+212661728482,,,,Démo envoyée,,,,,
2026-08-20,,+212697438625,,,,,,,,,
2026-08-20,,+212614146977,,,,,,,,,
2026-08-20,,+212603961856,,,,,,,,,
2026-08-20,dr nabil albab,+212661335568,,,,,,demain inchallah,,,
2026-08-20,,+212600956067,,,,,,,,,
2026-08-20,,+212713659657,,,,,,,,,
2026-08-20,librairie,+212669826119,,,,Démo envoyée,,,,,
2026-08-20,librairie,+212761852310,,,,Démo envoyée,,,,,
2026-08-20,,+212602852792,,,,,,,,,
2026-08-20,librairie,+212602675071,,,,,,,,,`;

const lines = csvData.trim().split("\n");
const clean = (s) => (s ? s.trim() : "");

const prospects = [];

lines.slice(1).forEach((line, idx) => {
  const parts = line.split(",");
  const date = clean(parts[0]) || "2026-07-22";
  const rawNom = clean(parts[1]);
  const phone = clean(parts[2]);
  const rawVille = clean(parts[3]);
  const rawType = clean(parts[4]);
  const rawPack = clean(parts[5]);
  const rawStatut = clean(parts[6]);
  const rappelDate = clean(parts[7]);
  const commentaire = clean(parts[8]);
  const supp = clean(parts[9]);
  let ht = parseFloat(clean(parts[10])) || 0;
  let ttc = parseFloat(clean(parts[11])) || 0;

  // Format Nom
  let name = rawNom;
  if (!name) {
    if (phone && phone.length >= 4) {
      name = `Contact (${phone.slice(-4)})`;
    } else {
      name = `Prospect #${idx + 1}`;
    }
  }

  // Capitalize name cleanly if it starts with dr or words
  name = name.split(" ").map(w => w ? w.charAt(0).toUpperCase() + w.slice(1) : "").join(" ");
  if (name.startsWith("Dr ")) name = "Dr. " + name.slice(3);

  // Format Ville & Title casing
  let city = rawVille || "Casablanca";
  const cl = city.toLowerCase();
  if (cl.includes("rabat")) city = "Rabat";
  else if (cl.includes("marrakech")) city = "Marrakech";
  else if (cl.includes("agadir")) city = "Agadir";
  else if (cl.includes("tanger")) city = "Tanger";
  else if (cl.includes("taroudant")) city = "Taroudant";
  else if (cl.includes("guelmim")) city = "Guelmim";
  else if (cl.includes("laayoune")) city = "Laâyoune";
  else if (cl.includes("chichaoua") || cl.includes("chichaoau")) city = "Chichaoua";
  else if (cl.includes("temara")) city = "Témara";
  else if (cl.includes("meknes")) city = "Meknès";
  else if (cl.includes("settat")) city = "Settat";
  else if (cl.includes("ouarzazte")) city = "Ouarzazate";
  else if (cl.includes("casa")) city = "Casablanca";
  else if (cl.includes("inezgane") || cl.includes("inzegane")) city = "Inezgane";
  else if (cl.includes("ait melloul")) city = "Aït Melloul";
  else if (cl.includes("sidi ifni")) city = "Sidi Ifni";
  else if (cl.includes("ain harrouda")) city = "Aïn Harrouda";
  else if (cl.includes("sbae eyoun")) city = "Sbaâ Aïyoun";
  else if (cl.includes("aitourir")) city = "Aït Ourir";
  else if (cl.includes("dakhla")) city = "Dakhla";
  else if (cl.includes("tamazouzt")) city = "Tamazouzt";
  else if (city.length > 0) city = city.charAt(0).toUpperCase() + city.slice(1);

  // Type d'établissement
  let type = rawType;
  if (!type) {
    const nl = name.toLowerCase();
    const cl2 = rawVille.toLowerCase();
    if (nl.startsWith("dr.") || nl.includes("docteur") || cl2.includes("dentiste") || cl2.includes("cardiologue")) {
      type = cl2.includes("dentiste") ? "Cabinet dentaire" : "Cabinet médical";
    } else if (nl.includes("polyclinique") || nl.includes("hopital") || cl2.includes("hopital") || cl2.includes("polyclinique")) {
      type = "Clinique / Polyclinique";
    } else if (nl.includes("laboratoire") || cl2.includes("laboratoire")) {
      type = "Laboratoire";
    } else if (nl.includes("librairie") || nl.includes("mektaba") || cl2.includes("mektaba")) {
      type = "Librairie";
    } else if (nl.includes("opticien") || cl2.includes("opticien")) {
      type = "Opticien";
    } else if (nl.includes("pharmacien") || nl.includes("pharmacie") || cl2.includes("pharmacien")) {
      type = "Pharmacie";
    } else if (nl.includes("salon")) {
      type = "Salon / Institut";
    } else if (nl.includes("narsa") || nl.includes("wafacash") || nl.includes("immobilier")) {
      type = "Établissement / Agence";
    } else {
      type = "Établissement Professionnel";
    }
  }

  // Pack proposé
  let pack = rawPack;
  if (!pack) {
    if (type.includes("Laboratoire")) pack = "Pack Laboratoire";
    else if (type.includes("Clinique") || type.includes("Polyclinique") || type.includes("Hopital")) pack = "Pack Clinique PRO";
    else if (type.includes("Cabinet")) pack = "Pack Cabinet Plus";
    else pack = "Pack Cabinet Plus";
  }

  // Statut
  let status = rawStatut;
  const coml = commentaire.toLowerCase();
  if (!status) {
    if (coml.includes("sans reponse")) status = "À Contacter";
    else if (coml.includes("rappeler") || coml.includes("lundi") || coml.includes("demain")) status = "À Contacter";
    else if (coml.includes("rendez vous") || coml.includes("rdv")) status = "Qualifié";
    else status = "À Contacter";
  } else if (status === "Contacté") {
    status = "À Contacter";
  } else if (status === "Intéressé") {
    status = "Qualifié";
  } else if (status === "Démo envoyée") {
    status = "Devis Envoyé";
  } else if (status === "En réflexion") {
    status = "Négociation";
  } else if (status === "À rappeler") {
    status = "À Contacter";
  }

  // Total HT & Total TTC
  if (!ttc) {
    if (pack === "Pack Clinique PRO") { ttc = 28899; ht = 24082.50; }
    else if (pack === "Pack Laboratoire") { ttc = 9799; ht = 8165.83; }
    else if (pack === "Pack Cabinet Pro") { ttc = 7699; ht = 6415.83; }
    else { ttc = 6000; ht = 5000; }
  } else if (!ht) {
    ht = Math.round(ttc / 1.20);
  }

  prospects.push({
    id: `PRO-${1000 + idx + 1}`,
    date,
    name,
    clinic: name,
    phone: phone || "—",
    city,
    type_etablissement: type,
    pack,
    status,
    rappelDate: rappelDate || (coml.includes("rappeler") || coml.includes("lundi") ? "2026-08-25" : ""),
    notes: commentaire,
    commentaire,
    supplementaires: supp,
    total_ht: ht,
    total_ttc: ttc,
    value: ttc,
    salesperson: "Amine Kabbaj",
    stepIndex: status === "Gagné" ? 4 : status === "Devis Envoyé" ? 2 : status === "Qualifié" ? 1 : 0
  });
});

console.log(`Parsed ${prospects.length} prospects successfully.`);
fs.writeFileSync("scripts/initial_prospects.json", JSON.stringify(prospects, null, 2));
