export const DEFAULT_FARM_UPGRADES = {
  barn: 1,
  nest: 1,
  fence: 1,
  garden: 1,
  decoration: 0,
  animals: 1,
}

export const FARM_UPGRADE_MAX_LEVEL = 3

/** @deprecated Alias visuel — identique au plafond gameplay */
export const FARM_VISUAL_MAX_LEVEL = FARM_UPGRADE_MAX_LEVEL

export const FARM_UPGRADE_PARTS = [
  { key: 'barn', label: 'Grange', icon: '🏠' },
  { key: 'nest', label: 'Nid', icon: '🪺' },
  { key: 'fence', label: 'Enclos', icon: '🚧' },
  { key: 'garden', label: 'Jardin', icon: '🌻' },
  { key: 'decoration', label: 'Décoration', icon: '⛲' },
  { key: 'animals', label: 'Animaux', icon: '🐔' },
]

const UPGRADE_KEYS = new Set(FARM_UPGRADE_PARTS.map((part) => part.key))

export function isValidFarmUpgradeKey(partKey) {
  return UPGRADE_KEYS.has(partKey)
}

export function getUpgradeCost(currentLevel) {
  return 5 * (currentLevel + 1)
}

export function isFarmUpgradeAtMax(level) {
  return level >= FARM_UPGRADE_MAX_LEVEL
}

export function getVisualLevel(level) {
  return Math.min(FARM_UPGRADE_MAX_LEVEL, Math.max(0, level))
}

export function clampFarmUpgrades(upgrades = {}) {
  const clamped = { ...DEFAULT_FARM_UPGRADES, ...upgrades }

  for (const key of UPGRADE_KEYS) {
    const value = clamped[key]
    if (typeof value !== 'number' || value < 0) {
      clamped[key] = DEFAULT_FARM_UPGRADES[key]
    } else {
      clamped[key] = Math.min(FARM_UPGRADE_MAX_LEVEL, Math.floor(value))
    }
  }

  return clamped
}

/**
 * Niveau global affiché : 1 + total des améliorations au-dessus des valeurs de départ.
 * Ex. grange 1→3 (+2) et jardin 1→2 (+1) → farmLevel = 4
 */
export function computeFarmLevel(farmUpgrades) {
  const upgrades = farmUpgrades ?? DEFAULT_FARM_UPGRADES
  const extra = FARM_UPGRADE_PARTS.reduce((sum, { key }) => {
    const current = upgrades[key] ?? DEFAULT_FARM_UPGRADES[key]
    const base = DEFAULT_FARM_UPGRADES[key]
    return sum + Math.max(0, current - base)
  }, 0)

  return 1 + extra
}
