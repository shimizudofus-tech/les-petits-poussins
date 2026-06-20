/* ════════════════════════════════════════════════════════════════════
   Audio d'ambiance.
   - Musique par scène : 'home' (accueil) / 'farm' (ferme) → vrais MP3
     ElevenLabs (public/audio/music/), en boucle. Coupée pendant les exercices.
   - Petits clics doux synthétisés (Web Audio).
   Respecte les réglages parent : activé (musicEnabled) + volume (musicVolume).
   ════════════════════════════════════════════════════════════════════ */

let enabled = true
let volume = 0.25
let currentScene = null
let lastClick = 0
let clickListenerAttached = false

// Musique (MP3 en boucle)
const MUSIC_VERSION = '1'
let musicEl = null
let musicUrl = null

function musicSrc(scene) {
  const base = import.meta.env.BASE_URL
  return `${base}audio/music/${scene}.mp3?v=${MUSIC_VERSION}`
}

function ensureMusicEl() {
  if (typeof Audio === 'undefined') return null
  if (!musicEl) {
    musicEl = new Audio()
    musicEl.loop = true
    musicEl.preload = 'auto'
    musicEl.volume = volume
  }
  return musicEl
}

function playCurrent() {
  if (!enabled || !currentScene) return
  const el = ensureMusicEl()
  if (!el) return
  const url = musicSrc(currentScene)
  if (musicUrl !== url) {
    musicUrl = url
    el.src = url
  }
  el.volume = volume
  el.play().catch(() => {}) // peut être bloqué tant qu'aucune interaction
}

/* ── Clic doux synthétisé ── */
let ctx = null
function ensureCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

/* ── API publique ── */

export function setSoftAudioEnabled(value) {
  enabled = Boolean(value)
  if (!enabled) {
    if (musicEl) musicEl.pause()
  } else {
    playCurrent()
  }
}

export function setSoftAudioVolume(value) {
  volume = Math.max(0, Math.min(1, value))
  if (musicEl) musicEl.volume = volume
}

// scene : 'home' | 'farm' | null (silence, ex. pendant un exercice)
export function setSceneMusic(scene) {
  if (scene === currentScene) return
  currentScene = scene
  if (!scene) {
    if (musicEl) musicEl.pause()
    return
  }
  playCurrent()
}

export function stopSceneMusic() {
  currentScene = null
  if (musicEl) musicEl.pause()
}

// Baisse la musique pendant une voix/cri (puis remontée).
export function duckSoftMusic(on) {
  if (musicEl) musicEl.volume = on ? volume * 0.25 : volume
}

// Petit clic doux (gated par enabled).
export function playClick() {
  if (!enabled) return
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
  if (now - lastClick < 45) return
  lastClick = now
  const c = ensureCtx()
  if (!c) return
  const t = c.currentTime
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(660, t)
  osc.frequency.exponentialRampToValueAtTime(990, t + 0.05)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.13, t + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t)
  osc.stop(t + 0.16)
}

// Écoute globale des clics → bruitage + démarre la musique au 1er contact.
export function initClickSfx() {
  if (clickListenerAttached || typeof window === 'undefined') return
  clickListenerAttached = true
  window.addEventListener(
    'pointerdown',
    (e) => {
      // 1er geste : démarre la musique si en attente (autoplay débloqué).
      if (enabled && currentScene && musicEl && musicEl.paused) musicEl.play().catch(() => {})
      else if (enabled && currentScene && !musicEl) playCurrent()
      const el = e.target?.closest?.('button, [role="button"], a, .kid-card, .ans-btn, .letter-btn, .zone-coloring-zone')
      if (el) playClick()
    },
    { passive: true },
  )
}
