export function drawChicken(ctx) {
  ctx.strokeStyle = '#5d3a00'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.ellipse(140, 130, 60, 50, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(170, 70, 30, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(198, 68)
  ctx.lineTo(218, 72)
  ctx.lineTo(198, 76)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(160, 42)
  ctx.quadraticCurveTo(168, 30, 176, 42)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(170, 42)
  ctx.quadraticCurveTo(178, 28, 186, 42)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(175, 66, 4, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(120, 125, 35, 22, -0.3, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(120, 178)
  ctx.lineTo(110, 200)
  ctx.moveTo(110, 200)
  ctx.lineTo(100, 200)
  ctx.moveTo(110, 200)
  ctx.lineTo(115, 195)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(150, 178)
  ctx.lineTo(140, 200)
  ctx.moveTo(140, 200)
  ctx.lineTo(130, 200)
  ctx.moveTo(140, 200)
  ctx.lineTo(145, 195)
  ctx.stroke()
}

export function drawFlower(ctx) {
  ctx.strokeStyle = '#5d3a00'
  ctx.lineWidth = 2.5
  const cx = 140
  const cy = 110
  const r = 28
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    ctx.beginPath()
    ctx.ellipse(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 20, 12, a, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.arc(cx, cy, 22, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx, cy + 22)
  ctx.lineTo(cx, 195)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx, cy + 80)
  ctx.bezierCurveTo(cx + 40, cy + 60, cx + 45, cy + 90, cx + 20, cy + 90)
  ctx.stroke()
}

export function drawHouse(ctx) {
  ctx.strokeStyle = '#5d3a00'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.rect(70, 110, 140, 90)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(55, 112)
  ctx.lineTo(140, 40)
  ctx.lineTo(225, 112)
  ctx.stroke()
  ctx.beginPath()
  ctx.rect(118, 150, 44, 50)
  ctx.stroke()
  ctx.beginPath()
  ctx.rect(82, 125, 36, 30)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(100, 125)
  ctx.lineTo(100, 155)
  ctx.moveTo(82, 140)
  ctx.lineTo(118, 140)
  ctx.stroke()
  ctx.beginPath()
  ctx.rect(175, 55, 20, 35)
  ctx.stroke()
}

export const COLORING_FIGURES = [
  { label: '🐔 Poule', draw: drawChicken },
  { label: '🌸 Fleur', draw: drawFlower },
  { label: '🏠 Maison', draw: drawHouse },
]

export const PALETTE_COLORS = [
  '#ef5350',
  '#ff9800',
  '#ffeb3b',
  '#66bb6a',
  '#42a5f5',
  '#7e57c2',
  '#f06292',
  '#8d6e63',
  '#000000',
  '#ffffff',
]
