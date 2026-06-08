import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svgPath = join(root, 'public', 'pwa-icon.svg')
const svg = readFileSync(svgPath, 'utf8')

const exports = [
  { size: 192, filename: 'pwa-192x192.png' },
  { size: 512, filename: 'pwa-512x512.png' },
  { size: 180, filename: 'apple-touch-icon.png' },
]

for (const { size, filename } of exports) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } })
  const png = resvg.render().asPng()
  const out = join(root, 'public', filename)
  writeFileSync(out, png)
  console.log(`✓ ${filename} (${size}×${size})`)
}

console.log(`Source: ${svgPath}`)
