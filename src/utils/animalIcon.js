import { CHICKEN_STAGE_ICONS } from '../data/chickenAssets'
import { generateAnimalSpriteDataUrl, generateMysterySprite, generateEggSprite } from './puzzleSceneGenerator'

// Oiseaux → œuf ; les mammifères arrivent dans un cadeau.
const EGG_ANIMALS = new Set(['chicken', 'duck', 'turkey'])

const SPRITE_ANIMAL_KEY = {
  pig: 'pig', cow: 'cow', sheep: 'sheep', rabbit: 'rabbit', duck: 'duck',
  horse: 'horse', goat: 'goat', dog: 'dog', cat: 'cat', turkey: 'turkey', mouse: 'mouse',
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

// openLevel (0..3) : pour l'œuf/cadeau, ouverture progressive selon la croissance.
export function resolveStageIcon(animalKey, stage, fallbackIcon, openLevel = 0) {
  if (stage === 'egg') {
    // Œuf qui se fissure (poule/canard) ou cadeau qui s'ouvre (autres).
    return EGG_ANIMALS.has(animalKey)
      ? generateEggSprite(openLevel)
      : generateMysterySprite(openLevel)
  }
  if (animalKey === 'chicken' && CHICKEN_STAGE_ICONS[stage]) {
    return CHICKEN_STAGE_ICONS[stage]
  }
  const spriteKey = SPRITE_ANIMAL_KEY[animalKey]
  if (spriteKey && (stage === 'baby' || stage === 'adult')) {
    return generateAnimalSpriteDataUrl(spriteKey, stage)
  }
  return fallbackIcon
}
