/* ════════════════════════════════════════════════════════════════════
   Audio doux synthétisé (Web Audio API) — aucun fichier requis.
   - Musiques d'ambiance douces par scène : 'home' (accueil) / 'farm' (ferme).
   - Coupée pendant les exercices (scene = null).
   - Petits bruitages de clic doux, adaptés enfants.
   Respecte les réglages parent : activé (musicEnabled) + volume (musicVolume).
   ════════════════════════════════════════════════════════════════════ */

let ctx = null
let masterGain = null
let enabled = true
let volume = 0.25
let currentScene = null
let stepTimer = null
let stepIndex = 0
let lastClick = 0
let clickListenerAttached = false

// Gammes pentatoniques douces (Hz). Patterns en berceuse.
const SCENES = {
  home: {
    notes: [261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66, 329.63],
    step: 760, type: 'triangle',
  },
  farm: {
    notes: [392.0, 493.88, 587.33, 659.25, 587.33, 493.88, 440.0, 493.88],
    step: 600, type: 'sine',
  },
}

function ensureCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    masterGain = ctx.createGain()
    masterGain.gain.value = volume
    masterGain.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

// Joue une note douce (attaque lente, longue extinction).
function playNote(freq, dur, type, peak) {
  if (!ctx) return
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + 0.04)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g)
  g.connect(masterGain)
  osc.start(t)
  osc.stop(t + dur + 0.05)
}

function clearLoop() {
  if (stepTimer) { clearInterval(stepTimer); stepTimer = null }
}

function runScene(scene) {
  const cfg = SCENES[scene]
  if (!cfg) return
  stepIndex = 0
  stepTimer = setInterval(() => {
    if (!enabled || !ctx) return
    const note = cfg.notes[stepIndex % cfg.notes.length]
    playNote(note, 0.9, cfg.type, 0.16)
    // contre-chant doux une note sur deux (octave au-dessus, très léger)
    if (stepIndex % 2 === 0) playNote(note * 2, 0.6, 'sine', 0.05)
    stepIndex += 1
  }, cfg.step)
}

/* ── API publique ── */

export function setSoftAudioEnabled(value) {
  enabled = Boolean(value)
  if (!enabled) {
    clearLoop()
  } else if (currentScene) {
    ensureCtx()
    if (!stepTimer) runScene(currentScene)
  }
}

export function setSoftAudioVolume(value) {
  volume = Math.max(0, Math.min(1, value))
  if (masterGain) masterGain.gain.value = volume
}

// scene : 'home' | 'farm' | null (silence, ex. pendant un exercice)
export function setSceneMusic(scene) {
  if (scene === currentScene) return
  currentScene = scene
  clearLoop()
  if (!scene || !enabled) return
  if (!SCENES[scene]) return
  ensureCtx()
  runScene(scene)
}

export function stopSceneMusic() {
  currentScene = null
  clearLoop()
}

// Petit clic doux (gated par enabled).
export function playClick() {
  if (!enabled) return
  const now = (typeof performance !== 'undefined' ? performance.now() : Date.now())
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

// Écoute globale des clics sur boutons → bruitage doux. À appeler une fois.
export function initClickSfx() {
  if (clickListenerAttached || typeof window === 'undefined') return
  clickListenerAttached = true
  window.addEventListener('pointerdown', (e) => {
    const el = e.target?.closest?.('button, [role="button"], a, .kid-card, .ans-btn, .letter-btn, .zone-coloring-zone')
    if (el) playClick()
  }, { passive: true })
}
