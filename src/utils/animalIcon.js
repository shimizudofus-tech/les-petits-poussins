import { CHICKEN_STAGE_ICONS } from '../data/chickenAssets'

export function isImageIcon(icon) {
  if (typeof icon !== 'string' || icon.length === 0) return false
  return (
    icon.startsWith('/') ||
    icon.startsWith('http') ||
    icon.startsWith('data:') ||
    icon.startsWith('blob:') ||
    icon.includes('.svg') ||
    icon.includes('.png') ||
    icon.includes('.webp') ||
    icon.includes('/assets/')
  )
}

export function resolveStageIcon(animalKey, stage, fallbackIcon) {
  if (animalKey === 'chicken' && CHICKEN_STAGE_ICONS[stage]) {
    return CHICKEN_STAGE_ICONS[stage]
  }
  return fallbackIcon
}
