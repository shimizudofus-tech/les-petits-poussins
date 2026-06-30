import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'fs'

const OUT = 'src/assets/images/legendaries'
mkdirSync(OUT, { recursive: true })

// Mascottes chibi : corps rond + traits simples, style enfant.
const EYES = `
  <circle cx="44" cy="60" r="5" fill="#3e2723"/>
  <circle cx="76" cy="60" r="5" fill="#3e2723"/>
  <circle cx="45.5" cy="58" r="1.6" fill="#fff"/>
  <circle cx="77.5" cy="58" r="1.6" fill="#fff"/>
  <ellipse cx="36" cy="70" rx="5" ry="3" fill="#ffb3c1" opacity="0.7"/>
  <ellipse cx="84" cy="70" rx="5" ry="3" fill="#ffb3c1" opacity="0.7"/>`

const SPRITES = {
  unicorn: `
    <svg width="256" height="256" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="68" r="33" fill="#ffffff" stroke="#e0d6ef" stroke-width="2"/>
      <path d="M42 40 l5 -12 l9 9 Z" fill="#ffffff" stroke="#e0d6ef" stroke-width="2"/>
      <path d="M78 40 l-5 -12 l-9 9 Z" fill="#ffffff" stroke="#e0d6ef" stroke-width="2"/>
      <path d="M60 8 L67 38 L53 38 Z" fill="#ffd54f" stroke="#e0a800" stroke-width="1.6"/>
      <path d="M56 16 q4 3 8 0 M55 24 q5 3 10 0 M55 31 q5 2 10 0" stroke="#e0a800" stroke-width="1.3" fill="none"/>
      <path d="M46 32 q-22 8 -18 38 q10 -14 18 -16 q-6 -10 0 -22 Z" fill="#f48fb1"/>
      <path d="M74 32 q22 8 18 38 q-10 -14 -18 -16 q6 -10 0 -22 Z" fill="#ce93d8"/>
      <path d="M40 30 q-12 10 -10 26 q8 -10 14 -12" fill="none" stroke="#9575ff" stroke-width="4" stroke-linecap="round"/>
      <path d="M80 30 q12 10 10 26 q-8 -10 -14 -12" fill="none" stroke="#4fc3f7" stroke-width="4" stroke-linecap="round"/>
      ${EYES}
      <path d="M54 82 q6 6 12 0" stroke="#3e2723" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    </svg>`,
  dragon: `
    <svg width="256" height="256" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 34 L40 50 L24 48 Z" fill="#66bb6a"/>
      <path d="M90 34 L80 50 L96 48 Z" fill="#66bb6a"/>
      <path d="M18 70 q-12 -2 -14 14 q12 -4 18 -6 Z" fill="#81c784"/>
      <path d="M102 70 q12 -2 14 14 q-12 -4 -18 -6 Z" fill="#81c784"/>
      <circle cx="60" cy="66" r="36" fill="#66bb6a" stroke="#43a047" stroke-width="2"/>
      <ellipse cx="60" cy="78" rx="20" ry="16" fill="#c5e1a5"/>
      ${EYES}
      <ellipse cx="60" cy="74" rx="9" ry="6" fill="#43a047"/>
      <circle cx="56" cy="73" r="1.6" fill="#1b5e20"/>
      <circle cx="64" cy="73" r="1.6" fill="#1b5e20"/>
    </svg>`,
  mermaid: `
    <svg width="256" height="256" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 70 q-26 8 -30 34 q18 -6 30 -10 q12 4 30 10 q-4 -26 -30 -34 Z" fill="#4dd0e1" stroke="#26a69a" stroke-width="2"/>
      <path d="M30 104 q10 -8 16 -6 M90 104 q-10 -8 -16 -6" stroke="#26a69a" stroke-width="2.5" fill="none"/>
      <path d="M34 44 q-6 24 6 34 q10 -6 20 -6 q10 0 20 6 q12 -10 6 -34 Z" fill="#ff8a65"/>
      <circle cx="60" cy="48" r="28" fill="#ffd5b8" stroke="#f0b890" stroke-width="2"/>
      <path d="M32 44 q4 -28 28 -28 q24 0 28 28 q-10 -10 -28 -10 q-18 0 -28 10 Z" fill="#ff8a65"/>
      ${EYES}
      <path d="M54 60 q6 5 12 0" stroke="#3e2723" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    </svg>`,
  yeti: `
    <svg width="256" height="256" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <g fill="#e3f2fd" stroke="#bbdefb" stroke-width="1.5">
        <circle cx="60" cy="66" r="38"/>
        <circle cx="30" cy="50" r="9"/><circle cx="90" cy="50" r="9"/>
        <circle cx="26" cy="74" r="9"/><circle cx="94" cy="74" r="9"/>
        <circle cx="42" cy="30" r="8"/><circle cx="78" cy="30" r="8"/>
        <circle cx="60" cy="26" r="8"/>
      </g>
      <circle cx="60" cy="66" r="30" fill="#fff"/>
      ${EYES}
      <path d="M50 62 h20 M52 62 v6 M58 62 v8 M64 62 v6 M68 62 v6" stroke="#90caf9" stroke-width="1.4"/>
      <path d="M52 82 q8 8 16 0" stroke="#3e2723" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    </svg>`,
  nessie: `
    <svg width="256" height="256" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 92 q14 8 28 0 q14 -8 28 0 q14 8 28 0 q14 -8 20 0" stroke="#4fc3f7" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M20 86 q-2 -22 16 -24 q14 -2 16 12" fill="none" stroke="#388e3c" stroke-width="14" stroke-linecap="round"/>
      <path d="M58 74 q4 -26 24 -26 q22 0 22 22 q0 16 -16 18" fill="#43a047" stroke="#2e7d32" stroke-width="2"/>
      <circle cx="84" cy="50" r="20" fill="#66bb6a" stroke="#2e7d32" stroke-width="2"/>
      <path d="M80 32 l4 -8 l4 8 Z" fill="#2e7d32"/>
      <circle cx="80" cy="48" r="4" fill="#3e2723"/><circle cx="81" cy="46.5" r="1.3" fill="#fff"/>
      <ellipse cx="92" cy="56" rx="6" ry="4" fill="#2e7d32"/>
    </svg>`,
}

for (const [key, svg] of Object.entries(SPRITES)) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 256 } }).render().asPng()
  writeFileSync(`${OUT}/${key}.png`, png)
  console.log('  ✓', key + '.png')
}
console.log('Done!')
