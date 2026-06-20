/* ════════════════════════════════════════════════════════════════════
   Génère les voix manquantes avec OpenAI TTS (voix féminine FR douce).
   Lit src/data/audioSpeechMap.js, saute les fichiers déjà présents,
   écrit les MP3 dans public/audio/voix/<clé>.mp3.

   PRÉREQUIS (sur ta machine, pas ChatGPT Plus) :
     - Clé API OpenAI : https://platform.openai.com/api-keys
       (ajoute ~5 $ de crédit ; les 99 clips coûtent quelques centimes)
     - Node 18+ (fetch intégré)

   LANCER :
     cd petits-poussins
     OPENAI_API_KEY=sk-xxxx node scripts/generate-voices.mjs
       (PowerShell : $env:OPENAI_API_KEY="sk-xxxx"; node scripts/generate-voices.mjs)

   Options :
     FORCE=1     régénère même les fichiers déjà présents
     VOICE=nova  change la voix (shimmer, nova, coral, alloy, fable…)
   ════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MAP_FILE = path.join(ROOT, 'src/data/audioSpeechMap.js')
const OUT_DIR = path.join(ROOT, 'public/audio/voix')

const API_KEY = process.env.OPENAI_API_KEY
const VOICE = process.env.VOICE || 'shimmer' // féminine
const MODEL = 'gpt-4o-mini-tts'
const FORCE = process.env.FORCE === '1'
const INSTRUCTIONS =
  'Voix féminine douce, chaleureuse et joyeuse, pour de jeunes enfants. Débit lent et articulé. Langue : français.'

if (!API_KEY) {
  console.error('❌ OPENAI_API_KEY manquant. Voir le haut du fichier pour la commande.')
  process.exit(1)
}

// Parse les entrées `clé: 'texte',` ou `clé: "texte",` de la map.
function parseMap() {
  const src = fs.readFileSync(MAP_FILE, 'utf8')
  const rx = /^\s*([a-z0-9_]+):\s*(['"])(.*?)\2,?\s*$/
  const out = []
  for (const line of src.split('\n')) {
    const m = line.match(rx)
    if (m) out.push({ key: m[1], text: m[3] })
  }
  return out
}

async function tts(text) {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, voice: VOICE, input: text, instructions: INSTRUCTIONS, response_format: 'mp3' }),
  })
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  return Buffer.from(await res.arrayBuffer())
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const have = new Set(fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.mp3')).map((f) => f.replace('.mp3', '')))
  const entries = parseMap()
  const todo = entries.filter((e) => FORCE || !have.has(e.key))

  console.log(`Voix : ${VOICE} | À générer : ${todo.length} / ${entries.length}`)
  let ok = 0
  for (const { key, text } of todo) {
    try {
      const buf = await tts(text)
      fs.writeFileSync(path.join(OUT_DIR, `${key}.mp3`), buf)
      ok++
      console.log(`✅ ${key}.mp3  «${text}»`)
      await sleep(250) // throttle léger
    } catch (e) {
      console.error(`❌ ${key} : ${e.message}`)
    }
  }
  console.log(`\nTerminé : ${ok}/${todo.length} générés dans public/audio/voix/`)
}

main()
