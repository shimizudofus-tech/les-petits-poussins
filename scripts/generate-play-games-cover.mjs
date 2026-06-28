import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'fs'

mkdirSync('store-assets', { recursive: true })

const svg = `
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#87CEEB"/>
      <stop offset="55%" stop-color="#B2E0F0"/>
      <stop offset="100%" stop-color="#E8F5E9"/>
    </linearGradient>
    <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7CB342"/>
      <stop offset="100%" stop-color="#558B2F"/>
    </linearGradient>
    <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8BC34A"/>
      <stop offset="100%" stop-color="#689F38"/>
    </linearGradient>
  </defs>

  <!-- Sky -->
  <rect width="1920" height="1080" fill="url(#sky)"/>

  <!-- Sun -->
  <circle cx="1600" cy="180" r="100" fill="#FFF9C4" opacity="0.6"/>
  <circle cx="1600" cy="180" r="70" fill="#FFF176" opacity="0.8"/>
  <circle cx="1600" cy="180" r="50" fill="#FFEE58"/>

  <!-- Clouds -->
  <g fill="white" opacity="0.75">
    <ellipse cx="300" cy="150" rx="100" ry="40"/>
    <ellipse cx="370" cy="135" rx="75" ry="35"/>
    <ellipse cx="240" cy="140" rx="65" ry="30"/>

    <ellipse cx="900" cy="100" rx="85" ry="35"/>
    <ellipse cx="960" cy="90" rx="65" ry="28"/>

    <ellipse cx="1300" cy="170" rx="70" ry="28"/>
    <ellipse cx="1355" cy="160" rx="55" ry="24"/>
  </g>

  <!-- Far hill -->
  <ellipse cx="960" cy="1100" rx="1100" ry="500" fill="url(#hill2)"/>

  <!-- Main grass -->
  <ellipse cx="960" cy="1150" rx="1200" ry="450" fill="url(#grass)"/>

  <!-- Barn -->
  <g transform="translate(200, 420)">
    <rect x="0" y="50" width="200" height="170" fill="#C62828" rx="6"/>
    <polygon points="0,50 100,0 200,50" fill="#D32F2F"/>
    <rect x="70" y="130" width="60" height="90" fill="#4E342E" rx="4"/>
    <rect x="97" y="130" width="6" height="90" fill="#3E2723"/>
    <circle cx="100" cy="20" r="18" fill="#FFF9C4"/>
    <rect x="15" y="80" width="35" height="35" fill="#5D4037" rx="3"/>
    <line x1="15" y1="97" x2="50" y2="97" stroke="#3E2723" stroke-width="2"/>
    <line x1="32" y1="80" x2="32" y2="115" stroke="#3E2723" stroke-width="2"/>
    <rect x="150" y="80" width="35" height="35" fill="#5D4037" rx="3"/>
    <line x1="150" y1="97" x2="185" y2="97" stroke="#3E2723" stroke-width="2"/>
    <line x1="167" y1="80" x2="167" y2="115" stroke="#3E2723" stroke-width="2"/>
  </g>

  <!-- Fence left -->
  <g fill="#8D6E63" stroke="#6D4C41" stroke-width="2">
    <rect x="450" y="560" width="10" height="100" rx="3"/>
    <rect x="540" y="560" width="10" height="100" rx="3"/>
    <rect x="630" y="560" width="10" height="100" rx="3"/>
    <rect x="445" y="580" width="200" height="7" rx="3"/>
    <rect x="445" y="610" width="200" height="7" rx="3"/>
  </g>

  <!-- Fence right -->
  <g fill="#8D6E63" stroke="#6D4C41" stroke-width="2">
    <rect x="1280" y="560" width="10" height="100" rx="3"/>
    <rect x="1370" y="560" width="10" height="100" rx="3"/>
    <rect x="1460" y="560" width="10" height="100" rx="3"/>
    <rect x="1275" y="580" width="200" height="7" rx="3"/>
    <rect x="1275" y="610" width="200" height="7" rx="3"/>
  </g>

  <!-- Big chick (center-left) -->
  <g transform="translate(750, 620)">
    <ellipse cx="0" cy="0" rx="55" ry="48" fill="#FFD54F"/>
    <ellipse cx="0" cy="-42" rx="38" ry="32" fill="#FFD54F"/>
    <circle cx="-12" cy="-46" r="6" fill="#3E2723"/>
    <circle cx="12" cy="-46" r="6" fill="#3E2723"/>
    <circle cx="-10" cy="-44" r="2" fill="white"/>
    <circle cx="14" cy="-44" r="2" fill="white"/>
    <polygon points="-3,-34 3,-34 0,-26" fill="#FF8F00"/>
    <ellipse cx="-42" cy="4" rx="22" ry="14" fill="#FFCA28" transform="rotate(-15)"/>
    <ellipse cx="42" cy="4" rx="22" ry="14" fill="#FFCA28" transform="rotate(15)"/>
    <rect x="-18" y="40" width="14" height="18" fill="#FF8F00" rx="4"/>
    <rect x="4" y="40" width="14" height="18" fill="#FF8F00" rx="4"/>
    <ellipse cx="18" cy="-56" rx="6" ry="10" fill="#FFD54F" transform="rotate(15)"/>
    <ellipse cx="-18" cy="-56" rx="6" ry="10" fill="#FFD54F" transform="rotate(-15)"/>
  </g>

  <!-- Small chick (right) -->
  <g transform="translate(1100, 660)">
    <ellipse cx="0" cy="0" rx="35" ry="30" fill="#FFD54F"/>
    <ellipse cx="0" cy="-26" rx="24" ry="20" fill="#FFD54F"/>
    <circle cx="-7" cy="-28" r="4" fill="#3E2723"/>
    <circle cx="7" cy="-28" r="4" fill="#3E2723"/>
    <circle cx="-6" cy="-27" r="1.5" fill="white"/>
    <circle cx="8" cy="-27" r="1.5" fill="white"/>
    <polygon points="-2,-20 2,-20 0,-14" fill="#FF8F00"/>
    <rect x="-10" y="24" width="9" height="12" fill="#FF8F00" rx="3"/>
    <rect x="1" y="24" width="9" height="12" fill="#FF8F00" rx="3"/>
  </g>

  <!-- Egg -->
  <g transform="translate(960, 680)">
    <ellipse cx="0" cy="0" rx="32" ry="40" fill="#FFF8E1" stroke="#D7CCC8" stroke-width="2"/>
    <ellipse cx="-8" cy="-10" rx="7" ry="9" fill="#FFECB3" opacity="0.5"/>
    <ellipse cx="6" cy="5" rx="4" ry="5" fill="#FFECB3" opacity="0.3"/>
  </g>

  <!-- Flowers -->
  <g>
    <circle cx="550" cy="720" r="12" fill="#FF8A80"/>
    <circle cx="550" cy="720" r="5" fill="#FFCC02"/>
    <rect x="548" y="732" width="4" height="25" fill="#66BB6A" rx="2"/>

    <circle cx="1400" cy="700" r="14" fill="#CE93D8"/>
    <circle cx="1400" cy="700" r="6" fill="#FFF176"/>
    <rect x="1398" y="714" width="4" height="28" fill="#66BB6A" rx="2"/>

    <circle cx="680" cy="750" r="10" fill="#90CAF9"/>
    <circle cx="680" cy="750" r="4" fill="#FFF176"/>
    <rect x="678" y="760" width="4" height="20" fill="#66BB6A" rx="2"/>

    <circle cx="1250" cy="740" r="11" fill="#FFAB91"/>
    <circle cx="1250" cy="740" r="5" fill="#FFF176"/>
    <rect x="1248" y="751" width="4" height="22" fill="#66BB6A" rx="2"/>
  </g>

  <!-- Butterflies -->
  <g opacity="0.7">
    <ellipse cx="500" cy="350" rx="12" ry="8" fill="#CE93D8" transform="rotate(-20, 500, 350)"/>
    <ellipse cx="520" cy="350" rx="12" ry="8" fill="#CE93D8" transform="rotate(20, 520, 350)"/>
    <circle cx="510" cy="350" r="3" fill="#6A1B9A"/>

    <ellipse cx="1500" cy="400" rx="10" ry="7" fill="#90CAF9" transform="rotate(-15, 1500, 400)"/>
    <ellipse cx="1516" cy="400" rx="10" ry="7" fill="#90CAF9" transform="rotate(15, 1516, 400)"/>
    <circle cx="1508" cy="400" r="2.5" fill="#1565C0"/>
  </g>
</svg>
`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1920 },
  font: { loadSystemFonts: true },
})
const png = resvg.render().asPng()
writeFileSync('store-assets/play-games-cover-1920x1080.png', png)
console.log('Cover saved: store-assets/play-games-cover-1920x1080.png (' + png.length + ' bytes)')
