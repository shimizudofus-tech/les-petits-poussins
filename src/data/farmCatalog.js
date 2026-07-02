/* ════════════════════════════════════════════════════════════════════
   CATALOGUE FERME — centaines de paliers d'amélioration.
   Modèle : gameState.farmShop = { [id]: nbAchetés }.
   - Items "leveled" (bâtiments) : nbAchetés = niveau courant (0..max).
   - Items "scatter" (arbres, fleurs…) : nbAchetés = nombre d'instances.
   - Items "terrain" : chaque achat agrandit le monde.
   Le monde s'agrandit petit à petit (terrain) et se remplit (le reste).
   ════════════════════════════════════════════════════════════════════ */

// Coût d'un palier : baseCost * growth^owned, arrondi.
function costAt(item, owned) {
  return Math.round(item.baseCost * Math.pow(item.growth, owned))
}

// ─── Bâtiments (leveled, noms distincts) ───
const BUILDINGS = [
  { id: 'barn', name: 'Grange', icon: '🏚️', baseCost: 8, growth: 1.35, max: 8 },
  { id: 'house', name: 'Maison', icon: '🏡', baseCost: 10, growth: 1.35, max: 8 },
  { id: 'henhouse', name: 'Poulailler', icon: '🐔', baseCost: 7, growth: 1.32, max: 6 },
  { id: 'stable', name: 'Écurie', icon: '🐴', baseCost: 9, growth: 1.34, max: 6 },
  { id: 'silo', name: 'Silo', icon: '🌾', baseCost: 12, growth: 1.36, max: 6 },
  { id: 'mill', name: 'Moulin', icon: '🌬️', baseCost: 14, growth: 1.38, max: 6 },
  { id: 'well', name: 'Puits', icon: '🪣', baseCost: 6, growth: 1.30, max: 5 },
  { id: 'greenhouse', name: 'Serre', icon: '🪴', baseCost: 13, growth: 1.36, max: 6 },
  { id: 'bakery', name: 'Boulangerie', icon: '🥖', baseCost: 16, growth: 1.40, max: 6 },
  { id: 'dairy', name: 'Laiterie', icon: '🥛', baseCost: 15, growth: 1.38, max: 6 },
  { id: 'beehouse', name: 'Rucher', icon: '🐝', baseCost: 11, growth: 1.35, max: 5 },
  { id: 'windpump', name: 'Éolienne', icon: '💨', baseCost: 18, growth: 1.40, max: 5 },
  { id: 'market', name: 'Marché', icon: '🏪', baseCost: 20, growth: 1.42, max: 5 },
  { id: 'lighthouse', name: 'Phare', icon: '🗼', baseCost: 24, growth: 1.45, max: 4 },
]

// ─── Nature & déco (scatter : on en pose plusieurs) ───
const SCATTER = [
  { id: 'tree', name: 'Arbre', icon: '🌳', baseCost: 4, growth: 1.12, max: 40 },
  { id: 'pine', name: 'Sapin', icon: '🌲', baseCost: 5, growth: 1.12, max: 30 },
  { id: 'flower', name: 'Fleurs', icon: '🌷', baseCost: 3, growth: 1.10, max: 40 },
  { id: 'bush', name: 'Buisson', icon: '🌿', baseCost: 3, growth: 1.10, max: 30 },
  { id: 'fence', name: 'Clôture', icon: '🚧', baseCost: 3, growth: 1.11, max: 30 },
  { id: 'lamp', name: 'Lampadaire', icon: '🏮', baseCost: 6, growth: 1.14, max: 20 },
  { id: 'pond', name: 'Étang', icon: '💧', baseCost: 9, growth: 1.20, max: 8 },
  { id: 'haystack', name: 'Botte de foin', icon: '🌾', baseCost: 4, growth: 1.12, max: 24 },
  { id: 'rock', name: 'Rocher', icon: '🪨', baseCost: 3, growth: 1.10, max: 20 },
  { id: 'mushroom', name: 'Champignons', icon: '🍄', baseCost: 3, growth: 1.10, max: 20 },
  { id: 'crops', name: 'Champ cultivé', icon: '🌽', baseCost: 5, growth: 1.13, max: 24 },
  { id: 'cart', name: 'Charrette', icon: '🛒', baseCost: 7, growth: 1.16, max: 12 },
]

// ─── Spéciaux / déco rares ───
const SPECIALS = [
  { id: 'fountain', name: 'Fontaine', icon: '⛲', baseCost: 18, growth: 1.4, max: 3 },
  { id: 'scarecrow', name: 'Épouvantail', icon: '🎃', baseCost: 8, growth: 1.3, max: 4 },
  { id: 'balloon', name: 'Montgolfière', icon: '🎈', baseCost: 22, growth: 1.45, max: 3 },
  { id: 'statue', name: 'Statue', icon: '🗿', baseCost: 16, growth: 1.4, max: 4 },
  { id: 'bench', name: 'Banc', icon: '🪑', baseCost: 5, growth: 1.2, max: 8 },
  { id: 'signpost', name: 'Pancarte', icon: '🪧', baseCost: 4, growth: 1.2, max: 8 },
  { id: 'flag', name: 'Drapeau', icon: '🚩', baseCost: 6, growth: 1.25, max: 6 },
  { id: 'mailbox', name: 'Boîte aux lettres', icon: '📮', baseCost: 5, growth: 1.2, max: 4 },
  { id: 'barrel', name: 'Tonneau', icon: '🛢️', baseCost: 4, growth: 1.15, max: 12 },
  { id: 'kite', name: 'Cerf-volant', icon: '🪁', baseCost: 9, growth: 1.3, max: 4 },
  { id: 'campfire', name: 'Feu de camp', icon: '🔥', baseCost: 7, growth: 1.25, max: 4 },
  // Trésors exclusifs : jamais achetables aux étoiles, uniquement via la série
  // de connexion (voir streakRewards.js — jour 6 et jour 7).
  { id: 'magic_tree', name: 'Arbre magique', icon: '🌳', baseCost: 0, growth: 1, max: 1 },
  { id: 'castle', name: 'Château', icon: '🏰', baseCost: 0, growth: 1, max: 1 },
]

export const STREAK_LOCKED_ITEM_IDS = new Set(['magic_tree', 'castle'])
export function isStreakLocked(id) {
  return STREAK_LOCKED_ITEM_IDS.has(id)
}

// ─── Ciel : nuages, oiseaux, arc-en-ciel ───
const SKY = [
  { id: 'cloud', name: 'Nuage', icon: '☁️', baseCost: 4, growth: 1.12, max: 20 },
  { id: 'bird', name: 'Oiseaux', icon: '🐦', baseCost: 5, growth: 1.13, max: 16 },
  { id: 'rainbow', name: 'Arc-en-ciel', icon: '🌈', baseCost: 30, growth: 1.6, max: 3 },
]

// ─── Terrain : agrandit le monde ───
const TERRAIN = {
  id: 'terrain', name: 'Agrandir le terrain', icon: '🗺️', baseCost: 10, growth: 1.22, max: 20,
}

export const FARM_CATEGORIES = [
  { key: 'terrain', label: 'Terrain', icon: '🗺️', items: [TERRAIN] },
  { key: 'buildings', label: 'Bâtiments', icon: '🏡', items: BUILDINGS },
  { key: 'nature', label: 'Nature & déco', icon: '🌳', items: SCATTER },
  { key: 'sky', label: 'Ciel', icon: '☁️', items: SKY },
  { key: 'special', label: 'Spéciaux', icon: '✨', items: SPECIALS },
]

const CATALOG_BY_ID = {}
for (const cat of FARM_CATEGORIES) {
  for (const item of cat.items) CATALOG_BY_ID[item.id] = { ...item, category: cat.key }
}

export const FARM_CATALOG = Object.values(CATALOG_BY_ID)

// Set gratuit (version gratuite) : de quoi démarrer une ferme.
// 1 maison + arbres/sapins + fleurs + buissons + clôture. Le reste = version complète.
export const FREE_ITEM_IDS = new Set(['house', 'tree', 'pine', 'flower', 'bush', 'fence'])
export function isItemFree(id) {
  return FREE_ITEM_IDS.has(id)
}

// Nombre total de paliers achetables (somme des max).
export const TOTAL_FARM_UPGRADES = FARM_CATALOG.reduce((s, it) => s + it.max, 0)

export function getCatalogItem(id) {
  return CATALOG_BY_ID[id] ?? null
}

export function getOwned(farmShop, id) {
  return farmShop?.[id] ?? 0
}

export function isItemMaxed(farmShop, id) {
  const item = CATALOG_BY_ID[id]
  if (!item) return true
  return getOwned(farmShop, id) >= item.max
}

export function getItemCost(farmShop, id) {
  const item = CATALOG_BY_ID[id]
  if (!item) return Infinity
  return costAt(item, getOwned(farmShop, id))
}

// Total de paliers possédés (pour le niveau global de la ferme).
export function countOwnedUpgrades(farmShop) {
  if (!farmShop) return 0
  return Object.values(farmShop).reduce((s, n) => s + (n || 0), 0)
}

export function computeFarmWorldLevel(farmShop) {
  return 1 + Math.floor(countOwnedUpgrades(farmShop) / 4)
}

// Largeur du monde : grandit avec le terrain.
export const WORLD_BASE_WIDTH = 1400
export const WORLD_STEP = 320
export function computeWorldWidth(farmShop) {
  return WORLD_BASE_WIDTH + getOwned(farmShop, 'terrain') * WORLD_STEP
}
