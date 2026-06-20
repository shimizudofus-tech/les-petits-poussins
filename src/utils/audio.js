import { AUDIO_SPEECH_MAP } from '../data/audioSpeechMap'
import { resolvePromptSpeechText } from './audioPrompts'
import { getActiveAudioSettings } from './audioSettings'
import { duckMusic, restoreMusic } from './music'

const DEFAULT_SPEECH_OPTIONS = {
  lang: 'fr-FR',
  rate: 0.85,
  pitch: 1.05,
}

const MP3_TIMEOUT_MS = 2500

let voicesCache = []
let voicesListenerAttached = false
let currentAudio = null
let onVoiceDisabled = null

export function setVoiceDisabledHandler(handler) {
  onVoiceDisabled = handler
}

function devLog(...args) {
  if (import.meta.env.DEV) console.info(...args)
}

function normalizeKey(audioKey) {
  return String(audioKey ?? '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

// Version audio : à incrémenter à chaque régénération des voix pour casser
// le cache navigateur (les fichiers gardent le même nom).
const AUDIO_VERSION = '6'

function getMp3Url(audioKey) {
  return `${import.meta.env.BASE_URL}audio/voix/${normalizeKey(audioKey)}.mp3?v=${AUDIO_VERSION}`
}

export function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []

  const synth = window.speechSynthesis
  const voices = synth.getVoices()
  if (voices.length) voicesCache = voices

  if (!voicesListenerAttached) {
    voicesListenerAttached = true
    synth.addEventListener('voiceschanged', () => {
      const next = synth.getVoices()
      if (next.length) {
        voicesCache = next
        devLog('[audio] voices loaded', next.length)
      }
    })
  }

  return voicesCache
}

function pickFrenchVoice() {
  const voices = voicesCache.length ? voicesCache : loadVoices()
  return (
    voices.find((v) => v.lang === 'fr-FR') ??
    voices.find((v) => v.lang.startsWith('fr')) ??
    null
  )
}

export function resolveSpeechText(audioKey) {
  const key = normalizeKey(audioKey)
  if (!key) return null

  if (AUDIO_SPEECH_MAP[key]) {
    return AUDIO_SPEECH_MAP[key]
  }

  const promptText = resolvePromptSpeechText(key)
  if (promptText) return promptText

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

async function isMp3Available(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    if (!response.ok) return false
    const contentType = response.headers.get('content-type') ?? ''
    return contentType.includes('audio')
  } catch {
    return false
  }
}

function tryPlayMp3(url, volume = 1) {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    audio.volume = volume
    let settled = false

    const finish = (action) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      action()
    }

    const onError = () => {
      audio.pause()
      if (currentAudio === audio) currentAudio = null
      finish(() => reject(new Error('mp3 failed')))
    }

    const onCanPlay = () => {
      currentAudio = audio
      audio
        .play()
        .then(() => resolve(true))
        .catch(onError)
    }

    audio.addEventListener('error', onError, { once: true })
    audio.addEventListener('canplaythrough', onCanPlay, { once: true })
    audio.addEventListener('ended', () => {
      if (currentAudio === audio) currentAudio = null
      restoreMusic()
    })

    const timer = setTimeout(() => {
      if (!settled && audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
        onError()
      }
    }, MP3_TIMEOUT_MS)

    audio.src = url
    audio.load()
  })
}

export function speakFallback(text, options = {}) {
  if (!text || typeof window === 'undefined') return false

  const settings = getActiveAudioSettings()
  const synth = window.speechSynthesis
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
    devLog('[audio] speechSynthesis unavailable')
    return false
  }

  loadVoices()
  synth.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  const opts = { ...DEFAULT_SPEECH_OPTIONS, ...options }
  utterance.lang = opts.lang
  utterance.rate = opts.rate
  utterance.pitch = opts.pitch
  utterance.volume = settings.voiceVolume

  const voice = pickFrenchVoice()
  if (voice) utterance.voice = voice

  utterance.onend = () => restoreMusic()
  utterance.onerror = () => restoreMusic()

  try {
    duckMusic()
    synth.speak(utterance)
    if (synth.paused) synth.resume()
    return true
  } catch {
    restoreMusic()
    devLog('[audio] speechSynthesis unavailable')
    return false
  }
}

export async function playWord(audioKey, options = {}) {
  const key = normalizeKey(audioKey)
  if (!key) return false

  const settings = getActiveAudioSettings()
  if (!settings.voiceEnabled) {
    devLog('[audio] voice disabled')
    onVoiceDisabled?.()
    return false
  }

  devLog('[audio] playWord', key)

  const text = resolveSpeechText(key)
  stopAllAudio()

  const url = getMp3Url(key)
  devLog('[audio] try mp3', url)

  try {
    const available = await isMp3Available(url)
    if (!available) throw new Error('mp3 unavailable')
    duckMusic()
    await tryPlayMp3(url, settings.voiceVolume)
    return true
  } catch {
    devLog('[audio] mp3 failed, fallback TTS', key)
    if (!text) return false
    devLog('[audio] speaking', key)
    return speakFallback(text, options)
  }
}

const SUCCESS_KEYS = ['bravo', 'excellent', 'bien_joue', 'continue_comme_ca']

export function playSuccess() {
  const key = SUCCESS_KEYS[Math.floor(Math.random() * SUCCESS_KEYS.length)]
  return playWord(key)
}

export function playError() {
  return playWord('oups')
}

if (typeof window !== 'undefined') {
  loadVoices()
}
