import barnLevel1 from '../assets/images/farm/barn-level-1.svg'
import barnLevel2 from '../assets/images/farm/barn-level-2.svg'
import barnLevel3 from '../assets/images/farm/barn-level-3.svg'
import fenceLevel1 from '../assets/images/farm/fence-level-1.svg'
import fenceLevel2 from '../assets/images/farm/fence-level-2.svg'
import fenceLevel3 from '../assets/images/farm/fence-level-3.svg'
import nestLevel1 from '../assets/images/farm/nest-level-1.svg'
import nestLevel2 from '../assets/images/farm/nest-level-2.svg'
import nestLevel3 from '../assets/images/farm/nest-level-3.svg'
import gardenLevel1 from '../assets/images/farm/garden-level-1.svg'
import gardenLevel2 from '../assets/images/farm/garden-level-2.svg'
import gardenLevel3 from '../assets/images/farm/garden-level-3.svg'
import decorationLevel1 from '../assets/images/farm/decoration-level-1.svg'
import decorationLevel2 from '../assets/images/farm/decoration-level-2.svg'
import decorationLevel3 from '../assets/images/farm/decoration-level-3.svg'

const FARM_ASSET_MAP = {
  barn: { 1: barnLevel1, 2: barnLevel2, 3: barnLevel3 },
  fence: { 1: fenceLevel1, 2: fenceLevel2, 3: fenceLevel3 },
  nest: { 1: nestLevel1, 2: nestLevel2, 3: nestLevel3 },
  garden: { 1: gardenLevel1, 2: gardenLevel2, 3: gardenLevel3 },
  decoration: { 1: decorationLevel1, 2: decorationLevel2, 3: decorationLevel3 },
}

/**
 * Retourne l'URL Vite d'un asset ferme pour un niveau visuel (1–3).
 * Niveau absent ou 0 → level 1. Niveau > 3 → level 3.
 */
export function getFarmAssetSrc(part, level) {
  const clamped = Math.min(3, Math.max(1, level || 1))
  return FARM_ASSET_MAP[part]?.[clamped] ?? FARM_ASSET_MAP[part]?.[1]
}
