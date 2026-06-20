/* Génère les cris d'animaux (ElevenLabs Sound Effects) → public/audio/animals/.
   Lancer : XI_API_KEY=sk_xxx node scripts/gen-animal-sfx.mjs */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public/audio/animals')
const KEY = process.env.XI_API_KEY
if (!KEY) { console.error('XI_API_KEY manquant'); process.exit(1) }

const SOUNDS = {
  chicken: 'a hen clucking, one short friendly cluck, farmyard',
  pig: 'a pig oinking once, cute short oink',
  cow: 'a cow mooing once, gentle moo',
  sheep: 'a sheep bleating, one soft baaa',
  rabbit: 'a cute little rabbit squeak, soft',
  duck: 'a duck quacking, one short quack',
  horse: 'a horse neighing once, gentle',
  goat: 'a goat bleating, one maaa',
  dog: 'a small friendly dog, one soft woof',
  cat: 'a cat meowing once, cute meow',
  turkey: 'a turkey gobbling once',
  mouse: 'a tiny mouse squeak, cute',
}

async function sfx(text) {
  const r = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({ text, duration_seconds: 2, prompt_influence: 0.6 }),
  })
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`)
  return Buffer.from(await r.arrayBuffer())
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

fs.mkdirSync(OUT, { recursive: true })
let ok = 0
for (const [k, prompt] of Object.entries(SOUNDS)) {
  try { fs.writeFileSync(path.join(OUT, `${k}.mp3`), await sfx(prompt)); ok++; console.log(`✅ ${k}`); await sleep(400) }
  catch (e) { console.error(`❌ ${k}: ${e.message}`) }
}
console.log(`\n${ok}/${Object.keys(SOUNDS).length} cris générés dans public/audio/animals/`)
