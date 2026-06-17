import { CHICKEN_STAGE_ICONS } from '../data/chickenAssets'
import { generateAnimalSpriteDataUrl, generateMysterySprite } from './puzzleSceneGenerator'

const EGG_ANIMALS = new Set(['chicken', 'duck'])

const SPRITE_ANIMAL_KEY = {
  pig: 'pig', cow: 'cow', sheep: 'sheep', rabbit: 'rabbit', duck: 'duck',
}

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
  if (stage === 'egg') {
    return EGG_ANIMALS.has(animalKey) ? CHICKEN_STAGE_ICONS.egg : generateMysterySprite()
  }
  const spriteKey = SPRITE_ANIMAL_KEY[animalKey]
  if (spriteKey && (stage === 'baby' || stage === 'adult')) {
    return generateAnimalSpriteDataUrl(spriteKey, stage)
  }
  return fallbackIcon
}
