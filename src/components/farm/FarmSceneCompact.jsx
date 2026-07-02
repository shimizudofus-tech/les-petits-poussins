import { useEffect, useRef, useState } from 'react'
import { isImageIcon, resolveStageIcon } from '../../utils/animalIcon'
import { FARM_CATALOG, FARM_CATEGORIES, getOwned } from '../../data/farmCatalog'
import FarmArt from './FarmArt'

// type → catégorie / nom (pour les sections et le tri de l'inventaire)
const KIND_CAT = {}
const KIND_NAME = {}
FARM_CATALOG.forEach((it) => { KIND_CAT[it.id] = it.category; KIND_NAME[it.id] = it.name })
const CATEGORY_META = {}
FARM_CATEGORIES.forEach((c) => { CATEGORY_META[c.key] = { label: c.label, icon: c.icon } })
const CATEGORY_ORDER = FARM_CATEGORIES.map((c) => c.key).filter((k) => k !== 'terrain')

/* ════════════════════════════════════════════════════════════════════
   FERME VIVANTE + INVENTAIRE (Explorer)
   - Tout ce qui est ACHETÉ (farmShop) devient une instance plaçable.
   - Chaque instance est soit POSÉE sur la carte, soit RANGÉE dans l'inventaire.
   - Mode "Aménager" : barre d'inventaire en bas ; on tape un objet pour le
     poser, on glisse les objets posés pour les déplacer, on relâche un objet
     sur l'inventaire pour le ranger.
   - Ciel transparent (décor vivant partagé), sol opaque qui défile.
   - Animaux vivants (rAF : marche / idle / mange).
   ════════════════════════════════════════════════════════════════════ */

const MARGIN = 70
const MIN_WORLD = 800
const MAX_WORLD = 1600        // ~4 écrans de téléphone max : exploration courte
const SPACING = 95            // px moyen par objet visible (largeur du monde)
const MAX_VISIBLE = 14        // au-delà → rangé en inventaire (lisibilité enfant)
const rand = (min, max) => min + Math.random() * (max - min)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// RNG déterministe par clé → positions par défaut stables.
function hashStr(s) {
  let h = 1779033703 ^ s.length
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}
function rngFrom(seedStr) {
  let a = hashStr(seedStr)
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const BUILDING_SET = new Set(['house', 'barn', 'henhouse', 'stable', 'silo', 'mill', 'well',
  'greenhouse', 'bakery', 'dairy', 'beehouse', 'windpump', 'market', 'lighthouse'])
const SKY_SET = new Set(['cloud', 'bird', 'rainbow'])

// taille d'affichage par type (px)
const SIZE = {
  house: 100, barn: 96, henhouse: 80, stable: 88, silo: 74, mill: 88, well: 58,
  greenhouse: 88, bakery: 88, dairy: 84, beehouse: 76, market: 90, lighthouse: 78, windpump: 78,
  tree: 82, pine: 70, bush: 54, flower: 42, fence: 58, lamp: 54, pond: 70, haystack: 54,
  rock: 40, mushroom: 40, crops: 56, cart: 60, fountain: 80, scarecrow: 56, balloon: 60,
  statue: 60, bench: 50, signpost: 46, flag: 46, mailbox: 46, barrel: 44, kite: 54, campfire: 50,
  cloud: 90, bird: 54, rainbow: 200,
}
const sizeOf = (kind) => SIZE[kind] ?? 60

// bande verticale (bottom%) par type
function bandBottom(kind, r) {
  if (kind === 'cloud' || kind === 'bird') return 64 + r() * 18
  if (kind === 'rainbow') return 56
  if (BUILDING_SET.has(kind) || kind === 'tree' || kind === 'pine') return 24 + r() * 9
  return 12 + r() * 8
}
function centerBottom(kind) {
  if (kind === 'cloud' || kind === 'bird') return 72
  if (kind === 'rainbow') return 56
  if (BUILDING_SET.has(kind) || kind === 'tree' || kind === 'pine') return 28
  return 16
}

// liste ordonnée des types plaçables (terrain exclu : ce n'est pas un décor)
const PLACEABLE_IDS = FARM_CATALOG.map((it) => it.id).filter((id) => id !== 'terrain')

/* Construit la scène depuis farmShop + farmPlacements.
   Retourne { visible:[{key,kind,x,bottom,size,z,explicit}], inventory:[{kind,count}],
   width, invKeyOf(kind) } */
function buildScene(shop, placements) {
  // instances ordonnées (par type, puis index)
  const instances = []
  for (const id of PLACEABLE_IDS) {
    const n = getOwned(shop, id)
    for (let i = 0; i < n; i++) instances.push({ key: `${id}#${i}`, kind: id })
  }

  const explicit = []
  const defaults = []
  const stored = []
  for (const inst of instances) {
    const e = placements?.[inst.key]
    if (e?.stored) stored.push(inst)
    else if (e && e.x != null) explicit.push({ ...inst, x: e.x, bottom: e.bottom, explicit: true })
    else defaults.push(inst)
  }

  const slots = Math.max(0, MAX_VISIBLE - explicit.length)
  const visibleDefaults = defaults.slice(0, slots)
  const overflow = defaults.slice(slots)

  const visibleCount = explicit.length + visibleDefaults.length
  const width = Math.min(MAX_WORLD, Math.max(MIN_WORLD, MARGIN * 2 + visibleCount * SPACING))

  const visible = []
  for (const it of explicit) {
    visible.push({ ...it, size: sizeOf(it.kind), z: zOf(it.bottom) })
  }
  for (const it of visibleDefaults) {
    const r = rngFrom(it.key)
    const x = MARGIN + r() * (width - 2 * MARGIN)
    const bottom = bandBottom(it.kind, r)
    visible.push({ ...it, x, bottom, size: sizeOf(it.kind), z: zOf(bottom), explicit: false })
  }
  visible.sort((a, b) => a.z - b.z)

  // inventaire = rangés + débordement, groupés par type
  const invMap = new Map()
  const invKeys = new Map()    // kind → file de clés disponibles
  for (const it of [...stored, ...overflow]) {
    invMap.set(it.kind, (invMap.get(it.kind) ?? 0) + 1)
    if (!invKeys.has(it.kind)) invKeys.set(it.kind, [])
    invKeys.get(it.kind).push(it.key)
  }
  const inventory = [...invMap.entries()].map(([kind, count]) => ({ kind, count, category: KIND_CAT[kind] }))

  return { visible, inventory, width, invKeys }
}
// z toujours positif et > couches de terrain (1–4) → jamais caché/inaccessible.
// Avant (bas) = z haut → couvre l'arrière ; ciel (haut) = z plus bas mais ≥ 30.
function zOf(bottom) { return Math.round(120 - bottom) }

/* ─── Agents animaux : marche / idle / mange ─── */
const STATES = ['walk', 'idle', 'walk', 'eat', 'walk', 'idle', 'sleep']
function newAgent(x, lane) {
  return { x, lane, vx: 0, facing: pick([-1, 1]), state: 'idle', timer: rand(0.3, 1.4), bobPhase: rand(0, Math.PI * 2) }
}
function nextState(a) {
  const s = pick(STATES)
  a.state = s
  if (s === 'walk') { a.facing = pick([-1, 1]); a.vx = a.facing * rand(16, 34); a.timer = rand(2.4, 5.2) }
  else if (s === 'eat') { a.vx = 0; a.timer = rand(2.2, 3.8) }
  else if (s === 'sleep') { a.vx = 0; a.timer = rand(5, 9) }   // petite sieste 💤
  else { a.vx = 0; a.timer = rand(1.2, 2.8) }
}

export default function FarmSceneCompact({
  farmShop,
  collection,
  onAnimalClick,
  tappedKey,
  tappedReaction,
  careState = {},
  placements = {},
  onPlace,
  onStore,
  moveMode = false,
}) {
  const shop = farmShop ?? {}
  const { visible, inventory, width: worldWidth, invKeys } = buildScene(shop, placements)

  const unlocked = Object.entries(collection ?? {}).filter(([, a]) => a.unlocked)

  const viewportRef = useRef(null)
  const worldRef = useRef(null)
  const invBarRef = useRef(null)
  const invScrollRef = useRef(null)
  const invDragMoved = useRef(false)
  const removeZoneRef = useRef(null)
  const nodeRefs = useRef({})
  const spriteRefs = useRef({})
  const agents = useRef({})
  const dragMoved = useRef(false)
  const [drag, setDrag] = useState(null)   // {key, kind, size, x, bottom, removing}
  const [invTab, setInvTab] = useState('all')
  const [invSort, setInvSort] = useState('count')   // 'count' | 'name'

  // sections présentes (catégories ayant ≥1 objet) + filtre + tri
  const presentCats = CATEGORY_ORDER.filter((c) => inventory.some((it) => it.category === c))
  const activeTab = invTab !== 'all' && !presentCats.includes(invTab) ? 'all' : invTab
  const invFiltered = inventory
    .filter((it) => activeTab === 'all' || it.category === activeTab)
    .sort((a, b) => invSort === 'name'
      ? KIND_NAME[a.kind].localeCompare(KIND_NAME[b.kind])
      : (b.count - a.count) || KIND_NAME[a.kind].localeCompare(KIND_NAME[b.kind]))

  // (ré)initialise les agents quand la liste d'animaux change
  if (Object.keys(agents.current).length !== unlocked.length) {
    const next = {}
    const usable = worldWidth - 2 * MARGIN
    unlocked.forEach(([key], i) => {
      const span = usable / Math.max(1, unlocked.length)
      const x = MARGIN + span * i + span / 2
      const lane = 8 + (i % 3) * 7
      next[key] = agents.current[key] ?? newAgent(x, lane)
    })
    agents.current = next
  }

  // boucle d'animation des animaux
  useEffect(() => {
    let raf
    let last = performance.now()
    const min = MARGIN
    const max = worldWidth - MARGIN
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      for (const key of Object.keys(agents.current)) {
        const a = agents.current[key]
        a.timer -= dt
        if (a.timer <= 0) nextState(a)
        if (a.state === 'walk') {
          a.x += a.vx * dt
          if (a.x < min) { a.x = min; a.facing = 1; a.vx = Math.abs(a.vx) }
          if (a.x > max) { a.x = max; a.facing = -1; a.vx = -Math.abs(a.vx) }
        }
        a.bobPhase += dt * (a.state === 'walk' ? 8 : 3)
        const bob = (a.state === 'eat' || a.state === 'sleep') ? 0 : Math.abs(Math.sin(a.bobPhase)) * (a.state === 'walk' ? 4 : 1.8)
        const node = nodeRefs.current[key]
        if (node) {
          node.style.transform = `translate3d(${a.x}px, ${-bob}px, 0)`
          if (node.dataset.state !== a.state) node.dataset.state = a.state
        }
        const sprite = spriteRefs.current[key]
        if (sprite) {
          const eatTilt = a.state === 'eat' ? `rotate(${10 + Math.sin(a.bobPhase * 2) * 7}deg)` : 'rotate(0deg)'
          sprite.style.transform = `scaleX(${a.facing}) ${eatTilt}`
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [unlocked.length, worldWidth])

  // centre le monde au montage
  useEffect(() => {
    const vp = viewportRef.current
    if (vp) vp.scrollLeft = Math.max(0, (worldWidth - vp.clientWidth) / 2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // glisser pour explorer (pan). En mode aménagement : pan sur le sol vide,
  // mais PAS quand on attrape un décor (→ déplacement de l'objet).
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    let down = false, startX = 0, startScroll = 0
    const onDown = (e) => {
      if (moveMode && e.target?.closest?.('.fsc-decor--movable')) return
      down = true; dragMoved.current = false; startX = e.clientX ?? 0; startScroll = vp.scrollLeft
    }
    const onMove = (e) => {
      if (!down) return
      const dx = (e.clientX ?? 0) - startX
      if (Math.abs(dx) > 6) dragMoved.current = true
      vp.scrollLeft = startScroll - dx
    }
    const onUp = () => { down = false }
    vp.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      vp.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [moveMode])

  const clampX = (v) => Math.min(worldWidth - 40, Math.max(40, v))
  const clampB = (v) => Math.min(94, Math.max(4, v))   // poser n'importe où (sol → ciel)
  const toWorld = (ev) => {
    const r = worldRef.current.getBoundingClientRect()
    return {
      x: clampX((ev.clientX ?? 0) - r.left),
      bottom: clampB(((r.bottom - (ev.clientY ?? 0)) / r.height) * 100),
    }
  }
  const overInventory = (ev) => {
    const bar = invBarRef.current
    if (!bar) return false
    const r = bar.getBoundingClientRect()
    return (ev.clientY ?? 0) >= r.top
  }
  // au-dessus de la croix rouge "ranger"
  const overRemove = (ev) => {
    const z = removeZoneRef.current
    if (!z) return false
    const r = z.getBoundingClientRect()
    const x = ev.clientX ?? 0, y = ev.clientY ?? 0
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
  }
  const wantsRemove = (ev) => overRemove(ev) || overInventory(ev)

  // déplacer un objet posé (et le ranger si relâché sur la croix / l'inventaire)
  const startDecorDrag = (key, kind, size, e) => {
    if (!moveMode) return
    e.preventDefault()
    e.stopPropagation()
    setDrag({ key, kind, size, ...toWorld(e), removing: false })
    const onMove = (ev) => setDrag({ key, kind, size, ...toWorld(ev), removing: wantsRemove(ev) })
    const onUp = (ev) => {
      if (wantsRemove(ev)) onStore?.(key)
      else onPlace?.(key, toWorld(ev))
      setDrag(null)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  // poser un objet depuis l'inventaire (au centre de la vue) — sauf si on a glissé
  const placeFromInventory = (kind) => {
    if (invDragMoved.current) return
    const keys = invKeys.get(kind)
    if (!keys || !keys.length) return
    const key = keys[0]
    const vp = viewportRef.current
    const r = worldRef.current.getBoundingClientRect()
    const centerClientX = (vp.getBoundingClientRect().left) + vp.clientWidth / 2
    const x = clampX(centerClientX - r.left)
    onPlace?.(key, { x, bottom: centerBottom(kind) })
  }

  // glisser l'inventaire pour le décaler à droite/gauche (pas de barre visible)
  const startInvScroll = (e) => {
    const el = invScrollRef.current
    if (!el) return
    invDragMoved.current = false
    const startX = e.clientX ?? 0
    const startScroll = el.scrollLeft
    const onMove = (ev) => {
      const dx = (ev.clientX ?? 0) - startX
      if (Math.abs(dx) > 6) invDragMoved.current = true
      el.scrollLeft = startScroll - dx
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const handleAnimalClick = (key, animal) => {
    if (moveMode || dragMoved.current) return
    onAnimalClick?.(key, animal)
  }

  return (
    <div className="fsc-root">
      <div className={`fsc-viewport${moveMode ? ' fsc-viewport--move' : ''}`} ref={viewportRef}>
      <div className={`fsc-world${moveMode ? ' fsc-world--move' : ''}`} style={{ width: worldWidth }} ref={worldRef}>
        {/* sol qui défile (couvre les collines partagées → pas de double) */}
        <div className="fsc-hill-back" aria-hidden="true" />
        <div className="fsc-hill-mid" aria-hidden="true" />
        <div className="fsc-ground" aria-hidden="true" />
        <div className="fsc-path" aria-hidden="true" />

        {/* décors posés (déplaçables en mode aménagement) */}
        {visible.map((p) => {
          const dragging = drag?.key === p.key
          const pos = dragging ? { x: drag.x, bottom: drag.bottom } : { x: p.x, bottom: p.bottom }
          return (
            <div
              key={p.key}
              className={`fsc-decor${moveMode ? ' fsc-decor--movable' : ''}${dragging ? ' fsc-decor--dragging' : ''}`}
              style={{ left: `${pos.x}px`, bottom: `${pos.bottom}%`, zIndex: dragging ? 999 : p.z }}
              aria-hidden={!moveMode}
              onPointerDown={moveMode ? (e) => startDecorDrag(p.key, p.kind, p.size, e) : undefined}
            >
              <FarmArt kind={p.kind} width={p.size} />
            </div>
          )
        })}

        {/* animaux vivants */}
        {unlocked.map(([key, animal]) => {
          const a = agents.current[key]
          const lane = a?.lane ?? 12
          const stage = animal.currentStage
          const icon = resolveStageIcon(key, stage, animal.stages[stage]?.icon)
          const care = careState[key]
          const size = 60 - lane * 0.6
          const z = Math.round(60 - lane)
          return (
            <button
              key={key}
              type="button"
              ref={(el) => { nodeRefs.current[key] = el }}
              className={`fsc-animal${tappedKey === key ? ' fsc-animal--tapped' : ''}`}
              style={{ bottom: `${lane}%`, zIndex: z }}
              onClick={() => handleAnimalClick(key, animal)}
              aria-label={animal.name}
            >
              {care === 'hungry' && (
                <span className="farm-care-bubble farm-care-bubble--hungry" aria-hidden="true">🍽️</span>
              )}
              {care === 'happy' && (
                <span className="farm-care-bubble farm-care-bubble--happy" aria-hidden="true">❤️</span>
              )}
              {!care && (
                <span className="farm-care-bubble farm-care-bubble--sleep" aria-hidden="true">💤</span>
              )}
              {tappedKey === key && tappedReaction && (
                <span className="farm-animal-reaction" aria-hidden="true">{tappedReaction}</span>
              )}
              <span className="fsc-animal-sprite" ref={(el) => { spriteRefs.current[key] = el }} style={{ '--fsc-sz': `${size}px` }}>
                {isImageIcon(icon) ? (
                  <img src={icon} alt={animal.name} draggable={false} className="fsc-animal-img" />
                ) : (
                  <span className="fsc-animal-emoji" aria-hidden="true">{icon}</span>
                )}
              </span>
            </button>
          )
        })}
      </div>

        {!moveMode && (
          <div className="fsc-pan-hint" aria-hidden="true">⟵ glisse pour explorer ⟶</div>
        )}
      </div>

      {/* ── Croix rouge "ranger" (visible pendant un déplacement) ── */}
      {moveMode && drag && (
        <div
          className={`fsc-remove-zone${drag.removing ? ' fsc-remove-zone--active' : ''}`}
          ref={removeZoneRef}
          aria-hidden="true"
        >
          <span className="fsc-remove-x">✕</span>
          <span className="fsc-remove-label">Ranger</span>
        </div>
      )}

      {/* ── Inventaire (mode aménagement) : sections + tri ── */}
      {moveMode && (
        <div className="fsc-inventory" ref={invBarRef}>
          <div className="fsc-inv-tabs">
            <button
              type="button"
              className={`fsc-inv-tab${activeTab === 'all' ? ' fsc-inv-tab--active' : ''}`}
              onClick={() => setInvTab('all')}
            >Tout</button>
            {presentCats.map((c) => (
              <button
                key={c}
                type="button"
                className={`fsc-inv-tab${activeTab === c ? ' fsc-inv-tab--active' : ''}`}
                onClick={() => setInvTab(c)}
              >
                <span className="fsc-inv-tab-ico">{CATEGORY_META[c]?.icon}</span>
                {CATEGORY_META[c]?.label}
              </button>
            ))}
            <button
              type="button"
              className="fsc-inv-sort"
              onClick={() => setInvSort((s) => (s === 'count' ? 'name' : 'count'))}
              aria-label="Changer le tri"
            >
              {invSort === 'count' ? '🔢' : '🔤'}
            </button>
          </div>

          {invFiltered.length === 0 ? (
            <span className="fsc-inv-empty">Tout est posé ! Glisse un objet sur la croix pour le ranger.</span>
          ) : (
            <div className="fsc-inv-scroll" ref={invScrollRef} onPointerDown={startInvScroll}>
              {invFiltered.map((it) => (
                <button
                  key={it.kind}
                  type="button"
                  className="fsc-inv-item"
                  onClick={() => placeFromInventory(it.kind)}
                  aria-label={`Poser ${KIND_NAME[it.kind] ?? it.kind}`}
                  title={KIND_NAME[it.kind]}
                >
                  <FarmArt kind={it.kind} width={38} />
                  <span className="fsc-inv-count">{it.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
