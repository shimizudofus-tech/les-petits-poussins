export const PUZZLE_SCENE_WIDTH = 280
export const PUZZLE_SCENE_HEIGHT = 180

// Shaded body gradients (top light → bottom darker) give the animals depth.
const ANIMAL_GRADS = {
  chick: ['#FFF59D', '#F9A825'],
  hen: ['#FFFFFF', '#D7DDE0'],
  cow: ['#FFFFFF', '#DCE0E2'],
  pig: ['#FAC9DA', '#EC6FA0'],
  sheep: ['#FFFFFF', '#DADFE3'],
  dog: ['#C9AE9C', '#9C7B68'],
  cat: ['#FFCC80', '#F57C00'],
  rabbit: ['#FFFFFF', '#DFE3E6'],
  duck: ['#FFF176', '#FBC02D'],
  horse: ['#E0BC93', '#B07D4F'],
  frog: ['#9CCC65', '#43A047'],
  fish1: ['#FFAB91', '#E64A19'],
  fish2: ['#90CAF9', '#1565C0'],
}

const gradKey = (animal, variant) =>
  animal === 'fish' ? (variant === 2 ? 'fish2' : 'fish1') : animal

function animalGradDef(animal, variant) {
  const [c0, c1] = ANIMAL_GRADS[gradKey(animal, variant)] ?? ANIMAL_GRADS.chick
  return `<linearGradient id="gBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></linearGradient>`
}

function svgOpen(w = PUZZLE_SCENE_WIDTH, h = PUZZLE_SCENE_HEIGHT) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`
}
const svgClose = () => '</svg>'

function buildSceneDefs(animal, variant) {
  return `<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BBE6FB"/><stop offset="1" stop-color="#E9F7FF"/></linearGradient>
    <linearGradient id="hillB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B6DD85"/><stop offset="1" stop-color="#9CCC65"/></linearGradient>
    <linearGradient id="hillF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CCC65"/><stop offset="1" stop-color="#7CB342"/></linearGradient>
    <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFF6C8"/><stop offset="1" stop-color="#FFE082"/></radialGradient>
    <radialGradient id="pond" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="#9CE0EC"/><stop offset="1" stop-color="#4FC3D7"/></radialGradient>
    ${animalGradDef(animal, variant)}
  </defs>`
}

/* ── Scene decor (so no puzzle piece is ever blank) ── */
function cloud(cx, cy, s) {
  return `<g transform="translate(${cx},${cy}) scale(${s})" fill="#ffffff" opacity="0.95">
    <ellipse cx="-15" cy="4" rx="15" ry="10"/><ellipse cx="3" cy="-3" rx="17" ry="13"/>
    <ellipse cx="19" cy="5" rx="13" ry="10"/><rect x="-28" y="6" width="56" height="9" rx="4.5"/></g>`
}
function sun(cx, cy) {
  let rays = ''
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4
    rays += `<line x1="${(cx + Math.cos(a) * 20).toFixed(1)}" y1="${(cy + Math.sin(a) * 20).toFixed(1)}" x2="${(cx + Math.cos(a) * 28).toFixed(1)}" y2="${(cy + Math.sin(a) * 28).toFixed(1)}"/>`
  }
  return `<g stroke="#FFCA28" stroke-width="3" stroke-linecap="round">${rays}</g>
    <circle cx="${cx}" cy="${cy}" r="16" fill="url(#sun)" stroke="#FFB300" stroke-width="2"/>`
}
function tuft(x, y) {
  return `<path d="M ${x} ${y} l -5 -11 M ${x} ${y} l 0 -14 M ${x} ${y} l 5 -11" fill="none" stroke="#558B2F" stroke-width="2.5" stroke-linecap="round"/>`
}
function flower(x, y, color) {
  return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 16}" stroke="#558B2F" stroke-width="2.5" stroke-linecap="round"/>
    <g transform="translate(${x},${y - 18})"><circle cx="-6" r="4.5" fill="${color}"/><circle cx="6" r="4.5" fill="${color}"/><circle cy="-6" r="4.5" fill="${color}"/><circle cy="6" r="4.5" fill="${color}"/><circle r="4" fill="#FFF176"/></g>`
}
function drawScene(scene) {
  const bg = scene.background ?? 'meadow'
  const variant = scene.variant ?? 1
  const sunX = variant === 2 ? 236 : 44
  const cloudA = variant === 2 ? cloud(70, 28, 0.8) : cloud(210, 30, 0.9)
  const cloudB = cloud(variant === 2 ? 150 : 120, 22, 0.62)
  let accent = ''
  if (bg === 'farm') {
    accent = `<g stroke="#A1887F" stroke-width="3" stroke-linecap="round"><line x1="232" y1="122" x2="232" y2="150"/><line x1="252" y1="122" x2="252" y2="150"/><line x1="272" y1="122" x2="272" y2="150"/><line x1="226" y1="130" x2="278" y2="130"/><line x1="226" y1="140" x2="278" y2="140"/></g>`
  } else if (bg === 'pond') {
    accent = `<ellipse cx="140" cy="166" rx="120" ry="18" fill="url(#pond)" opacity="0.9"/><ellipse cx="64" cy="162" rx="18" ry="6" fill="#66BB6A" opacity="0.85"/>`
  } else if (bg === 'garden') {
    accent = flower(96, 168, '#BA68C8') + flower(186, 170, '#FF8A65')
  }
  return `
    <rect width="${PUZZLE_SCENE_WIDTH}" height="${PUZZLE_SCENE_HEIGHT}" rx="16" ry="16" fill="url(#sky)"/>
    ${sun(sunX, 40)}${cloudA}${cloudB}
    <path d="M -12 148 Q 80 112 150 134 Q 224 152 292 122 L 292 192 L -12 192 Z" fill="url(#hillB)"/>
    <path d="M -12 160 Q 92 128 172 150 Q 244 166 292 146 L 292 192 L -12 192 Z" fill="url(#hillF)"/>
    ${accent}
    ${tuft(24, 168)}${tuft(58, 172)}${tuft(214, 170)}${tuft(256, 166)}
    ${flower(40, 170, '#EF5350')}${flower(238, 168, '#FFEE58')}
    <rect x="4" y="4" width="272" height="172" rx="14" ry="14" fill="none" stroke="#fff" stroke-width="2" opacity="0.5"/>`
}

/* ── Reusable face parts ── */
function eye(x, y, r = 5) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#3a2a2a"/><circle cx="${x + r * 0.32}" cy="${y - r * 0.34}" r="${r * 0.4}" fill="#fff"/>`
}
function cheeks(x, y, r = 5, fill = '#FFAB91') {
  return `<circle cx="${-x}" cy="${y}" r="${r}" fill="${fill}" opacity="0.5"/><circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="0.5"/>`
}
function gloss(cx, cy, rx, ry) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="0.22"/>`
}

/* ── Animal bodies (centred near 0,0; reused by puzzles AND sprites) ── */
function bodyChick() {
  return `
    <ellipse cx="-22" cy="22" rx="11" ry="9" fill="url(#gBody)" stroke="#F9A825" stroke-width="3" transform="rotate(-18 -22 22)"/>
    <ellipse cx="22" cy="22" rx="11" ry="9" fill="url(#gBody)" stroke="#F9A825" stroke-width="3" transform="rotate(18 22 22)"/>
    <ellipse cx="0" cy="20" rx="36" ry="34" fill="url(#gBody)" stroke="#F9A825" stroke-width="3.5"/>
    <circle cx="0" cy="-22" r="27" fill="url(#gBody)" stroke="#F9A825" stroke-width="3.5"/>
    ${gloss(-8, -34, 12, 8)}
    <path d="M-10,-49 Q-9,-56 -5,-50 M-4,-50 Q-2,-58 2,-50 M10,-49 Q9,-56 5,-50" fill="none" stroke="#F9A825" stroke-width="3"/>
    ${eye(-9, -24, 5)}${eye(9, -24, 5)}
    <path d="M-8,-12 L9,-16 L-8,-20 Z" fill="#FF8F00" stroke="#E65100" stroke-width="1.5"/>
    ${cheeks(17, -12, 5)}
    <path d="M-18,46 l-9,9 M-18,46 l0,12 M-18,46 l9,9 M18,46 l-9,9 M18,46 l0,12 M18,46 l9,9" stroke="#FF8F00" stroke-width="3.5" fill="none"/>`
}
function bodyHen() {
  return `
    <path d="M30,6 Q60,-8 60,18 Q60,42 34,34 Z" fill="url(#gBody)" stroke="#C9A2A2" stroke-width="3"/>
    <ellipse cx="0" cy="22" rx="38" ry="33" fill="url(#gBody)" stroke="#C9A2A2" stroke-width="3.5"/>
    <circle cx="0" cy="-20" r="27" fill="url(#gBody)" stroke="#C9A2A2" stroke-width="3.5"/>
    ${gloss(-8, -30, 11, 7)}
    <path d="M-13,-44 Q-9,-56 -2,-47 Q2,-58 8,-47 Q15,-56 14,-42 Z" fill="#EF5350" stroke="#C62828" stroke-width="2.5"/>
    ${eye(-9, -22, 5)}${eye(9, -22, 5)}
    <path d="M-3,-12 L-21,-9 L-3,-5 Z" fill="#FFB300" stroke="#E65100" stroke-width="1.5"/>
    <path d="M3,-12 L21,-9 L3,-5 Z" fill="#FFB300" stroke="#E65100" stroke-width="1.5"/>
    <path d="M-3,-3 q-5,7 0,12" fill="none" stroke="#EF5350" stroke-width="3.5"/>
    ${cheeks(18, -10, 5)}
    <path d="M-14,52 l-7,8 M-14,52 l3,11 M-14,52 l9,7 M14,52 l-9,7 M14,52 l-3,11 M14,52 l7,8" stroke="#FF8F00" stroke-width="3.5" fill="none"/>`
}
function bodyCow() {
  return `
    <ellipse cx="0" cy="26" rx="40" ry="30" fill="url(#gBody)" stroke="#9DA8AE" stroke-width="3.5"/>
    <ellipse cx="-20" cy="24" rx="13" ry="11" fill="#7A5446"/>
    <ellipse cx="22" cy="36" rx="10" ry="8" fill="#7A5446"/>
    <path d="M-22,52 h12 v9 h-12 Z M10,52 h12 v9 h-12 Z" fill="#7A5446"/>
    <path d="M-27,-32 Q-36,-46 -25,-48 Q-20,-39 -18,-31 Z" fill="#ECEFF1" stroke="#9E9E9E" stroke-width="2.5"/>
    <path d="M27,-32 Q36,-46 25,-48 Q20,-39 18,-31 Z" fill="#ECEFF1" stroke="#9E9E9E" stroke-width="2.5"/>
    <ellipse cx="-31" cy="-16" rx="11" ry="9" fill="url(#gBody)" stroke="#9DA8AE" stroke-width="3"/>
    <ellipse cx="31" cy="-16" rx="11" ry="9" fill="url(#gBody)" stroke="#9DA8AE" stroke-width="3"/>
    <circle cx="0" cy="-18" r="29" fill="url(#gBody)" stroke="#9DA8AE" stroke-width="3.5"/>
    <ellipse cx="-13" cy="-27" rx="9" ry="7" fill="#7A5446"/>
    <ellipse cx="0" cy="3" rx="20" ry="15" fill="#F8BBD0" stroke="#F06292" stroke-width="2.5"/>
    <circle cx="-7" cy="3" r="2.6" fill="#C2185B"/><circle cx="7" cy="3" r="2.6" fill="#C2185B"/>
    ${eye(-10, -19, 5.5)}${eye(10, -19, 5.5)}
    ${cheeks(22, -8, 5)}`
}
function bodyPig() {
  return `
    <path d="M34,30 q12,-2 8,10 q-4,8 -10,2" fill="url(#gBody)" stroke="#EC407A" stroke-width="3"/>
    <ellipse cx="0" cy="24" rx="40" ry="30" fill="url(#gBody)" stroke="#EC407A" stroke-width="3.5"/>
    ${gloss(-10, 12, 14, 8)}
    <path d="M-22,52 h12 v9 h-12 Z M10,52 h12 v9 h-12 Z" fill="#F48FB1" stroke="#EC407A" stroke-width="2.5"/>
    <path d="M-30,-34 Q-40,-30 -32,-18 L-20,-26 Z" fill="#F48FB1" stroke="#EC407A" stroke-width="2.5"/>
    <path d="M30,-34 Q40,-30 32,-18 L20,-26 Z" fill="#F48FB1" stroke="#EC407A" stroke-width="2.5"/>
    <circle cx="0" cy="-16" r="30" fill="url(#gBody)" stroke="#EC407A" stroke-width="3.5"/>
    <ellipse cx="0" cy="-2" rx="17" ry="13" fill="#F48FB1" stroke="#EC407A" stroke-width="2.5"/>
    <ellipse cx="-6" cy="-2" rx="3.5" ry="5" fill="#C2185B"/><ellipse cx="6" cy="-2" rx="3.5" ry="5" fill="#C2185B"/>
    ${eye(-11, -22, 5)}${eye(11, -22, 5)}
    ${cheeks(20, -10, 5, '#F06292')}`
}
function bodySheep() {
  const wool = [
    [-26, -2, 14], [-18, -20, 13], [0, -26, 14], [18, -20, 13],
    [26, -2, 14], [22, 18, 14], [0, 26, 15], [-22, 18, 14],
  ]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gBody)" stroke="#CBD3D8" stroke-width="2.5"/>`)
    .join('')
  return `
    <path d="M-16,40 v16 M16,40 v16" stroke="#8D6E63" stroke-width="6"/>
    ${wool}
    <ellipse cx="0" cy="0" rx="20" ry="22" fill="#fff" stroke="#CBD3D8" stroke-width="2"/>
    <ellipse cx="0" cy="2" rx="17" ry="19" fill="#C8A98E" stroke="#A1856E" stroke-width="3"/>
    <ellipse cx="-22" cy="0" rx="7" ry="9" fill="#C8A98E" stroke="#A1856E" stroke-width="2.5"/>
    <ellipse cx="22" cy="0" rx="7" ry="9" fill="#C8A98E" stroke="#A1856E" stroke-width="2.5"/>
    ${eye(-7, -2, 4.5)}${eye(7, -2, 4.5)}
    <ellipse cx="0" cy="9" rx="3.5" ry="2.6" fill="#5a4a42"/>
    ${cheeks(13, 6, 4)}`
}
function bodyDog() {
  return `
    <ellipse cx="0" cy="26" rx="34" ry="28" fill="url(#gBody)" stroke="#9C7B68" stroke-width="3.5"/>
    <ellipse cx="0" cy="34" rx="18" ry="16" fill="#EFE0D6"/>
    <path d="M-20,52 h11 v9 h-11 Z M9,52 h11 v9 h-11 Z" fill="#9C7B68" stroke="#7A5E4E" stroke-width="2.5"/>
    <ellipse cx="-27" cy="-12" rx="12" ry="23" fill="#8A6A57" stroke="#7A5E4E" stroke-width="3" transform="rotate(16 -27 -12)"/>
    <ellipse cx="27" cy="-12" rx="12" ry="23" fill="#8A6A57" stroke="#7A5E4E" stroke-width="3" transform="rotate(-16 27 -12)"/>
    <circle cx="0" cy="-14" r="27" fill="url(#gBody)" stroke="#9C7B68" stroke-width="3.5"/>
    ${gloss(-9, -24, 11, 7)}
    <ellipse cx="0" cy="2" rx="16" ry="13" fill="#F3EAE3" stroke="#B89B89" stroke-width="2.5"/>
    ${eye(-10, -16, 5)}${eye(10, -16, 5)}
    <ellipse cx="0" cy="-3" rx="6.5" ry="5" fill="#3a2a2a"/>
    <path d="M0,2 v7" stroke="#7A5E4E" stroke-width="2"/>
    <path d="M0,9 q6,3 6,-3" fill="#EF7B85" stroke="#C62828" stroke-width="1.5"/>
    ${cheeks(19, 0, 5)}`
}
function bodyCat() {
  return `
    <path d="M30,40 q26,4 20,-22 q-3,-12 -12,-8 q8,6 5,16 q-3,10 -15,8 Z" fill="url(#gBody)" stroke="#F57C00" stroke-width="3"/>
    <ellipse cx="0" cy="28" rx="30" ry="26" fill="url(#gBody)" stroke="#F57C00" stroke-width="3.5"/>
    <ellipse cx="0" cy="34" rx="15" ry="14" fill="#FFE7C4"/>
    <path d="M-18,52 h10 v8 h-10 Z M8,52 h10 v8 h-10 Z" fill="#FFB74D" stroke="#F57C00" stroke-width="2.5"/>
    <path d="M-26,-40 L-10,-22 L-30,-18 Z" fill="url(#gBody)" stroke="#F57C00" stroke-width="3"/>
    <path d="M26,-40 L10,-22 L30,-18 Z" fill="url(#gBody)" stroke="#F57C00" stroke-width="3"/>
    <path d="M-22,-36 l11,13 -13,3 Z" fill="#FFCDD2"/><path d="M22,-36 l-11,13 13,3 Z" fill="#FFCDD2"/>
    <circle cx="0" cy="-12" r="26" fill="url(#gBody)" stroke="#F57C00" stroke-width="3.5"/>
    ${gloss(-9, -22, 10, 6)}
    <path d="M-22,-20 h-14 M-22,-12 h-15 M22,-20 h14 M22,-12 h15" stroke="#8D5b3a" stroke-width="1.6"/>
    ${eye(-10, -14, 5.5)}${eye(10, -14, 5.5)}
    <path d="M-5,-3 L5,-3 L0,2 Z" fill="#EF7B85" stroke="#C62828" stroke-width="1.2"/>
    <path d="M0,2 v3 M0,5 q-4,3 -7,1 M0,5 q4,3 7,1" fill="none" stroke="#8D5b3a" stroke-width="1.6"/>`
}
function bodyRabbit() {
  return `
    <ellipse cx="-10" cy="-44" rx="9" ry="26" fill="url(#gBody)" stroke="#B7BFC4" stroke-width="3" transform="rotate(-8 -10 -44)"/>
    <ellipse cx="10" cy="-44" rx="9" ry="26" fill="url(#gBody)" stroke="#B7BFC4" stroke-width="3" transform="rotate(8 10 -44)"/>
    <ellipse cx="-10" cy="-44" rx="4" ry="17" fill="#F8BBD0" opacity="0.7" transform="rotate(-8 -10 -44)"/>
    <ellipse cx="10" cy="-44" rx="4" ry="17" fill="#F8BBD0" opacity="0.7" transform="rotate(8 10 -44)"/>
    <ellipse cx="0" cy="24" rx="32" ry="30" fill="url(#gBody)" stroke="#B7BFC4" stroke-width="3.5"/>
    <ellipse cx="-22" cy="48" rx="13" ry="9" fill="#F5F5F5" stroke="#B7BFC4" stroke-width="2.5"/>
    <ellipse cx="22" cy="48" rx="13" ry="9" fill="#F5F5F5" stroke="#B7BFC4" stroke-width="2.5"/>
    <circle cx="0" cy="-8" r="26" fill="url(#gBody)" stroke="#B7BFC4" stroke-width="3.5"/>
    ${gloss(-9, -18, 10, 6)}
    ${eye(-10, -10, 5)}${eye(10, -10, 5)}
    <path d="M-5,2 L5,2 L0,7 Z" fill="#F06292" stroke="#C2185B" stroke-width="1.2"/>
    <path d="M0,7 v4" stroke="#C2185B" stroke-width="1.6"/>
    ${cheeks(16, 2, 5)}`
}
function bodyDuck() {
  return `
    <path d="M28,14 q26,-6 22,14 q-3,12 -16,6 Z" fill="url(#gBody)" stroke="#F9A825" stroke-width="3"/>
    <ellipse cx="0" cy="22" rx="38" ry="30" fill="url(#gBody)" stroke="#F9A825" stroke-width="3.5"/>
    <circle cx="0" cy="-18" r="26" fill="url(#gBody)" stroke="#F9A825" stroke-width="3.5"/>
    ${gloss(-8, -28, 10, 6)}
    <path d="M6,-14 q28,-3 26,11 q-2,9 -26,4 Z" fill="#FF9800" stroke="#F57C00" stroke-width="2.5"/>
    ${eye(-5, -22, 5)}${eye(11, -22, 5)}
    ${cheeks(18, -10, 5)}
    <path d="M-16,52 q-10,7 -2,10 M-2,52 q-10,7 -2,10" fill="none" stroke="#FF9800" stroke-width="3.5"/>
    <path d="M-22,24 q14,10 0,22" fill="none" stroke="#FBC02D" stroke-width="3"/>`
}
function bodyHorse() {
  return `
    <ellipse cx="0" cy="28" rx="33" ry="27" fill="url(#gBody)" stroke="#B07D4F" stroke-width="3.5"/>
    <path d="M-19,52 h11 v9 h-11 Z M8,52 h11 v9 h-11 Z" fill="#B07D4F" stroke="#9C6B3F" stroke-width="2.5"/>
    <ellipse cx="-23" cy="-36" rx="8" ry="13" fill="url(#gBody)" stroke="#B07D4F" stroke-width="2.5" transform="rotate(-16 -23 -36)"/>
    <ellipse cx="23" cy="-36" rx="8" ry="13" fill="url(#gBody)" stroke="#B07D4F" stroke-width="2.5" transform="rotate(16 23 -36)"/>
    <circle cx="0" cy="-14" r="27" fill="url(#gBody)" stroke="#B07D4F" stroke-width="3.5"/>
    ${gloss(-9, -24, 11, 7)}
    <ellipse cx="0" cy="6" rx="18" ry="15" fill="#F0DCC0" stroke="#B07D4F" stroke-width="2.5"/>
    <path d="M-18,-40 Q-2,-34 -2,-50 Q-12,-52 -18,-40 Z" fill="#7B4B2A"/>
    <path d="M18,-40 Q2,-34 2,-50 Q12,-52 18,-40 Z" fill="#7B4B2A"/>
    <path d="M-5,-46 Q0,-56 5,-46 Q0,-40 -5,-46 Z" fill="#7B4B2A"/>
    ${eye(-10, -14, 5)}${eye(10, -14, 5)}
    <ellipse cx="-6" cy="7" rx="2.6" ry="3.4" fill="#8D5b3a"/><ellipse cx="6" cy="7" rx="2.6" ry="3.4" fill="#8D5b3a"/>
    ${cheeks(20, -2, 5)}`
}
function bodyFrog() {
  return `
    <ellipse cx="0" cy="22" rx="42" ry="30" fill="url(#gBody)" stroke="#388E3C" stroke-width="3.5"/>
    <ellipse cx="-30" cy="44" rx="13" ry="8" fill="#66BB6A" stroke="#388E3C" stroke-width="3"/>
    <ellipse cx="30" cy="44" rx="13" ry="8" fill="#66BB6A" stroke="#388E3C" stroke-width="3"/>
    <ellipse cx="0" cy="26" rx="22" ry="14" fill="#C5E1A5" opacity="0.7"/>
    <circle cx="-18" cy="-18" r="17" fill="#81C784" stroke="#388E3C" stroke-width="3"/>
    <circle cx="18" cy="-18" r="17" fill="#81C784" stroke="#388E3C" stroke-width="3"/>
    <circle cx="-18" cy="-18" r="8" fill="#fff"/><circle cx="18" cy="-18" r="8" fill="#fff"/>
    <circle cx="-16" cy="-17" r="4" fill="#2c2c2c"/><circle cx="20" cy="-17" r="4" fill="#2c2c2c"/>
    <path d="M-16,14 Q0,26 16,14" fill="none" stroke="#2E7D32" stroke-width="3.5"/>
    ${cheeks(26, 8, 5)}`
}
function bodyFish() {
  return `
    <path d="M30,4 L62,-20 L60,28 Z" fill="url(#gBody)" stroke="#1565C0" stroke-width="3" opacity="0.92"/>
    <ellipse cx="0" cy="4" rx="44" ry="30" fill="url(#gBody)" stroke="#1565C0" stroke-width="3.5"/>
    ${gloss(-10, -8, 16, 8)}
    <path d="M-2,-24 q18,4 14,18" fill="url(#gBody)" stroke="#1565C0" stroke-width="2.5"/>
    <path d="M-26,4 q-12,0 -12,8 q14,2 16,-4" fill="url(#gBody)" stroke="#1565C0" stroke-width="2.5"/>
    ${eye(-16, -6, 6)}
    <path d="M-22,8 q8,7 18,2" fill="none" stroke="#1565C0" stroke-width="2"/>`
}

const BODIES = {
  chick: bodyChick, hen: bodyHen, cow: bodyCow, pig: bodyPig, sheep: bodySheep,
  dog: bodyDog, cat: bodyCat, rabbit: bodyRabbit, duck: bodyDuck, horse: bodyHorse,
  frog: bodyFrog, fish: bodyFish,
}
function bodyOf(animal) {
  return (BODIES[animal] ?? bodyChick)()
}

/* ════════════════════════════════════════════════════════════════════
   MASCOT SPRITES — style "mascotte mignonne" premium (Sago Mini / Toca)
   Volume via radial gradients + contact shadow, contours colorés arrondis,
   grands yeux brillants, joues douces. Utilisé par la collection / ferme.
   ════════════════════════════════════════════════════════════════════ */

// Per-animal palettes: m=[lightCenter, edge], two=[light, edge] (secondary),
// line=outline, acc/accLine=accent (snout, inner-ear…), dk=deep detail.
const MASCOT = {
  pig:     { m: ['#FFDDE8', '#FF9DBE'], two: ['#FFC2D6', '#FF93B6'], line: '#E07099', acc: '#FFADC9', accLine: '#E07099', dk: '#C2185B' },
  cow:     { m: ['#FFFFFF', '#E3E9ED'], two: ['#FFD2E0', '#F7A9C5'], line: '#B6C1C9', acc: '#FFC6D9', accLine: '#EE7DA4', dk: '#5A4334' },
  sheep:   { m: ['#FFFFFF', '#E7ECF1'], two: ['#D9BCA2', '#BF9B80'], line: '#C2CCD4', acc: '#CBA98C', accLine: '#9E8270', dk: '#6B5848' },
  rabbit:  { m: ['#FFFFFF', '#E6EAEF'], two: ['#FFCBDD', '#F4A6C2'], line: '#BEC6CF', acc: '#FFC2D6', accLine: '#E59ABA', dk: '#7C6A5E' },
  duck:    { m: ['#B8997A', '#8A6B50'], two: ['#4BD06A', '#1F9E3E'], line: '#6E5440', acc: '#FFB52E', accLine: '#E08D00', dk: '#155E2C' },
  duckBaby:{ m: ['#FFEFA0', '#FFD23B'], two: ['#FFEFA0', '#FFD23B'], line: '#E9A400', acc: '#FFB52E', accLine: '#E08D00', dk: '#B57A00' },
}

function mascotKey(animal, stage) {
  if (animal === 'duck' && stage === 'baby') return 'duckBaby'
  return animal
}

function mascotDefs(animal, stage) {
  const p = MASCOT[mascotKey(animal, stage)]
  if (!p) return ''
  return `
    <radialGradient id="mBody" cx="0.40" cy="0.30" r="0.92">
      <stop offset="0" stop-color="${p.m[0]}"/><stop offset="1" stop-color="${p.m[1]}"/>
    </radialGradient>
    <radialGradient id="mTwo" cx="0.40" cy="0.28" r="0.95">
      <stop offset="0" stop-color="${p.two[0]}"/><stop offset="1" stop-color="${p.two[1]}"/>
    </radialGradient>`
}

// Big glossy mascot eye: dark base + large highlight + small sparkle.
function eyeM(x, y, r = 7) {
  const f = (n) => n.toFixed(1)
  return `<ellipse cx="${x}" cy="${y}" rx="${f(r)}" ry="${f(r * 1.1)}" fill="#33291f"/>` +
    `<circle cx="${f(x - r * 0.32)}" cy="${f(y - r * 0.38)}" r="${f(r * 0.42)}" fill="#fff"/>` +
    `<circle cx="${f(x + r * 0.3)}" cy="${f(y + r * 0.34)}" r="${f(r * 0.17)}" fill="#fff" opacity="0.9"/>`
}
function cheekM(x, y, r = 6, fill = '#FF8FB0') {
  const f = (n) => n.toFixed(1)
  return `<ellipse cx="${f(-x)}" cy="${y}" rx="${f(r)}" ry="${f(r * 0.78)}" fill="${fill}" opacity="0.5"/>` +
    `<ellipse cx="${x}" cy="${y}" rx="${f(r)}" ry="${f(r * 0.78)}" fill="${fill}" opacity="0.5"/>`
}
// Soft top shine + low bottom shadow give the chunky volume look.
function shineM(cx, cy, rx, ry) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="0.30"/>`
}

/* ── Adult mascots ── */
function mascotPig() {
  const { line, acc, accLine, dk } = MASCOT.pig
  return `
    <ellipse cx="-15" cy="50" rx="9" ry="8" fill="url(#mBody)" stroke="${line}" stroke-width="3"/>
    <ellipse cx="15" cy="50" rx="9" ry="8" fill="url(#mBody)" stroke="${line}" stroke-width="3"/>
    <path d="M40,30 q11,-3 9,9 q-3,9 -11,1" fill="url(#mBody)" stroke="${line}" stroke-width="3"/>
    <path d="M-30,-30 Q-40,-44 -22,-44 Q-16,-34 -14,-26 Z" fill="${acc}" stroke="${accLine}" stroke-width="3"/>
    <path d="M30,-30 Q40,-44 22,-44 Q16,-34 14,-26 Z" fill="${acc}" stroke="${accLine}" stroke-width="3"/>
    <ellipse cx="0" cy="8" rx="44" ry="42" fill="url(#mBody)" stroke="${line}" stroke-width="3.5"/>
    ${shineM(-14, -16, 16, 11)}
    <ellipse cx="0" cy="14" rx="19" ry="15" fill="url(#mTwo)" stroke="${accLine}" stroke-width="3"/>
    <ellipse cx="-7" cy="14" rx="3.4" ry="5" fill="${dk}"/><ellipse cx="7" cy="14" rx="3.4" ry="5" fill="${dk}"/>
    ${eyeM(-14, -8, 7.5)}${eyeM(14, -8, 7.5)}
    ${cheekM(26, 6, 7, accLine)}`
}
function mascotCow() {
  const { line, acc, accLine, dk } = MASCOT.cow
  return `
    <ellipse cx="-15" cy="50" rx="9" ry="8" fill="#C9D2D8" stroke="${line}" stroke-width="3"/>
    <ellipse cx="15" cy="50" rx="9" ry="8" fill="#C9D2D8" stroke="${line}" stroke-width="3"/>
    <path d="M-31,-30 Q-44,-40 -40,-22 Q-30,-18 -22,-24 Z" fill="url(#mBody)" stroke="${line}" stroke-width="3"/>
    <path d="M31,-30 Q44,-40 40,-22 Q30,-18 22,-24 Z" fill="url(#mBody)" stroke="${line}" stroke-width="3"/>
    <path d="M-15,-40 Q-20,-52 -10,-50 Q-9,-44 -10,-36 Z" fill="#FBE9D2" stroke="#D9B98F" stroke-width="2.5"/>
    <path d="M15,-40 Q20,-52 10,-50 Q9,-44 10,-36 Z" fill="#FBE9D2" stroke="#D9B98F" stroke-width="2.5"/>
    <ellipse cx="0" cy="8" rx="44" ry="42" fill="url(#mBody)" stroke="${line}" stroke-width="3.5"/>
    ${shineM(-14, -16, 16, 11)}
    <ellipse cx="-20" cy="-6" rx="13" ry="11" fill="${dk}"/>
    <ellipse cx="19" cy="22" rx="11" ry="9" fill="${dk}"/>
    <ellipse cx="0" cy="20" rx="22" ry="17" fill="url(#mTwo)" stroke="${accLine}" stroke-width="3"/>
    <ellipse cx="-8" cy="20" rx="3" ry="4" fill="${accLine}"/><ellipse cx="8" cy="20" rx="3" ry="4" fill="${accLine}"/>
    ${eyeM(-13, -4, 7.5)}${eyeM(13, -4, 7.5)}
    ${cheekM(25, 10, 6.5, '#F7A9C5')}`
}
function mascotSheep() {
  const { line, acc, accLine } = MASCOT.sheep
  const cloud = [
    [-30, -8, 14], [-22, -26, 13], [0, -32, 15], [22, -26, 13], [30, -8, 14],
    [30, 14, 14], [20, 30, 14], [0, 36, 15], [-20, 30, 14], [-30, 14, 14],
  ].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#mBody)" stroke="${line}" stroke-width="2.5"/>`).join('')
  return `
    <rect x="-18" y="38" width="9" height="16" rx="4" fill="#9C8472"/>
    <rect x="9" y="38" width="9" height="16" rx="4" fill="#9C8472"/>
    ${cloud}
    <circle cx="0" cy="2" r="25" fill="url(#mBody)" stroke="${line}" stroke-width="2"/>
    <path d="M-24,-10 Q-30,-2 -24,8" fill="${acc}" stroke="${accLine}" stroke-width="2.5"/>
    <path d="M24,-10 Q30,-2 24,8" fill="${acc}" stroke="${accLine}" stroke-width="2.5"/>
    <ellipse cx="0" cy="6" rx="21" ry="22" fill="${acc}" stroke="${accLine}" stroke-width="3"/>
    ${shineM(-9, -6, 9, 6)}
    ${eyeM(-8, 0, 6.5)}${eyeM(8, 0, 6.5)}
    <ellipse cx="0" cy="14" rx="4" ry="3" fill="#5a4a42"/>
    ${cheekM(15, 11, 5, '#F4A6C2')}`
}
function mascotRabbit() {
  const { line, acc, accLine, dk } = MASCOT.rabbit
  return `
    <ellipse cx="-12" cy="-46" rx="9" ry="30" fill="url(#mBody)" stroke="${line}" stroke-width="3" transform="rotate(-9 -12 -46)"/>
    <ellipse cx="12" cy="-46" rx="9" ry="30" fill="url(#mBody)" stroke="${line}" stroke-width="3" transform="rotate(9 12 -46)"/>
    <ellipse cx="-12" cy="-46" rx="4" ry="20" fill="url(#mTwo)" transform="rotate(-9 -12 -46)"/>
    <ellipse cx="12" cy="-46" rx="4" ry="20" fill="url(#mTwo)" transform="rotate(9 12 -46)"/>
    <ellipse cx="-24" cy="50" rx="13" ry="9" fill="url(#mBody)" stroke="${line}" stroke-width="3"/>
    <ellipse cx="24" cy="50" rx="13" ry="9" fill="url(#mBody)" stroke="${line}" stroke-width="3"/>
    <ellipse cx="0" cy="14" rx="34" ry="36" fill="url(#mBody)" stroke="${line}" stroke-width="3.5"/>
    ${shineM(-12, -4, 13, 10)}
    ${eyeM(-13, -2, 7.5)}${eyeM(13, -2, 7.5)}
    <path d="M-5,12 Q0,15 5,12 Q3,17 0,17 Q-3,17 -5,12 Z" fill="${accLine}"/>
    <path d="M0,17 v5 M0,21 q-5,3 -8,1 M0,21 q5,3 8,1" fill="none" stroke="${dk}" stroke-width="1.8"/>
    ${cheekM(19, 12, 6.5, '#F4A6C2')}`
}
function mascotDuck() {
  // Canard colvert adulte : corps brun, tête verte, collier blanc, bec orange.
  const { line, acc, accLine } = MASCOT.duck
  return `
    <path d="M34,18 q26,-4 22,16 q-4,12 -18,5 Z" fill="url(#mBody)" stroke="${line}" stroke-width="3"/>
    <path d="M-18,48 q-8,8 1,11 M2,48 q-8,8 1,11" fill="none" stroke="${acc}" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="0" cy="24" rx="40" ry="32" fill="url(#mBody)" stroke="${line}" stroke-width="3.5"/>
    ${shineM(-12, 10, 14, 9)}
    <path d="M-24,18 q14,11 0,24" fill="none" stroke="${line}" stroke-width="3"/>
    <path d="M-34,-2 Q0,8 34,-2 L34,4 Q0,14 -34,4 Z" fill="#FFFFFF" stroke="#E3E3E3" stroke-width="1.5"/>
    <circle cx="0" cy="-22" r="27" fill="url(#mTwo)" stroke="${MASCOT.duck.dk}" stroke-width="3"/>
    ${shineM(-9, -32, 10, 7)}
    <path d="M8,-18 q28,-3 26,11 q-2,8 -26,4 Z" fill="${acc}" stroke="${accLine}" stroke-width="2.5"/>
    <ellipse cx="30" cy="-12" rx="2.4" ry="2" fill="${accLine}"/>
    ${eyeM(-3, -26, 6)}${eyeM(13, -26, 6)}`
}

/* ── Baby mascots ── */
function mascotPigBaby() {
  const { line, acc, accLine, dk } = MASCOT.pig
  return `
    <path d="M-22,-22 Q-30,-32 -16,-33 Q-12,-26 -11,-20 Z" fill="${acc}" stroke="${accLine}" stroke-width="2.5"/>
    <path d="M22,-22 Q30,-32 16,-33 Q12,-26 11,-20 Z" fill="${acc}" stroke="${accLine}" stroke-width="2.5"/>
    <ellipse cx="-9" cy="40" rx="7" ry="6" fill="url(#mBody)" stroke="${line}" stroke-width="2.5"/>
    <ellipse cx="9" cy="40" rx="7" ry="6" fill="url(#mBody)" stroke="${line}" stroke-width="2.5"/>
    <ellipse cx="0" cy="8" rx="33" ry="32" fill="url(#mBody)" stroke="${line}" stroke-width="3.5"/>
    ${shineM(-11, -8, 13, 9)}
    <ellipse cx="0" cy="12" rx="15" ry="12" fill="url(#mTwo)" stroke="${accLine}" stroke-width="2.5"/>
    <ellipse cx="-5.5" cy="12" rx="2.6" ry="3.8" fill="${dk}"/><ellipse cx="5.5" cy="12" rx="2.6" ry="3.8" fill="${dk}"/>
    ${eyeM(-12, -7, 8)}${eyeM(12, -7, 8)}
    ${cheekM(22, 6, 6.5, accLine)}`
}
function mascotCowBaby() {
  const { line, acc, accLine, dk } = MASCOT.cow
  return `
    <ellipse cx="-9" cy="40" rx="7" ry="6" fill="#C9D2D8" stroke="${line}" stroke-width="2.5"/>
    <ellipse cx="9" cy="40" rx="7" ry="6" fill="#C9D2D8" stroke="${line}" stroke-width="2.5"/>
    <ellipse cx="-14" cy="-20" rx="10" ry="7" fill="url(#mBody)" stroke="${line}" stroke-width="2.5"/>
    <ellipse cx="14" cy="-20" rx="10" ry="7" fill="url(#mBody)" stroke="${line}" stroke-width="2.5"/>
    <ellipse cx="-14" cy="-20" rx="5" ry="3.5" fill="${acc}" opacity="0.65"/>
    <ellipse cx="14" cy="-20" rx="5" ry="3.5" fill="${acc}" opacity="0.65"/>
    <ellipse cx="0" cy="8" rx="33" ry="32" fill="url(#mBody)" stroke="${line}" stroke-width="3.5"/>
    ${shineM(-11, -8, 13, 9)}
    <ellipse cx="-17" cy="-6" rx="10" ry="8" fill="${dk}"/>
    <ellipse cx="0" cy="16" rx="17" ry="13" fill="url(#mTwo)" stroke="${accLine}" stroke-width="2.5"/>
    <ellipse cx="-6" cy="16" rx="2.6" ry="3.4" fill="${accLine}"/><ellipse cx="6" cy="16" rx="2.6" ry="3.4" fill="${accLine}"/>
    ${eyeM(-12, -6, 8)}${eyeM(12, -6, 8)}
    ${cheekM(22, 8, 6, '#F7A9C5')}`
}
function mascotSheepBaby() {
  const { line, acc, accLine } = MASCOT.sheep
  const cloud = [[-22, -4, 12], [-14, -22, 11], [6, -24, 12], [22, -10, 12], [18, 12, 12], [-4, 20, 12], [-22, 14, 12]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#mBody)" stroke="${line}" stroke-width="2.5"/>`).join('')
  return `
    <rect x="-13" y="26" width="7" height="13" rx="3.5" fill="#9C8472"/>
    <rect x="6" y="26" width="7" height="13" rx="3.5" fill="#9C8472"/>
    ${cloud}
    <path d="M-20,-6 Q-26,1 -20,8" fill="${acc}" stroke="${accLine}" stroke-width="2.5"/>
    <path d="M20,-6 Q26,1 20,8" fill="${acc}" stroke="${accLine}" stroke-width="2.5"/>
    <ellipse cx="0" cy="2" rx="18" ry="18" fill="${acc}" stroke="${accLine}" stroke-width="3"/>
    ${shineM(-8, -6, 8, 5)}
    ${eyeM(-7, -1, 7)}${eyeM(7, -1, 7)}
    <ellipse cx="0" cy="10" rx="3.4" ry="2.6" fill="#5a4a42"/>
    ${cheekM(13, 8, 4.5, '#F4A6C2')}`
}
function mascotRabbitBaby() {
  const { line, accLine, dk } = MASCOT.rabbit
  return `
    <ellipse cx="-9" cy="-38" rx="7" ry="22" fill="url(#mBody)" stroke="${line}" stroke-width="2.5" transform="rotate(-8 -9 -38)"/>
    <ellipse cx="9" cy="-38" rx="7" ry="22" fill="url(#mBody)" stroke="${line}" stroke-width="2.5" transform="rotate(8 9 -38)"/>
    <ellipse cx="-9" cy="-38" rx="3" ry="14" fill="url(#mTwo)" transform="rotate(-8 -9 -38)"/>
    <ellipse cx="9" cy="-38" rx="3" ry="14" fill="url(#mTwo)" transform="rotate(8 9 -38)"/>
    <ellipse cx="0" cy="12" rx="29" ry="29" fill="url(#mBody)" stroke="${line}" stroke-width="3.5"/>
    ${shineM(-10, 0, 11, 8)}
    ${eyeM(-12, 0, 8)}${eyeM(12, 0, 8)}
    <path d="M-4,13 Q0,16 4,13 Q2,18 0,18 Q-2,18 -4,13 Z" fill="${accLine}"/>
    <path d="M0,18 v4" fill="none" stroke="${dk}" stroke-width="1.6"/>
    ${cheekM(17, 13, 6, '#F4A6C2')}`
}
function mascotDuckBaby() {
  const { line, acc, accLine } = MASCOT.duckBaby
  return `
    <ellipse cx="0" cy="14" rx="30" ry="28" fill="url(#mBody)" stroke="${line}" stroke-width="3.5"/>
    ${shineM(-10, 2, 12, 8)}
    <path d="M-14,40 q-6,6 1,8 M2,40 q-6,6 1,8" fill="none" stroke="${acc}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M-22,16 q11,9 0,20" fill="none" stroke="${line}" stroke-width="2.5"/>
    <circle cx="0" cy="-18" r="23" fill="url(#mBody)" stroke="${line}" stroke-width="3.5"/>
    <path d="M-3,11 q6,-9 14,-9 q-3,8 0,9" fill="none" stroke="#E9A400" stroke-width="0"/>
    <path d="M5,-14 q22,-3 20,9 q-2,7 -20,3 Z" fill="${acc}" stroke="${accLine}" stroke-width="2.5"/>
    ${eyeM(-4, -21, 7)}${eyeM(11, -21, 7)}
    ${cheekM(15, -10, 5.5, '#FFB07A')}`
}

const MASCOT_ADULT = { pig: mascotPig, cow: mascotCow, sheep: mascotSheep, rabbit: mascotRabbit, duck: mascotDuck }
const MASCOT_BABY = { pig: mascotPigBaby, cow: mascotCowBaby, sheep: mascotSheepBaby, rabbit: mascotRabbitBaby, duck: mascotDuckBaby }

function hasMascot(animal) {
  return Boolean(MASCOT_ADULT[animal])
}
function mascotBody(animal, stage) {
  const set = stage === 'baby' ? MASCOT_BABY : MASCOT_ADULT
  return (set[animal] ?? MASCOT_ADULT[animal])()
}

function animalShadow() {
  return `<ellipse cx="140" cy="160" rx="50" ry="10" fill="#000" opacity="0.13"/>`
}

/**
 * Puzzle card : decor rempli + animal ombré centré (aucune pièce vide).
 */
export function generateAnimalCardSvg(scene = {}) {
  const animal = scene.animal ?? 'chick'
  const variant = scene.variant ?? 1
  const ty = animal === 'fish' ? 96 : 86
  return [
    svgOpen(),
    buildSceneDefs(animal, variant),
    drawScene(scene),
    animalShadow(),
    `<g transform="translate(140,${ty})" stroke-linejoin="round" stroke-linecap="round">${bodyOf(animal)}</g>`,
    svgClose(),
  ].join('')
}

/**
 * Sprite isolé (fond transparent) — pour les animaux de la ferme / collection.
 * stage: 'baby' | 'adult'
 */
export function generateAnimalSpriteSvg(animal = 'chick', stage = 'adult') {
  if (hasMascot(animal)) {
    const ty = stage === 'baby' ? 82 : 74
    return [
      svgOpen(140, 150),
      `<defs>${mascotDefs(animal, stage)}</defs>`,
      `<ellipse cx="70" cy="138" rx="40" ry="8" fill="#000" opacity="0.1"/>`,
      `<g transform="translate(70,${ty})" stroke-linejoin="round" stroke-linecap="round">${mascotBody(animal, stage)}</g>`,
      svgClose(),
    ].join('')
  }
  const cy = animal === 'fish' ? 80 : 72
  return [
    svgOpen(140, 150),
    `<defs>${animalGradDef(animal, 1)}</defs>`,
    `<ellipse cx="70" cy="138" rx="40" ry="8" fill="#000" opacity="0.1"/>`,
    `<g transform="translate(70,${cy})" stroke-linejoin="round" stroke-linecap="round">${bodyOf(animal)}</g>`,
    svgClose(),
  ].join('')
}

// "Surprise" : cadeau enveloppé mignon (remplace l'œuf pour les mammifères).
function mysterySpriteSvg() {
  return [
    svgOpen(140, 150),
    `<defs>`,
    `<linearGradient id="giftBox" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8FB0"/><stop offset="1" stop-color="#E5618C"/></linearGradient>`,
    `<linearGradient id="giftLid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFA7C2"/><stop offset="1" stop-color="#FF7CA3"/></linearGradient>`,
    `</defs>`,
    `<ellipse cx="70" cy="138" rx="34" ry="7" fill="#000" opacity="0.1"/>`,
    `<g transform="translate(70,90)">`,
    // sparkles
    `<g fill="#FFE08A"><path d="M-44,-44 l3,7 7,3 -7,3 -3,7 -3,-7 -7,-3 7,-3 Z"/><path d="M42,-20 l2,5 5,2 -5,2 -2,5 -2,-5 -5,-2 5,-2 Z"/><path d="M40,30 l2,4 4,2 -4,2 -2,4 -2,-4 -4,-2 4,-2 Z"/></g>`,
    // box body
    `<rect x="-36" y="-8" width="72" height="50" rx="8" fill="url(#giftBox)" stroke="#D14E7C" stroke-width="3"/>`,
    `<ellipse cx="-20" cy="6" rx="10" ry="14" fill="#fff" opacity="0.12"/>`,
    // lid
    `<rect x="-42" y="-22" width="84" height="20" rx="7" fill="url(#giftLid)" stroke="#D14E7C" stroke-width="3"/>`,
    // vertical ribbon
    `<rect x="-7" y="-22" width="14" height="64" fill="#FFD23B" stroke="#E9A400" stroke-width="2.5"/>`,
    // bow
    `<path d="M0,-22 Q-26,-46 -30,-26 Q-30,-14 0,-22 Z" fill="#FFD23B" stroke="#E9A400" stroke-width="2.5"/>`,
    `<path d="M0,-22 Q26,-46 30,-26 Q30,-14 0,-22 Z" fill="#FFD23B" stroke="#E9A400" stroke-width="2.5"/>`,
    `<circle cx="0" cy="-24" r="6" fill="#FFE074" stroke="#E9A400" stroke-width="2.5"/>`,
    // question mark on the box
    `<text x="0" y="18" text-anchor="middle" dominant-baseline="middle" font-family="Arial,sans-serif" font-size="30" font-weight="900" fill="#FFFFFF" opacity="0.95">?</text>`,
    `</g>`,
    svgClose(),
  ].join('')
}

const dataUrlCache = new Map()
function toDataUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function generatePuzzleSceneSvg(scene = {}) {
  return generateAnimalCardSvg(scene)
}

export function generatePuzzleSceneDataUrl(scene = {}) {
  const key = 'scene:' + JSON.stringify(scene)
  if (dataUrlCache.has(key)) return dataUrlCache.get(key)
  const url = toDataUrl(generatePuzzleSceneSvg(scene))
  dataUrlCache.set(key, url)
  return url
}

export function generateAnimalSpriteDataUrl(animal = 'chick', stage = 'adult') {
  const key = `sprite:${animal}:${stage}`
  if (dataUrlCache.has(key)) return dataUrlCache.get(key)
  const url = toDataUrl(generateAnimalSpriteSvg(animal, stage))
  dataUrlCache.set(key, url)
  return url
}

export function generateMysterySprite() {
  const key = 'mystery:stable'
  if (dataUrlCache.has(key)) return dataUrlCache.get(key)
  const url = toDataUrl(mysterySpriteSvg())
  dataUrlCache.set(key, url)
  return url
}

export function resolvePuzzleImage(puzzle) {
  if (!puzzle) return null
  if (puzzle.image) return puzzle.image
  if (puzzle.scene) return generatePuzzleSceneDataUrl(puzzle.scene)
  return null
}
