import { AUDIO_SPEECH_MAP } from '../src/data/audioSpeechMap.js'
import { AUDIO_SPEECH_MAP_EN } from '../src/data/audioSpeechMapEn.js'
import { writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs'

const KEY = process.env.XI_KEY
const VOICE = '21m00Tcm4TlvDq8ikWAM' // Rachel (voix anglaise ElevenLabs)
const SRC = 'public/audio/voix'
const OUT = 'public/audio/voix-en'
mkdirSync(OUT, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let generated = 0, copied = 0, failed = 0

for (const [key, en] of Object.entries(AUDIO_SPEECH_MAP_EN)) {
  const fr = AUDIO_SPEECH_MAP[key]
  const out = `${OUT}/${key}.mp3`
  // Texte identique au français (mots de lecture, cognats) → on copie le clip FR.
  if (en === fr && existsSync(`${SRC}/${key}.mp3`)) {
    copyFileSync(`${SRC}/${key}.mp3`, out)
    copied++
    continue
  }
  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}`, {
      method: 'POST',
      headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: en,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    })
    if (!res.ok) { failed++; console.log('FAIL', key, res.status); continue }
    const buf = Buffer.from(await res.arrayBuffer())
    writeFileSync(out, buf)
    generated++
    if (generated % 20 === 0) console.log(`  …${generated} générés`)
    await sleep(120)
  } catch (e) {
    failed++; console.log('ERR', key, e.message)
  }
}
console.log(`Done. generated=${generated} copied=${copied} failed=${failed}`)
