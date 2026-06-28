import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'fs'
const buf = readFileSync('store-assets/icon-512x512.png')
const b64 = buf.toString('base64')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512">
  <defs><clipPath id="c"><circle cx="256" cy="256" r="256"/></clipPath></defs>
  <g clip-path="url(#c)"><image width="512" height="512" xlink:href="data:image/png;base64,${b64}"/></g>
</svg>`
const png = new Resvg(svg, { fitTo: { mode: 'width', value: 512 } }).render().asPng()
writeFileSync('scripts/icon-preview-circle.png', png)
console.log('ok')
