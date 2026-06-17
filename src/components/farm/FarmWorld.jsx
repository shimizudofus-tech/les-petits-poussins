import { useEffect, useRef, useMemo } from 'react'
import AnimalIcon from '../AnimalIcon'
import FarmArt from './FarmArt'
import { getOwned } from '../../data/farmCatalog'
import { isImageIcon, resolveStageIcon } from '../../utils/animalIcon'

const GROUND_MARGIN = 90
const rand = (min, max) => min + Math.random() * (max - min)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// RNG déterministe (mulberry32) à partir d'une chaîne → placement stable.
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

// Largeur d'affichage par type (px de base, ajustée par scale).
const ART_WIDTH = {
  house: 130, barn: 120, henhouse: 96, stable: 100, silo: 80, mill: 96, well: 84,
  greenhouse: 100, bakery: 100, dairy: 96, beehouse: 86, market: 100, lighthouse: 84,
  windpump: 86, tree: 92, pine: 76, bush: 76, flower: 70, fence: 96, lamp: 64,
  pond: 150, haystack: 80, rock: 64, mushroom: 64, crops: 80, cart: 80,
  fountain: 96, scarecrow: 80, balloon: 64, statue: 72, bench: 80,
  signpost: 64, flag: 60, mailbox: 60, barrel: 64, kite: 72, campfire: 72,
  cloud: 120, bird: 76, rainbow: 240,
}

// Densité CONSTANTE : la largeur suit la quantité de décor (≈ SLOT px par
// objet) → jamais entassé, jamais vide. Le terrain ajoute de l'espace bonus.
const SLOT = 56             // espacement moyen par objet (profondeur = densité visuelle)
const MIN_SPAN = 560        // largeur mini (petite ferme tient à l'écran)
const TERRAIN_EXTRA = 160   // espace bonus par niveau de terrain
// Perspective continue dans la bande de sol (bas 0–32%, horizon ≈ 32%).
// t=0 → loin (haut, petit) ; t=1 → près (bas, gros). Cohérence d'échelle.
const FAR_Y = 46, NEAR_Y = 4            // bottom% (loin = haut sur la colline)
const FAR_SCALE = 0.42, NEAR_SCALE = 1.2

const BUILDINGS = ['barn', 'house', 'henhouse', 'stable', 'silo', 'mill', 'well',
  'greenhouse', 'bakery', 'dairy', 'beehouse', 'windpump', 'market', 'lighthouse']
const SCATTER = ['tree', 'pine', 'flower', 'bush', 'fence', 'lamp', 'pond', 'haystack',
  'rock', 'mushroom', 'crops', 'cart', 'fountain', 'scarecrow', 'balloon',
  'statue', 'bench', 'signpost', 'flag', 'mailbox', 'barrel', 'kite', 'campfire']
// éléments du ciel (placés en hauteur, dérivent)
const SKY = ['cloud', 'bird', 'rainbow']
const SKY_BAND = { cloud: [8, 26], bird: [14, 34], rainbow: [30, 38] }

// Zones thématiques ordonnées (gauche→droite) → paysage cohérent : prairie,
// verger, village, champs, parc. Chaque "kind" forme un amas contigu.
const ZONE_ORDER = [
  'flower', 'mushroom', 'bush', 'rock', 'crops',          // prairie
  'tree', 'pine',                                          // verger / forêt
  'well', 'house', 'henhouse', 'barn', 'stable', 'silo',   // village
  'greenhouse', 'bakery', 'dairy', 'beehouse', 'market', 'mill', 'windpump', 'lighthouse',
  'haystack', 'cart', 'fence', 'scarecrow',                // champs
  'pond', 'fountain', 'bench', 'statue', 'lamp',           // parc / loisirs
  'signpost', 'flag', 'mailbox', 'barrel', 'kite', 'campfire', 'balloon',
]
// espacement (px) par objet selon sa taille → amas denses mais lisibles
const KIND_SLOT = {
  flower: 34, mushroom: 38, rock: 40, barrel: 40, kite: 44, mailbox: 44, signpost: 44,
  flag: 42, bush: 48, crops: 46, bench: 54, lamp: 50, campfire: 48, scarecrow: 54,
  balloon: 56, haystack: 52, cart: 58, well: 60, tree: 66, pine: 58, fence: 60,
  statue: 56, fountain: 70, pond: 84,
  house: 120, barn: 118, henhouse: 96, stable: 100, silo: 78, greenhouse: 100,
  bakery: 100, dairy: 96, beehouse: 84, market: 104, mill: 92, windpump: 84, lighthouse: 80,
}
const BUILDING_SET = new Set(BUILDINGS)
const COMPACT_WIDTH = 380
const MAX_COMPACT_DECOR = 12

// Scène compacte pour Explorer (mobile, pas de scroll) : max 12 décors.
function buildCompactScene(farmShop) {
  const allGroundKinds = [...BUILDINGS, ...SCATTER]
  const ownedKinds = allGroundKinds.filter((id) => getOwned(farmShop, id) > 0)

  // 1 ou 2 instances par kind, jusqu'à MAX_COMPACT_DECOR
  const picks = []
  if (ownedKinds.length === 0) {
    picks.push({ kind: 'flower', n: 3 }, { kind: 'bush', n: 2 })
  } else {
    const perKind = Math.max(1, Math.floor(MAX_COMPACT_DECOR / ownedKinds.length))
    for (const kind of ownedKinds) {
      if (picks.reduce((s, p) => s + p.n, 0) >= MAX_COMPACT_DECOR) break
      const n = Math.min(getOwned(farmShop, kind), perKind)
      if (n > 0) picks.push({ kind, n })
    }
  }

  const ground = []
  picks.forEach(({ kind, n }) => {
    for (let i = 0; i < n; i++) {
      const big = BUILDING_SET.has(kind)
      ground.push({ id: kind, key: `c-${kind}-${i}`, kind, big, baseScale: 1 })
    }
  })

  const margin = 40
  const span = COMPACT_WIDTH - 2 * margin
  const r = rngFrom('compact-scene')
  ground.forEach((it, i) => {
    const frac = ground.length > 1 ? i / (ground.length - 1) : 0.5
    it.x = margin + frac * span + (r() - 0.5) * 18
    const t = it.big ? 0.65 + r() * 0.35 : 0.15 + r() * 0.85
    it.baseY = FAR_Y - t * (FAR_Y - NEAR_Y)
    const depthScale = FAR_SCALE + t * (NEAR_SCALE - FAR_SCALE)
    it.scale = depthScale * (it.big ? 0.7 : 0.75)
    it.z = 10 + Math.round(t * 200)
  })
  ground.sort((a, b) => a.z - b.z)

  // Ciel compact : max 1 de chaque type possédé, max 4 au total
  const sky = []
  SKY.forEach((kind) => {
    if (sky.length >= 4) return
    if (!getOwned(farmShop, kind)) return
    const r2 = rngFrom(`csky-${kind}`)
    const band = SKY_BAND[kind] ?? [10, 28]
    sky.push({
      key: `csky-${kind}`,
      kind,
      x: margin + r2() * span,
      top: band[0] + r2() * (band[1] - band[0]),
      scale: kind === 'rainbow' ? 0.7 : 0.55 + r2() * 0.35,
      dur: 20 + r2() * 12,
      delay: -r2() * 8,
      sky: true,
    })
  })

  return { props: ground, sky, width: COMPACT_WIDTH }
}

// Construit la scène (sol + ciel + largeur) à partir des compteurs farmShop.
function buildScene(farmShop) {
  // instances groupées par zone (kind contigu)
  const ground = []
  ZONE_ORDER.forEach((id) => {
    const n = getOwned(farmShop, id)
    const big = BUILDING_SET.has(id)
    const baseScale = big ? 0.9 + getOwned(farmShop, id) * 0.06 : 1
    for (let i = 0; i < n; i++) ground.push({ id, key: `${id}-${i}`, kind: id, big, baseScale })
  })

  const sky = []
  SKY.forEach((id) => {
    const n = getOwned(farmShop, id)
    for (let i = 0; i < n; i++) sky.push({ id, key: `${id}-${i}`, kind: id, sky: true })
  })

  const terrain = getOwned(farmShop, 'terrain')

  // placement par curseur : chaque zone défile en x, amas denses
  let cursor = GROUND_MARGIN
  let prevKind = null
  ground.forEach((it) => {
    const r = rngFrom(it.key)
    const slot = KIND_SLOT[it.kind] ?? 60
    if (prevKind && prevKind !== it.kind) cursor += 40 + terrain * 6   // respiration entre zones
    prevKind = it.kind
    it.x = cursor + slot * 0.5 + (r() - 0.5) * slot * 0.3
    cursor += slot
    // profondeur t : bâtiments au premier plan, déco étagée sur la colline
    const t = it.big ? 0.6 + r() * 0.4 : r()
    it.baseY = FAR_Y - t * (FAR_Y - NEAR_Y)
    const depthScale = FAR_SCALE + t * (NEAR_SCALE - FAR_SCALE)
    it.scale = it.baseScale * depthScale
    it.z = 10 + Math.round(t * 200)
  })

  const span = Math.max(MIN_SPAN, cursor - GROUND_MARGIN)
  const width = span + 2 * GROUND_MARGIN

  ground.sort((a, b) => a.z - b.z)  // loin (z bas) peint d'abord → près au-dessus

  sky.forEach((it, i) => {
    const r = rngFrom(it.key)
    const n = sky.length
    const frac = n > 1 ? (i + 0.5) / n : 0.5
    it.x = GROUND_MARGIN + frac * span + (r() - 0.5) * span * 0.3
    const band = SKY_BAND[it.kind] ?? [10, 28]
    it.top = band[0] + r() * (band[1] - band[0])
    it.scale = it.kind === 'rainbow' ? 1 : 0.7 + r() * 0.6
    it.dur = 18 + r() * 22   // vitesse de dérive
    it.delay = -r() * 20
  })

  return { props: ground, sky, width }
}

function DecorNode({ p }) {
  const w = (ART_WIDTH[p.kind] ?? 80) * p.scale
  if (p.sky) {
    const cls = p.kind === 'bird' ? 'fw-sky-prop fw-sky-prop--bird'
      : p.kind === 'rainbow' ? 'fw-sky-prop fw-sky-prop--rainbow'
        : 'fw-sky-prop fw-sky-prop--cloud'
    return (
      <div
        className={cls}
        style={{ left: p.x, top: `${p.top}%`, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
        aria-hidden="true"
      >
        <FarmArt kind={p.kind} width={w} />
      </div>
    )
  }
  return (
    <div
      className="fw-prop"
      style={{ left: p.x, bottom: `${p.baseY}%`, zIndex: p.z }}
      aria-hidden="true"
    >
      <FarmArt kind={p.kind} width={w} />
    </div>
  )
}

/* ─── Agents animaux : marche / idle / mange ─── */
const STATES = ['walk', 'idle', 'walk', 'eat', 'walk']
function newAgent(x) {
  return { x, baseY: rand(0, 12), vx: 0, facing: pick([-1, 1]), state: 'idle', timer: rand(0.4, 1.6), bobPhase: rand(0, Math.PI * 2) }
}
function nextState(a) {
  const s = pick(STATES)
  a.state = s
  if (s === 'walk') { a.facing = pick([-1, 1]); a.vx = a.facing * rand(22, 46); a.timer = rand(2.2, 4.8) }
  else if (s === 'eat') { a.vx = 0; a.timer = rand(2.0, 3.6) }
  else { a.vx = 0; a.timer = rand(1.0, 2.6) }
}

export default function FarmWorld({
  farmShop,
  collection,
  onAnimalClick,
  tappedKey,
  tappedReaction,
  feedMode = false,
  fedSet,
  compact = false,
}) {
  const shop = farmShop ?? {}
  const { props, sky, width: worldWidth } = useMemo(
    () => compact ? buildCompactScene(shop) : buildScene(shop),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(shop), compact]
  )
  const groundMaxX = worldWidth - (compact ? 60 : 150)

  const unlocked = Object.entries(collection ?? {}).filter(([, a]) => a.unlocked)

  const viewportRef = useRef(null)
  const nodeRefs = useRef({})
  const spriteRefs = useRef({})
  const agents = useRef({})
  const boundsRef = useRef({ min: GROUND_MARGIN, max: groundMaxX })
  boundsRef.current = { min: GROUND_MARGIN, max: groundMaxX }

  if (Object.keys(agents.current).length !== unlocked.length) {
    const next = {}
    unlocked.forEach(([key], i) => {
      const span = (groundMaxX - GROUND_MARGIN) / Math.max(1, unlocked.length)
      next[key] = agents.current[key] ?? newAgent(GROUND_MARGIN + span * i + span / 2)
    })
    agents.current = next
  }

  useEffect(() => {
    let raf
    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const { min, max } = boundsRef.current
      for (const key of Object.keys(agents.current)) {
        const a = agents.current[key]
        a.timer -= dt
        if (a.timer <= 0) nextState(a)
        if (a.state === 'walk') {
          a.x += a.vx * dt
          if (a.x < min) { a.x = min; a.facing = 1; a.vx = Math.abs(a.vx) }
          if (a.x > max) { a.x = max; a.facing = -1; a.vx = -Math.abs(a.vx) }
        }
        a.bobPhase += dt * (a.state === 'walk' ? 9 : 3)
        const bob = a.state === 'eat' ? 0 : Math.abs(Math.sin(a.bobPhase)) * (a.state === 'walk' ? 5 : 2)
        const node = nodeRefs.current[key]
        if (node) node.style.transform = `translate3d(${a.x}px, ${-(a.baseY) - bob}px, 0)`
        const sprite = spriteRefs.current[key]
        if (sprite) {
          const eatTilt = a.state === 'eat' ? `rotate(${8 + Math.sin(a.bobPhase * 2) * 6}deg)` : 'rotate(0deg)'
          sprite.style.transform = `scaleX(${a.facing}) ${eatTilt}`
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [unlocked.length])

  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    if (compact) return   // scène fixe, pas de scroll

    vp.scrollLeft = Math.max(0, (worldWidth - vp.clientWidth) / 2)

    let down = false, startX = 0, startScroll = 0
    let idleUntil = performance.now() + 4500
    let dir = 1, raf, last = performance.now()
    const AUTO_SPEED = 16

    const wake = () => { idleUntil = performance.now() + 4500 }
    const onDown = (e) => { down = true; startX = e.clientX ?? 0; startScroll = vp.scrollLeft; wake() }
    const onMove = (e) => { if (down) { vp.scrollLeft = startScroll - ((e.clientX ?? 0) - startX); wake() } }
    const onUp = () => { down = false; wake() }
    const onWheel = () => wake()

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const maxScroll = vp.scrollWidth - vp.clientWidth
      if (maxScroll > 4 && !down && now > idleUntil) {
        let x = vp.scrollLeft + dir * AUTO_SPEED * dt
        if (x >= maxScroll) { x = maxScroll; dir = -1; idleUntil = now + 1500 }
        else if (x <= 0) { x = 0; dir = 1; idleUntil = now + 1500 }
        vp.scrollLeft = x
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    vp.addEventListener('pointerdown', onDown)
    vp.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      vp.removeEventListener('pointerdown', onDown)
      vp.removeEventListener('wheel', onWheel)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [worldWidth, compact])

  return (
    <div className={`fw-viewport${compact ? ' fw-viewport--compact' : ''}`} ref={viewportRef}>
      <div className="fw-world" style={{ width: worldWidth }}>
        <div className="fw-sky" />
        <div className="fw-sun" />
        <div className="fw-clouds">
          <span className="fw-cloud fw-cloud--1" />
          <span className="fw-cloud fw-cloud--2" />
          <span className="fw-cloud fw-cloud--3" />
          <span className="fw-cloud fw-cloud--4" />
        </div>
        <span className="fw-bird fw-bird--1" />
        <span className="fw-bird fw-bird--2" />
        {sky.map((p) => <DecorNode key={p.key} p={p} />)}

        <div className="fw-hill fw-hill--back" />
        <div className="fw-hill fw-hill--mid" />
        <div className="fw-ground" />
        <div className="fw-path" />

        {props.map((p) => <DecorNode key={p.key} p={p} />)}

        {unlocked.map(([key, animal]) => {
          const stage = animal.currentStage
          const icon = resolveStageIcon(key, stage, animal.stages[stage]?.icon)
          const isFed = fedSet?.has(key) ?? false
          return (
            <button
              key={key}
              type="button"
              ref={(el) => { nodeRefs.current[key] = el }}
              className={`fw-animal${isFed ? ' fw-animal--fed' : ''}`}
              onClick={() => onAnimalClick?.(key, animal)}
              aria-label={animal.name}
            >
              {feedMode && (
                <span className={`farm-animal-feed-badge${isFed ? ' farm-animal-feed-badge--done' : ''}`} aria-hidden="true">
                  {isFed ? '✅' : '🍎'}
                </span>
              )}
              {!feedMode && tappedKey === key && tappedReaction && (
                <span className="farm-animal-reaction" aria-hidden="true">{tappedReaction}</span>
              )}
              <span className="fw-animal-sprite" ref={(el) => { spriteRefs.current[key] = el }}>
                {isImageIcon(icon) ? (
                  <img src={icon} alt="" draggable={false} className="fw-animal-img" />
                ) : (
                  <AnimalIcon icon={icon} alt="" className="fw-animal-emoji" />
                )}
              </span>
            </button>
          )
        })}
      </div>

      {!compact && <div className="fw-pan-hint" aria-hidden="true">⟵ glisse pour explorer ⟶</div>}
    </div>
  )
}
