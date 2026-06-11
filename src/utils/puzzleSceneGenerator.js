export const PUZZLE_SCENE_WIDTH = 280
export const PUZZLE_SCENE_HEIGHT = 180

const SKY = {
  meadow: ['#87CEEB', '#B8E6FF'],
  farm: ['#7EC8E3', '#C5E8F7'],
  sky: ['#6BB6FF', '#E1F5FE'],
  pond: ['#81D4FA', '#B3E5FC'],
  garden: ['#90CAF9', '#E3F2FD'],
}

const GROUND = {
  meadow: '#7CB342',
  farm: '#BCAAA4',
  sky: '#A5D6A7',
  pond: '#4DB6AC',
  garden: '#66BB6A',
}

function svgOpen() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PUZZLE_SCENE_WIDTH} ${PUZZLE_SCENE_HEIGHT}" width="${PUZZLE_SCENE_WIDTH}" height="${PUZZLE_SCENE_HEIGHT}">`
}

function svgClose() {
  return '</svg>'
}

function drawSky(background) {
  const [top, bottom] = SKY[background] ?? SKY.meadow
  return `<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${top}"/>
      <stop offset="100%" stop-color="${bottom}"/>
    </linearGradient>
  </defs>
  <rect width="${PUZZLE_SCENE_WIDTH}" height="${PUZZLE_SCENE_HEIGHT}" fill="url(#sky)"/>`
}

function drawGround(background) {
  const color = GROUND[background] ?? GROUND.meadow
  const y = background === 'pond' ? 125 : 118
  return `<ellipse cx="140" cy="${y + 20}" rx="150" ry="35" fill="${color}" opacity="0.95"/>
  <rect x="0" y="${y}" width="${PUZZLE_SCENE_WIDTH}" height="${PUZZLE_SCENE_HEIGHT - y}" fill="${color}"/>`
}

function drawSun() {
  return `<circle cx="230" cy="38" r="22" fill="#FFD54F" stroke="#FFB300" stroke-width="2"/>
  <g stroke="#FFB300" stroke-width="3" stroke-linecap="round">
    <line x1="230" y1="8" x2="230" y2="16"/>
    <line x1="230" y1="60" x2="230" y2="68"/>
    <line x1="200" y1="38" x2="208" y2="38"/>
    <line x1="252" y1="38" x2="260" y2="38"/>
    <line x1="209" y1="17" x2="215" y2="23"/>
    <line x1="245" y1="53" x2="251" y2="59"/>
    <line x1="209" y1="59" x2="215" y2="53"/>
    <line x1="245" y1="23" x2="251" y2="17"/>
  </g>`
}

function drawCloud(x = 55, y = 42, scale = 1) {
  return `<g transform="translate(${x},${y}) scale(${scale})" fill="#fff" opacity="0.95">
    <ellipse cx="0" cy="8" rx="18" ry="12"/>
    <ellipse cx="20" cy="4" rx="22" ry="14"/>
    <ellipse cx="42" cy="10" rx="16" ry="11"/>
  </g>`
}

function drawFlower(x, y, color = '#E91E63') {
  return `<g transform="translate(${x},${y})">
    <line x1="0" y1="0" x2="0" y2="18" stroke="#388E3C" stroke-width="3"/>
    <circle cx="0" cy="-4" r="5" fill="${color}"/>
    <circle cx="-6" cy="2" r="4" fill="${color}" opacity="0.9"/>
    <circle cx="6" cy="2" r="4" fill="${color}" opacity="0.9"/>
    <circle cx="0" cy="6" r="4" fill="${color}" opacity="0.9"/>
    <circle cx="0" cy="0" r="3" fill="#FFEB3B"/>
  </g>`
}

function drawTree(x = 28, y = 95) {
  return `<g transform="translate(${x},${y})">
    <rect x="-5" y="18" width="10" height="22" fill="#795548" rx="2"/>
    <circle cx="0" cy="8" r="22" fill="#43A047"/>
    <circle cx="-12" cy="14" r="14" fill="#66BB6A"/>
    <circle cx="12" cy="14" r="14" fill="#66BB6A"/>
  </g>`
}

function drawFence() {
  return `<g fill="#8D6E63" stroke="#5D4037" stroke-width="1">
    <rect x="8" y="108" width="6" height="28" rx="1"/>
    <rect x="24" y="108" width="6" height="28" rx="1"/>
    <rect x="40" y="108" width="6" height="28" rx="1"/>
    <rect x="56" y="108" width="6" height="28" rx="1"/>
    <rect x="6" y="114" width="62" height="4" rx="1"/>
    <rect x="6" y="126" width="62" height="4" rx="1"/>
  </g>`
}

function drawEgg(x = 210, y = 138) {
  return `<ellipse cx="${x}" cy="${y}" rx="12" ry="16" fill="#FFF8E1" stroke="#FFE082" stroke-width="2"/>`
}

function drawApple(x = 220, y = 132) {
  return `<g transform="translate(${x},${y})">
    <circle cx="0" cy="0" r="10" fill="#E53935"/>
    <ellipse cx="-3" cy="-3" rx="3" ry="2" fill="#EF5350" opacity="0.6"/>
    <path d="M0,-10 Q4,-16 6,-12" stroke="#795548" stroke-width="2" fill="none"/>
    <ellipse cx="5" cy="-12" rx="4" ry="2" fill="#66BB6A"/>
  </g>`
}

function drawPondRipple() {
  return `<ellipse cx="140" cy="148" rx="55" ry="12" fill="#26C6DA" opacity="0.35"/>
  <ellipse cx="140" cy="148" rx="38" ry="8" fill="#00ACC1" opacity="0.25"/>`
}

function drawProp(name) {
  switch (name) {
    case 'sun':
      return drawSun()
    case 'cloud':
      return drawCloud(50, 35, 1)
    case 'flower':
      return drawFlower(235, 128) + drawFlower(48, 135, '#AB47BC')
    case 'tree':
      return drawTree()
    case 'fence':
      return drawFence()
    case 'egg':
      return drawEgg()
    case 'apple':
      return drawApple()
    default:
      return ''
  }
}

function drawChick(variant = 1) {
  const bodyY = variant === 2 ? 108 : 102
  return `<g transform="translate(140,${bodyY})">
    <ellipse cx="0" cy="8" rx="28" ry="24" fill="#FFEE58"/>
    <circle cx="0" cy="-14" r="20" fill="#FFEE58"/>
    <circle cx="-8" cy="-18" r="7" fill="#FFEE58"/>
    <circle cx="8" cy="-18" r="7" fill="#FFEE58"/>
    <circle cx="-6" cy="-16" r="3" fill="#212121"/>
    <circle cx="6" cy="-16" r="3" fill="#212121"/>
    <polygon points="0,-8 6,-2 0,2 -6,-2" fill="#FF8F00"/>
    <ellipse cx="-14" cy="18" rx="6" ry="4" fill="#FF8F00"/>
    <ellipse cx="14" cy="18" rx="6" ry="4" fill="#FF8F00"/>
  </g>`
}

function drawHen(variant = 1) {
  return `<g transform="translate(140,${variant === 2 ? 100 : 98})">
    <ellipse cx="0" cy="12" rx="32" ry="26" fill="#D84315"/>
    <circle cx="0" cy="-12" r="22" fill="#E64A19"/>
    <polygon points="18,-14 32,-10 18,-6" fill="#FFB300"/>
    <circle cx="-8" cy="-16" r="4" fill="#212121"/>
    <path d="M-6,-28 Q0,-38 8,-28 L0,-22 Z" fill="#BF360C"/>
    <ellipse cx="-16" cy="22" rx="7" ry="5" fill="#FFB300"/>
    <ellipse cx="16" cy="22" rx="7" ry="5" fill="#FFB300"/>
  </g>`
}

function drawCow(variant = 1) {
  const spots =
    variant === 2
      ? '<ellipse cx="-12" cy="0" rx="10" ry="8" fill="#212121"/><ellipse cx="14" cy="8" rx="8" ry="6" fill="#212121"/>'
      : '<ellipse cx="-10" cy="4" rx="9" ry="7" fill="#212121"/><ellipse cx="12" cy="-2" rx="7" ry="5" fill="#212121"/>'
  return `<g transform="translate(140,96)">
    <ellipse cx="0" cy="14" rx="38" ry="28" fill="#FAFAFA"/>
    ${spots}
    <circle cx="0" cy="-16" r="24" fill="#FAFAFA"/>
    <ellipse cx="-10" cy="-18" rx="5" ry="8" fill="#FFE0B2"/>
    <ellipse cx="10" cy="-18" rx="5" ry="8" fill="#FFE0B2"/>
    <circle cx="-8" cy="-16" r="3" fill="#212121"/>
    <circle cx="8" cy="-16" r="3" fill="#212121"/>
    <ellipse cx="-22" cy="-8" rx="8" ry="5" fill="#FFE0B2"/>
    <ellipse cx="22" cy="-8" rx="8" ry="5" fill="#FFE0B2"/>
  </g>`
}

function drawPig(variant = 1) {
  return `<g transform="translate(140,${variant === 2 ? 102 : 100})">
    <ellipse cx="0" cy="10" rx="30" ry="24" fill="#F48FB1"/>
    <circle cx="0" cy="-14" r="22" fill="#F48FB1"/>
    <ellipse cx="0" cy="-8" rx="12" ry="9" fill="#F06292"/>
    <circle cx="-4" cy="-8" r="2" fill="#880E4F"/>
    <circle cx="4" cy="-8" r="2" fill="#880E4F"/>
    <circle cx="-7" cy="-18" r="3" fill="#212121"/>
    <circle cx="7" cy="-18" r="3" fill="#212121"/>
    <ellipse cx="-12" cy="20" rx="6" ry="4" fill="#F06292"/>
    <ellipse cx="12" cy="20" rx="6" ry="4" fill="#F06292"/>
    <path d="M-8,-28 Q0,-36 8,-28" stroke="#F06292" stroke-width="3" fill="none"/>
  </g>`
}

function drawSheep(variant = 1) {
  const fluff = variant === 2 ? '#EEEEEE' : '#FAFAFA'
  return `<g transform="translate(140,98)">
    <ellipse cx="0" cy="14" rx="34" ry="24" fill="${fluff}" stroke="#E0E0E0" stroke-width="1"/>
    <circle cx="-18" cy="6" r="10" fill="${fluff}"/>
    <circle cx="18" cy="6" r="10" fill="${fluff}"/>
    <circle cx="0" cy="-2" r="12" fill="${fluff}"/>
    <rect x="-8" y="-18" width="16" height="14" fill="#424242" rx="6"/>
    <circle cx="-4" cy="-14" r="2" fill="#fff"/>
    <circle cx="4" cy="-14" r="2" fill="#fff"/>
    <ellipse cx="-10" cy="24" rx="5" ry="3" fill="#424242"/>
    <ellipse cx="10" cy="24" rx="5" ry="3" fill="#424242"/>
  </g>`
}

function drawDog(variant = 1) {
  return `<g transform="translate(140,100)">
    <ellipse cx="0" cy="10" rx="28" ry="22" fill="#8D6E63"/>
    <circle cx="0" cy="-14" r="20" fill="#A1887F"/>
    <ellipse cx="-14" cy="-18" rx="8" ry="12" fill="#8D6E63"/>
    <ellipse cx="14" cy="-18" rx="8" ry="12" fill="#8D6E63"/>
    <circle cx="-6" cy="-16" r="3" fill="#212121"/>
    <circle cx="6" cy="-16" r="3" fill="#212121"/>
    <ellipse cx="0" cy="-8" rx="8" ry="6" fill="#D7CCC8"/>
    <circle cx="0" cy="-10" r="3" fill="#212121"/>
    ${variant === 2 ? '<path d="M20,0 Q38,8 32,20" stroke="#A1887F" stroke-width="6" fill="none" stroke-linecap="round"/>' : '<path d="M18,2 Q32,10 28,18" stroke="#A1887F" stroke-width="5" fill="none" stroke-linecap="round"/>'}
    <ellipse cx="-12" cy="20" rx="6" ry="4" fill="#6D4C41"/>
    <ellipse cx="12" cy="20" rx="6" ry="4" fill="#6D4C41"/>
  </g>`
}

function drawCat(variant = 1) {
  return `<g transform="translate(140,102)">
    <ellipse cx="0" cy="8" rx="26" ry="20" fill="#FF9800"/>
    <circle cx="0" cy="-14" r="18" fill="#FFB74D"/>
    <polygon points="-14,-28 -8,-18 -18,-18" fill="#FFB74D"/>
    <polygon points="14,-28 8,-18 18,-18" fill="#FFB74D"/>
    <circle cx="-6" cy="-16" r="3" fill="#212121"/>
    <circle cx="6" cy="-16" r="3" fill="#212121"/>
    <polygon points="0,-10 4,-6 0,-2 -4,-6" fill="#F48FB1"/>
    ${variant === 2 ? '<path d="M22,0 Q40,4 36,16" stroke="#FFB74D" stroke-width="5" fill="none" stroke-linecap="round"/>' : ''}
    <line x1="-4" y1="-8" x2="-10" y2="-4" stroke="#E65100" stroke-width="1"/>
    <line x1="4" y1="-8" x2="10" y2="-4" stroke="#E65100" stroke-width="1"/>
    <ellipse cx="-10" cy="18" rx="5" ry="3" fill="#FFB74D"/>
    <ellipse cx="10" cy="18" rx="5" ry="3" fill="#FFB74D"/>
  </g>`
}

function drawRabbit(variant = 1) {
  return `<g transform="translate(140,104)">
    <ellipse cx="0" cy="8" rx="24" ry="20" fill="#F5F5F5"/>
    <circle cx="0" cy="-10" r="18" fill="#FAFAFA"/>
    <ellipse cx="-8" cy="-32" rx="6" ry="18" fill="#FAFAFA"/>
    <ellipse cx="8" cy="-32" rx="6" ry="18" fill="#FAFAFA"/>
    <ellipse cx="-8" cy="-32" rx="3" ry="12" fill="#F8BBD0" opacity="0.6"/>
    <ellipse cx="8" cy="-32" rx="3" ry="12" fill="#F8BBD0" opacity="0.6"/>
    <circle cx="-6" cy="-12" r="3" fill="#212121"/>
    <circle cx="6" cy="-12" r="3" fill="#212121"/>
    <circle cx="0" cy="-6" r="3" fill="#F48FB1"/>
    ${variant === 2 ? drawEgg(-50, 30) : ''}
    <ellipse cx="-10" cy="18" rx="5" ry="3" fill="#EEEEEE"/>
    <ellipse cx="10" cy="18" rx="5" ry="3" fill="#EEEEEE"/>
  </g>`
}

function drawDuck(variant = 1) {
  return `<g transform="translate(140,${variant === 2 ? 106 : 102})">
    <ellipse cx="0" cy="10" rx="28" ry="20" fill="#FFEE58"/>
    <circle cx="0" cy="-12" r="18" fill="#FFEE58"/>
    <ellipse cx="12" cy="-10" rx="14" ry="8" fill="#FFB300"/>
    <circle cx="-5" cy="-16" r="3" fill="#212121"/>
    <ellipse cx="-18" cy="0" rx="10" ry="6" fill="#FFD54F"/>
    <ellipse cx="18" cy="0" rx="10" ry="6" fill="#FFD54F"/>
    <ellipse cx="-10" cy="18" rx="5" ry="3" fill="#FFB300"/>
    <ellipse cx="10" cy="18" rx="5" ry="3" fill="#FFB300"/>
  </g>`
}

function drawHorse(variant = 1) {
  return `<g transform="translate(140,94)">
    <ellipse cx="0" cy="16" rx="36" ry="24" fill="#8D6E63"/>
    <rect x="-10" y="-20" width="20" height="28" fill="#A1887F" rx="8"/>
    <ellipse cx="0" cy="-28" rx="14" ry="16" fill="#A1887F"/>
    <polygon points="-8,-42 -4,-48 0,-42" fill="#A1887F"/>
    <polygon points="8,-42 4,-48 0,-42" fill="#A1887F"/>
    <circle cx="-5" cy="-30" r="2.5" fill="#212121"/>
    <circle cx="5" cy="-30" r="2.5" fill="#212121"/>
    <path d="M16,-8 L28,-20 L24,-4 Z" fill="#6D4C41"/>
    ${variant === 2 ? '<rect x="-28" y="28" width="8" height="16" fill="#5D4037" rx="2"/><rect x="20" y="28" width="8" height="16" fill="#5D4037" rx="2"/>' : '<rect x="-24" y="30" width="7" height="14" fill="#5D4037" rx="2"/><rect x="17" y="30" width="7" height="14" fill="#5D4037" rx="2"/>'}
  </g>`
}

function drawFrog(variant = 1) {
  return `<g transform="translate(140,108)">
    <ellipse cx="0" cy="6" rx="32" ry="22" fill="#66BB6A"/>
    <circle cx="-14" cy="-12" r="12" fill="#81C784"/>
    <circle cx="14" cy="-12" r="12" fill="#81C784"/>
    <circle cx="-14" cy="-12" r="5" fill="#FFF"/>
    <circle cx="14" cy="-12" r="5" fill="#FFF"/>
    <circle cx="-14" cy="-12" r="2.5" fill="#212121"/>
    <circle cx="14" cy="-12" r="2.5" fill="#212121"/>
    <path d="M-8,4 Q0,12 8,4" stroke="#388E3C" stroke-width="2" fill="none"/>
    ${variant === 2 ? '<ellipse cx="-20" cy="18" rx="8" ry="4" fill="#43A047"/><ellipse cx="20" cy="18" rx="8" ry="4" fill="#43A047"/>' : '<ellipse cx="-16" cy="16" rx="6" ry="3" fill="#43A047"/><ellipse cx="16" cy="16" rx="6" ry="3" fill="#43A047"/>'}
  </g>`
}

function drawFish(variant = 1) {
  const color = variant === 2 ? '#42A5F5' : '#FF7043'
  return `<g transform="translate(140,118)">
    <ellipse cx="0" cy="0" rx="36" ry="22" fill="${color}"/>
    <polygon points="-36,0 -52,-14 -52,14" fill="${color}"/>
    <circle cx="16" cy="-4" r="5" fill="#fff"/>
    <circle cx="17" cy="-4" r="2.5" fill="#212121"/>
    <path d="M-8,8 Q0,14 8,8" stroke="#E64A19" stroke-width="2" fill="none" opacity="0.5"/>
    <ellipse cx="-10" cy="0" rx="8" ry="5" fill="#fff" opacity="0.25"/>
  </g>`
}

function drawAnimal(animal, variant = 1) {
  switch (animal) {
    case 'chick':
      return drawChick(variant)
    case 'hen':
      return drawHen(variant)
    case 'cow':
      return drawCow(variant)
    case 'pig':
      return drawPig(variant)
    case 'sheep':
      return drawSheep(variant)
    case 'dog':
      return drawDog(variant)
    case 'cat':
      return drawCat(variant)
    case 'rabbit':
      return drawRabbit(variant)
    case 'duck':
      return drawDuck(variant)
    case 'horse':
      return drawHorse(variant)
    case 'frog':
      return drawFrog(variant)
    case 'fish':
      return drawFish(variant)
    default:
      return drawChick(variant)
  }
}

/**
 * Génère une scène SVG complète (280×180) à partir d'une définition de scène.
 */
export function generatePuzzleSceneSvg(scene = {}) {
  const background = scene.background ?? 'meadow'
  const props = Array.isArray(scene.props) ? scene.props : []
  const variant = scene.variant ?? 1
  const animal = scene.animal ?? 'chick'

  const parts = [
    svgOpen(),
    drawSky(background),
    drawGround(background),
    background === 'pond' ? drawPondRipple() : '',
    props.includes('cloud') ? drawCloud() : '',
    props.includes('cloud') && props.length > 1 ? drawCloud(180, 52, 0.75) : '',
    props.filter((p) => p !== 'cloud').map((prop) => drawProp(prop)).join(''),
    drawAnimal(animal, variant),
    svgClose(),
  ]

  return parts.join('')
}

const dataUrlCache = new Map()

export function generatePuzzleSceneDataUrl(scene = {}) {
  const key = JSON.stringify(scene)
  if (dataUrlCache.has(key)) {
    return dataUrlCache.get(key)
  }
  const svg = generatePuzzleSceneSvg(scene)
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  dataUrlCache.set(key, url)
  return url
}

export function resolvePuzzleImage(puzzle) {
  if (!puzzle) return null
  if (puzzle.image) return puzzle.image
  if (puzzle.scene) return generatePuzzleSceneDataUrl(puzzle.scene)
  return null
}
