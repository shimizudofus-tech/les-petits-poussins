// Ambiance — drives the evolving background.
// Four independent axes combine into one scene config:
//   • time of day  (real clock)      → sky colours + sun/moon/stars
//   • season       (real calendar)   → hills/ground tint + falling particles
//   • animal stage (egg/baby/adult)  → how lively the scene feels
//   • farm level   (progression)     → density of background life

export const TIMES = ['dawn', 'day', 'dusk', 'night']
export const SEASONS = ['spring', 'summer', 'autumn', 'winter']

export function getTimeOfDay(date = new Date()) {
  const h = date.getHours()
  if (h >= 5 && h < 8) return 'dawn'
  if (h >= 8 && h < 18) return 'day'
  if (h >= 18 && h < 21) return 'dusk'
  return 'night'
}

export function getSeason(date = new Date()) {
  const m = date.getMonth() // 0 = Jan
  if (m >= 2 && m <= 4) return 'spring'
  if (m >= 5 && m <= 7) return 'summer'
  if (m >= 8 && m <= 10) return 'autumn'
  return 'winter'
}

// Sky gradients per time of day (top → mid → bottom).
const SKY = {
  dawn: { top: '#ffd9a0', mid: '#ffb6c1', bottom: '#cdb4e8', glow: '#ffe2b0' },
  day: { top: '#5bb8ff', mid: '#9fdcff', bottom: '#e6f7ff', glow: '#fff6c8' },
  dusk: { top: '#ff9e57', mid: '#ff6f9c', bottom: '#7a55b8', glow: '#ffd08a' },
  night: { top: '#10183f', mid: '#1f2a63', bottom: '#33408a', glow: '#cdd6ff' },
}

// Season tints for the rolling hills + ground + the kind of particles that fall.
const SEASON = {
  spring: { hillBack: '#a5d66c', hillFront: '#7cb342', ground: '#8bc34a', particle: 'petal', accent: '#ff8fb1' },
  summer: { hillBack: '#74c365', hillFront: '#45a047', ground: '#5eb15f', particle: 'sparkle', accent: '#ffd54f' },
  autumn: { hillBack: '#cda14a', hillFront: '#c08a3e', ground: '#cf9d52', particle: 'leaf', accent: '#ef6c00' },
  winter: { hillBack: '#cfd8dc', hillFront: '#aebcc4', ground: '#e3eaee', particle: 'snow', accent: '#90caf9' },
}

// How many particles + ambient creatures, scaled by stage and farm level.
const STAGE_LIFE = { egg: 0, baby: 1, adult: 2 }

export function getAmbiance({ date = new Date(), stage = 'egg', farmLevel = 1 } = {}) {
  const time = getTimeOfDay(date)
  const season = getSeason(date)
  const sky = SKY[time]
  const s = SEASON[season]
  const life = STAGE_LIFE[stage] ?? 0

  // Night dims the falling particles; winter always snows even at night.
  const particleCount = season === 'winter' ? 14 : Math.min(16, 6 + farmLevel * 2 + life * 2)
  const creatures = Math.min(3, life + (farmLevel >= 3 ? 1 : 0))

  return {
    time,
    season,
    stage,
    farmLevel,
    celestial: time === 'night' ? 'moon' : 'sun',
    showStars: time === 'night',
    particleType: s.particle,
    particleCount,
    creatures,
    cssVars: {
      '--sky-top': sky.top,
      '--sky-mid': sky.mid,
      '--sky-bottom': sky.bottom,
      '--sky-glow': sky.glow,
      '--hill-back': s.hillBack,
      '--hill-front': s.hillFront,
      '--ground': s.ground,
      '--season-accent': s.accent,
    },
  }
}
