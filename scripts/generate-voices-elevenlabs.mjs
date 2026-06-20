/* ════════════════════════════════════════════════════════════════════
   Génère les voix manquantes avec ElevenLabs (voix féminine FR).
   Lit src/data/audioSpeechMap.js, saute les présents, écrit les MP3
   dans public/audio/voix/<clé>.mp3.

   ⚠️ Plan ElevenLabs PAYANT requis (Starter+) : le plan gratuit refuse
   les voix via l'API (HTTP 402 paid_plan_required).

   PRÉREQUIS : Node 18+, clé API ElevenLabs.

   LANCER (PowerShell) :
     cd petits-poussins
     $env:XI_API_KEY="sk_xxxx"
     node scripts/generate-voices-elevenlabs.mjs

   Options :
     VOICE_ID=...   id de voix (défaut Charlotte, FR femme douce)
     FORCE=1        régénère même les présents
   ════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MAP_FILE = path.join(ROOT, 'src/data/audioSpeechMap.js')
const OUT_DIR = path.join(ROOT, 'public/audio/voix')

const API_KEY = process.env.XI_API_KEY
const VOICE_ID = process.env.VOICE_ID || 'XB0fDUnXU5powFXDhCwa' // Charlotte (FR femme douce)
const MODEL = process.env.MODEL || 'eleven_turbo_v2_5' // supporte language_code
const LANG = process.env.LANG_CODE || 'fr' // force la prononciation française
const FORCE = process.env.FORCE === '1'

if (!API_KEY) {
  console.error('❌ XI_API_KEY manquant.')
  process.exit(1)
}

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
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      language_code: LANG,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.2 },
    }),
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

  console.log(`Voice ${VOICE_ID} | à générer : ${todo.length} / ${entries.length}`)
  let ok = 0
  for (const { key, text } of todo) {
    try {
      const buf = await tts(text)
      fs.writeFileSync(path.join(OUT_DIR, `${key}.mp3`), buf)
      ok++
      console.log(`✅ ${key}.mp3  «${text}»`)
      await sleep(300)
    } catch (e) {
      console.error(`❌ ${key} : ${e.message}`)
    }
  }
  console.log(`\nTerminé : ${ok}/${todo.length} dans public/audio/voix/`)
}

main()
