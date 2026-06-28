import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'fs'

mkdirSync('store-assets', { recursive: true })

const svg = `
<svg width="1024" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#87CEEB"/>
      <stop offset="60%" stop-color="#FDB99B"/>
      <stop offset="100%" stop-color="#F8C471"/>
    </linearGradient>
    <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7CB342"/>
      <stop offset="100%" stop-color="#558B2F"/>
    </linearGradient>
  </defs>

  <!-- Sky -->
  <rect width="1024" height="500" fill="url(#sky)"/>

  <!-- Sun -->
  <circle cx="820" cy="100" r="60" fill="#FFF176" opacity="0.9"/>
  <circle cx="820" cy="100" r="45" fill="#FFEE58"/>

  <!-- Clouds -->
  <g fill="white" opacity="0.7">
    <ellipse cx="180" cy="80" rx="60" ry="25"/>
    <ellipse cx="220" cy="70" rx="45" ry="20"/>
    <ellipse cx="150" cy="75" rx="40" ry="18"/>
    <ellipse cx="650" cy="110" rx="50" ry="20"/>
    <ellipse cx="690" cy="100" rx="40" ry="18"/>
  </g>

  <!-- Grass hill -->
  <ellipse cx="512" cy="520" rx="600" ry="200" fill="url(#grass)"/>

  <!-- Fence -->
  <g fill="#8D6E63" stroke="#6D4C41" stroke-width="1.5">
    <rect x="80" y="290" width="8" height="70" rx="2"/>
    <rect x="160" y="290" width="8" height="70" rx="2"/>
    <rect x="240" y="290" width="8" height="70" rx="2"/>
    <rect x="75" y="305" width="178" height="6" rx="2"/>
    <rect x="75" y="330" width="178" height="6" rx="2"/>

    <rect x="780" y="290" width="8" height="70" rx="2"/>
    <rect x="860" y="290" width="8" height="70" rx="2"/>
    <rect x="940" y="290" width="8" height="70" rx="2"/>
    <rect x="775" y="305" width="178" height="6" rx="2"/>
    <rect x="775" y="330" width="178" height="6" rx="2"/>
  </g>

  <!-- Barn -->
  <rect x="60" y="200" width="120" height="100" fill="#C62828" rx="4"/>
  <polygon points="60,200 120,155 180,200" fill="#D32F2F"/>
  <rect x="100" y="250" width="40" height="50" fill="#4E342E" rx="3"/>
  <rect x="118" y="250" width="4" height="50" fill="#3E2723"/>
  <circle cx="120" cy="170" r="12" fill="#FFF9C4"/>

  <!-- Chick 1 (left) -->
  <g transform="translate(350, 340)">
    <ellipse cx="0" cy="0" rx="28" ry="24" fill="#FFD54F"/>
    <ellipse cx="0" cy="-22" rx="18" ry="16" fill="#FFD54F"/>
    <circle cx="-6" cy="-24" r="3" fill="#3E2723"/>
    <circle cx="6" cy="-24" r="3" fill="#3E2723"/>
    <polygon points="-1,-18 1,-18 0,-14" fill="#FF8F00"/>
    <ellipse cx="-22" cy="2" rx="12" ry="8" fill="#FFCA28" transform="rotate(-20)"/>
    <ellipse cx="22" cy="2" rx="12" ry="8" fill="#FFCA28" transform="rotate(20)"/>
    <rect x="-10" y="20" width="8" height="10" fill="#FF8F00" rx="2"/>
    <rect x="2" y="20" width="8" height="10" fill="#FF8F00" rx="2"/>
  </g>

  <!-- Chick 2 (right) -->
  <g transform="translate(680, 350)">
    <ellipse cx="0" cy="0" rx="24" ry="20" fill="#FFD54F"/>
    <ellipse cx="0" cy="-18" rx="15" ry="13" fill="#FFD54F"/>
    <circle cx="-5" cy="-20" r="2.5" fill="#3E2723"/>
    <circle cx="5" cy="-20" r="2.5" fill="#3E2723"/>
    <polygon points="-1,-15 1,-15 0,-11" fill="#FF8F00"/>
    <rect x="-8" y="16" width="7" height="8" fill="#FF8F00" rx="2"/>
    <rect x="1" y="16" width="7" height="8" fill="#FF8F00" rx="2"/>
  </g>

  <!-- Egg -->
  <g transform="translate(520, 360)">
    <ellipse cx="0" cy="0" rx="18" ry="22" fill="#FFF8E1" stroke="#D7CCC8" stroke-width="1.5"/>
    <ellipse cx="-4" cy="-5" rx="4" ry="5" fill="#FFECB3" opacity="0.5"/>
  </g>

  <!-- Title -->
  <g transform="translate(512, 180)">
    <text x="0" y="0" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="900" fill="#3E2700" letter-spacing="1">
      Les Petits Poussins
    </text>
    <text x="0" y="4" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="900" fill="none" stroke="white" stroke-width="1.5" letter-spacing="1" opacity="0.3">
      Les Petits Poussins
    </text>
  </g>

  <!-- Emoji chick next to title -->
  <text x="512" y="130" text-anchor="middle" font-size="40">🐣</text>

  <!-- Subtitle -->
  <rect x="332" y="230" width="360" height="38" rx="19" fill="#FF8F00" opacity="0.9"/>
  <text x="512" y="256" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="800" fill="white" letter-spacing="0.5">
    Jeu éducatif · Maternelle au CM2
  </text>

  <!-- Age badge -->
  <rect x="412" y="280" width="200" height="30" rx="15" fill="white" opacity="0.85"/>
  <text x="512" y="301" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#5D3A00">
    🎒 De 3 à 11 ans
  </text>

  <!-- Small icons row -->
  <g font-size="28" text-anchor="middle">
    <text x="400" y="440">🎨</text>
    <text x="450" y="440">✍️</text>
    <text x="500" y="440">🔢</text>
    <text x="550" y="440">📖</text>
    <text x="600" y="440">🎲</text>
  </g>

  <!-- Flowers -->
  <g font-size="22">
    <text x="300" y="400">🌻</text>
    <text x="730" y="390">🌻</text>
    <text x="270" y="420">🌼</text>
    <text x="760" y="415">🌼</text>
  </g>
</svg>
`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1024 },
  font: { loadSystemFonts: true },
})
const png = resvg.render().asPng()
writeFileSync('store-assets/feature-graphic-1024x500.png', png)
console.log('Banner saved: store-assets/feature-graphic-1024x500.png (' + png.length + ' bytes)')
