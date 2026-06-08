import arbreSvg from '../assets/images/builder/arbre.svg'
import barriereSvg from '../assets/images/builder/barriere.svg'
import bleSvg from '../assets/images/builder/ble.svg'
import fleurSvg from '../assets/images/builder/fleur.svg'
import fontaineSvg from '../assets/images/builder/fontaine.svg'
import tracteurSvg from '../assets/images/builder/tracteur.svg'

export const BUILDER_ICONS = {
  fence: barriereSvg,
  flower: fleurSvg,
  tree: arbreSvg,
  tractor: tracteurSvg,
  well: fontaineSvg,
  hay: bleSvg,
}

const EMOJI_TO_ID = {
  '🚧': 'fence',
  '🌻': 'flower',
  '🌳': 'tree',
  '🚜': 'tractor',
  '⛲': 'well',
  '🌾': 'hay',
}

const ASSET_FRAGMENT_TO_ID = {
  barriere: 'fence',
  fleur: 'flower',
  arbre: 'tree',
  tracteur: 'tractor',
  fontaine: 'well',
  ble: 'hay',
}

export function resolveBuilderIcon(icon, shop) {
  if (!icon) return icon

  if (typeof icon === 'string' && EMOJI_TO_ID[icon]) {
    const id = EMOJI_TO_ID[icon]
    return BUILDER_ICONS[id] ?? shop.find((item) => item.id === id)?.icon ?? icon
  }

  if (typeof icon === 'string') {
    for (const [fragment, id] of Object.entries(ASSET_FRAGMENT_TO_ID)) {
      if (icon.includes(fragment)) {
        return BUILDER_ICONS[id] ?? shop.find((item) => item.id === id)?.icon ?? icon
      }
    }
  }

  return icon
}
