import { AUDIO_SPEECH_MAP } from '../data/audioSpeechMap'

const DEFAULT_SPEECH_OPTIONS = {
  lang: 'fr-FR',
  rate: 0.85,
  pitch: 1.05,
}

let voicesCache = null
let currentAudio = null

function normalizeKey(audioKey) {
  return String(audioKey ?? '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function getVoixUrl(filename) {
  return new URL(`../assets/audio/voix/${filename}`, import.meta.url).href
}

function refreshVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  voicesCache = window.speechSynthesis.getVoices()
  return voicesCache
}

function pickFrenchVoice() {
  const voices = voicesCache?.length ? voicesCache : refreshVoices()
  return (
    voices.find((v) => v.lang === 'fr-FR') ??
    voices.find((v) => v.lang.startsWith('fr')) ??
    voices[0] ??
    null
  )
}

export function resolveSpeechText(audioKey) {
  const key = normalizeKey(audioKey)
  if (!key) return null

  if (AUDIO_SPEECH_MAP[key]) {
    return AUDIO_SPEECH_MAP[key]
  }

  if (key.startsWith('lettre_')) {
    return key.replace('lettre_', '').toUpperCase()
  }

  if (key.startsWith('son_')) {
    const letter = key.replace('son_', '').toUpperCase()
    return `Trouve ce qui commence par ${letter}`
  }

  return key.replace(/_/g, ' ')
}

export function stopAllAudio() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
}

export function speakFallback(text, options = {}) {
  if (!text || typeof window === 'undefined') return false

  const synth = window.speechSynthesis
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
    console.log('[audio] speechSynthesis indisponible')
    return false
  }

  stopAllAudio()

  const utterance = new SpeechSynthesisUtterance(text)
  const opts = { ...DEFAULT_SPEECH_OPTIONS, ...options }
  utterance.lang = opts.lang
  utterance.rate = opts.rate
  utterance.pitch = opts.pitch

  const voice = pickFrenchVoice()
  if (voice) utterance.voice = voice

  try {
    synth.speak(utterance)
    return true
  } catch {
    console.log('[audio] speechSynthesis bloqué')
    return false
  }
}

export function playWord(audioKey, options = {}) {
  const key = normalizeKey(audioKey)
  if (!key) return

  const fallbackText = resolveSpeechText(key)
  const path = getVoixUrl(`${key}.mp3`)

  stopAllAudio()

  try {
    const audio = new Audio(path)
    currentAudio = audio

    const useFallback = () => {
      currentAudio = null
      if (fallbackText) speakFallback(fallbackText, options)
    }

    audio.addEventListener('error', useFallback, { once: true })
    audio.addEventListener('ended', () => {
      currentAudio = null
    })

    audio.play().catch(useFallback)
  } catch {
    if (fallbackText) speakFallback(fallbackText, options)
  }
}

export function playSuccess() {
  playWord('bravo')
}

export function playError() {
  playWord('oups')
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    refreshVoices()
  }
  refreshVoices()
}
