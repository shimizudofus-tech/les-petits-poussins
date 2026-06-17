export const SCREENS = {
  TAMAGOTCHI: 'tamagotchi',
  LEVEL_SELECT: 'level-select',
  /** @deprecated Migré vers MATERNELLE_SECTION */
  MINIGAME_MATERNELLE: 'minigame-maternelle',
  MATERNELLE_SECTION: 'maternelle-section',
  MINIGAME_CP: 'minigame-cp',
  MINIGAME_CE1: 'minigame-ce1',
  MINIGAME_CE2: 'minigame-ce2',
  UPGRADE: 'upgrade',
  COLLECTION: 'collection',
  FARM_EXPLORE: 'farm-explore',
  PARENT: 'parent',
  BADGES: 'badges',
  /** @deprecated Ancien écran grille — migré vers UPGRADE */
  BUILDER: 'builder',
  /** @deprecated Ancien nom — migré vers COLLECTION */
  DEX: 'dex',
}

const LEGACY_SCREEN_MAP = {
  [SCREENS.BUILDER]: SCREENS.UPGRADE,
  [SCREENS.DEX]: SCREENS.COLLECTION,
  [SCREENS.MINIGAME_MATERNELLE]: SCREENS.MATERNELLE_SECTION,
}

const VALID_SCREENS = new Set(Object.values(SCREENS))

export function normalizeScreen(screen) {
  return LEGACY_SCREEN_MAP[screen] ?? screen
}

export function isValidScreen(screen) {
  const normalized = normalizeScreen(screen)
  return VALID_SCREENS.has(normalized)
}

export function resolveScreen(screen, fallback = SCREENS.TAMAGOTCHI) {
  const normalized = normalizeScreen(screen)
  return isValidScreen(normalized) ? normalized : fallback
}
