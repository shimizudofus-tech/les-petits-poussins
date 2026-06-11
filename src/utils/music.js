import { getActiveAudioSettings } from './audioSettings'

const DUCK_RATIO = 0.2
const MP3_URL = '/audio/music/background.mp3'

let mp3Element = null
let isPlaying = false
let userVolume = 0.25
let ducked = false
let unlockAttached = false

function devLog(...args) {
  if (import.meta.env.DEV) console.info('[music]', ...args)
}

function getDuckVolume() {
  return userVolume * DUCK_RATIO
}

function applyMp3Volume() {
  if (!mp3Element) return
  mp3Element.volume = ducked ? getDuckVolume() : userVolume
}

export async function isMusicFileAvailable() {
  try {
    const response = await fetch(MP3_URL, { method: 'HEAD' })
    if (!response.ok) return false
    const contentType = response.headers.get('content-type') ?? ''
    return contentType.includes('audio')
  } catch {
    return false
  }
}

export function setMusicVolume(volume) {
  userVolume = Math.max(0, Math.min(1, volume))
  applyMp3Volume()
}

export function duckMusic() {
  ducked = true
  applyMp3Volume()
}

export function restoreMusic() {
  ducked = false
  applyMp3Volume()
}

async function startMp3Loop() {
  mp3Element = new Audio(MP3_URL)
  mp3Element.loop = true
  mp3Element.volume = userVolume
  await mp3Element.play()
}

export async function startBackgroundMusic() {
  const settings = getActiveAudioSettings()
  if (!settings.musicEnabled) return false

  if (isPlaying && mp3Element) {
    applyMp3Volume()
    return true
  }

  const available = await isMusicFileAvailable()
  if (!available) {
    devLog('Aucune musique trouvée. Ajoute public/audio/music/background.mp3')
    return false
  }

  try {
    userVolume = settings.musicVolume
    await startMp3Loop()
    isPlaying = true
    devLog('background.mp3 started')
    return true
  } catch (error) {
    devLog('lecture musique impossible', error)
    stopBackgroundMusic()
    return false
  }
}

export function stopBackgroundMusic() {
  isPlaying = false
  ducked = false

  if (mp3Element) {
    mp3Element.pause()
    mp3Element.currentTime = 0
    mp3Element = null
  }

  devLog('stopped')
}

export async function toggleBackgroundMusic() {
  if (isPlaying) {
    stopBackgroundMusic()
    return false
  }
  return startBackgroundMusic()
}

export function isMusicPlaying() {
  return isPlaying
}

export function unlockAudioOnFirstInteraction(getSettings = getActiveAudioSettings) {
  if (typeof window === 'undefined' || unlockAttached) return
  unlockAttached = true

  const unlock = async () => {
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('click', unlock)
    window.removeEventListener('touchstart', unlock)

    const settings = getSettings()
    if (settings.musicEnabled) {
      await startBackgroundMusic()
    }
  }

  window.addEventListener('pointerdown', unlock, { passive: true })
  window.addEventListener('click', unlock, { passive: true })
  window.addEventListener('touchstart', unlock, { passive: true })
}
