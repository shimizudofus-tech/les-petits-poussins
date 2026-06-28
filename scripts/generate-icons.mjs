import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const SRC = 'C:/Users/yop/Downloads/icone petit poussin.png'
const srcBuf = readFileSync(SRC)

// Use resvg to resize PNG via an SVG wrapper (embeds the image at target size)
function resizePng(buf, w, h) {
  const b64 = buf.toString('base64')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}">
    <image width="${w}" height="${h}" xlink:href="data:image/png;base64,${b64}" />
  </svg>`
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: w } })
  return resvg.render().asPng()
}

// PWA icons
const targets = [
  { path: 'public/pwa-512x512.png', size: 512 },
  { path: 'public/pwa-192x192.png', size: 192 },
  { path: 'public/apple-touch-icon.png', size: 180 },
]

for (const t of targets) {
  const png = resizePng(srcBuf, t.size, t.size)
  writeFileSync(t.path, png)
  console.log(`  ✓ ${t.path} (${t.size}×${t.size})`)
}

// Android mipmap (adaptive icon = ic_launcher + ic_launcher_round)
const ANDROID_SIZES = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
]

const RES = 'android/app/src/main/res'

for (const { dir, size } of ANDROID_SIZES) {
  const outDir = join(RES, dir)
  mkdirSync(outDir, { recursive: true })
  const png = resizePng(srcBuf, size, size)
  writeFileSync(join(outDir, 'ic_launcher.png'), png)
  writeFileSync(join(outDir, 'ic_launcher_round.png'), png)
  writeFileSync(join(outDir, 'ic_launcher_foreground.png'), png)
  console.log(`  ✓ ${dir}/ic_launcher*.png (${size}×${size})`)
}

// Store asset icon (512×512 for Play Console)
const store512 = resizePng(srcBuf, 512, 512)
writeFileSync('store-assets/icon-512x512.png', store512)
console.log('  ✓ store-assets/icon-512x512.png')

console.log('\nDone! All icons generated.')
