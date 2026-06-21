/* Régénère les NOMS isolés avec un article (le/la/l') + stabilité max →
   prononciation française fiable. Garde le même nom de fichier (clé).
   Lancer : XI_API_KEY=sk_xxx node scripts/gen-nouns.mjs */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public/audio/voix')
const KEY = process.env.XI_API_KEY
const VOICE = process.env.VOICE_ID || 'UaGvaD7NWzU5mJNoUqoY' // Perle
if (!KEY) { console.error('XI_API_KEY manquant'); process.exit(1) }

// clé → texte porté (article correct, accents). Point final + majuscule = rendu stable.
const NOUNS = {
  // objets / nature
  pomme: 'Une pomme.', banane: 'Une banane.', herbe: "L'herbe.", ciel: 'Le ciel.',
  nuage: 'Le nuage.', carotte: 'Une carotte.', fleur: 'Une fleur.', raisin: 'Le raisin.',
  soleil: 'Le soleil.', arbre: "L'arbre.", caillou: 'Le caillou.', ballon: 'Le ballon.',
  roue: 'Une roue.', fenetre: 'La fenêtre.', cadeau: 'Le cadeau.', montagne: 'La montagne.',
  tente: 'La tente.', maison: 'La maison.', ferme: 'La ferme.', oeuf: "Un œuf.", nid: 'Le nid.',
  // animaux
  mouton: 'Le mouton.', chat: 'Le chat.', souris: 'La souris.', poussin: 'Le poussin.',
  lapin: 'Le lapin.', canard: 'Le canard.', cheval: 'Le cheval.', grenouille: 'La grenouille.',
  poisson: 'Le poisson.', chien: 'Le chien.', poule: 'La poule.', vache: 'La vache.',
  cochon: 'Le cochon.', rat: 'Le rat.', girafe: 'La girafe.', renard: 'Le renard.',
  dauphin: 'Le dauphin.', tortue: 'La tortue.', abeille: "L'abeille.", elephant: "L'éléphant.",
  ecureuil: "L'écureuil.", dinosaure: 'Le dinosaure.', crocodile: 'Le crocodile.',
  kangourou: 'Le kangourou.', herisson: 'Le hérisson.', pingouin: 'Le pingouin.',
  chouette: 'La chouette.', oiseau: "L'oiseau.", papillon: 'Le papillon.', coquillage: 'Le coquillage.',
  // objets du quotidien / mots
  lune: 'La lune.', velo: 'Le vélo.', ecole: "L'école.", ami: "Un ami.", sac: 'Le sac.',
  lit: 'Le lit.', bol: 'Le bol.', bebe: 'Le bébé.', bateau: 'Le bateau.', gateau: 'Le gâteau.',
  jardin: 'Le jardin.', bonbon: 'Le bonbon.', manteau: 'Le manteau.', fromage: 'Le fromage.',
  voiture: 'La voiture.', chateau: 'Le château.', chaussure: 'La chaussure.',
  parapluie: 'Le parapluie.', tonnerre: 'Le tonnerre.',
  // CM1 / CM2
  dragon: 'Le dragon.', guitare: 'La guitare.', horloge: "L'horloge.", pyjama: 'Le pyjama.',
  tresor: 'Le trésor.', fantome: 'Le fantôme.', escargot: "L'escargot.", chocolat: 'Le chocolat.',
  aquarium: "L'aquarium.", libellule: 'La libellule.', citrouille: 'La citrouille.',
  balancoire: 'La balançoire.', ascenseur: "L'ascenseur.", chevalier: 'Le chevalier.',
  tournevis: 'Le tournevis.', perroquet: 'Le perroquet.', squelette: 'Le squelette.',
  parapente: 'Le parapente.', trampoline: 'Le trampoline.', aspirateur: "L'aspirateur.",
  gymnastique: 'La gymnastique.', rhinoceros: 'Le rhinocéros.', hippopotame: "L'hippopotame.",
  helicoptere: "L'hélicoptère.", dictionnaire: 'Le dictionnaire.',
  // sans article (prénoms)
  papa: 'Papa.', maman: 'Maman.',
}

async function tts(text) {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 1.0, similarity_boost: 0.85, style: 0.0 },
    }),
  })
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`)
  return Buffer.from(await r.arrayBuffer())
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const keys = Object.keys(NOUNS)
let ok = 0
for (const k of keys) {
  try { fs.writeFileSync(path.join(OUT, `${k}.mp3`), await tts(NOUNS[k])); ok++; console.log(`✅ ${k} « ${NOUNS[k]} »`); await sleep(250) }
  catch (e) { console.error(`❌ ${k}: ${e.message}`) }
}
console.log(`\n${ok}/${keys.length} noms régénérés`)
