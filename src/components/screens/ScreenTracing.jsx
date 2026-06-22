import { useEffect, useMemo, useRef, useState } from 'react'
import ScreenTitle from './ScreenTitle'
import { SCREENS, useGame } from '../../context/GameContext'
import { playWord } from '../../utils/audio'
import { GLYPH_STROKES } from '../../data/glyphStrokes'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const DIGITS = '0123456789'.split('')
const GLYPHS = [...LETTERS, ...DIGITS]

const VB = 300
const TOL = VB * 0.13 // tolérance autour du chemin (px)
const MIN_COVERAGE = 0.7 // % du chemin à suivre
const MIN_ACCURACY = 0.5 // % des points tracés proches du chemin

function audioKeyFor(glyph) {
  return /[0-9]/.test(glyph) ? glyph : `lettre_${glyph.toLowerCase()}`
}

// Normalisé (0..1) → coordonnées SVG.
function scale(nx, ny) {
  return { x: VB * (0.2 + nx * 0.6), y: VB * (0.12 + ny * 0.8) }
}

export default function ScreenTracing() {
  const { setGameState, switchScreen, showFeedback } = useGame()
  const [index, setIndex] = useState(0)
  const [strokes, setStrokes] = useState([])
  const [progress, setProgress] = useState({ cov: 0, acc: 0 })
  const drawingRef = useRef(false)
  const svgRef = useRef(null)
  const coveredRef = useRef(new Set())
  const hitsRef = useRef(0)
  const totalRef = useRef(0)

  const glyph = GLYPHS[index % GLYPHS.length]
  const isDigit = /[0-9]/.test(glyph)

  // Traits guides (mis à l'échelle) + points cibles densifiés pour le scoring.
  const { guideScaled, targets } = useMemo(() => {
    const raw = GLYPH_STROKES[glyph] || []
    const gs = raw.map((stroke) => stroke.map(([nx, ny]) => scale(nx, ny)))
    const pts = []
    for (const stroke of gs) {
      for (let i = 0; i < stroke.length - 1; i++) {
        const a = stroke[i]
        const b = stroke[i + 1]
        const d = Math.hypot(b.x - a.x, b.y - a.y)
        const n = Math.max(1, Math.ceil(d / 14))
        for (let k = 0; k <= n; k++) {
          const t = k / n
          pts.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
        }
      }
    }
    return { guideScaled: gs, targets: pts }
  }, [glyph])

  // Reset à chaque changement de glyphe.
  useEffect(() => {
    setStrokes([])
    setProgress({ cov: 0, acc: 0 })
    coveredRef.current = new Set()
    hitsRef.current = 0
    totalRef.current = 0
  }, [glyph])

  const cov = progress.cov
  const canFinish = targets.length > 0 && cov >= MIN_COVERAGE && progress.acc >= MIN_ACCURACY
  const pct = Math.round(cov * 100)

  const polylines = useMemo(
    () => strokes.map((s) => s.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')),
    [strokes],
  )

  const toPoint = (e) => {
    const r = svgRef.current.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * VB, y: ((e.clientY - r.top) / r.height) * VB }
  }

  const scorePoint = (p) => {
    let near = false
    for (let i = 0; i < targets.length; i++) {
      const t = targets[i]
      if (Math.hypot(p.x - t.x, p.y - t.y) < TOL) {
        coveredRef.current.add(i)
        near = true
      }
    }
    totalRef.current += 1
    if (near) hitsRef.current += 1
    setProgress({
      cov: targets.length ? coveredRef.current.size / targets.length : 0,
      acc: totalRef.current ? hitsRef.current / totalRef.current : 0,
    })
  }

  const onDown = (e) => {
    drawingRef.current = true
    svgRef.current.setPointerCapture?.(e.pointerId)
    const p = toPoint(e)
    setStrokes((prev) => [...prev, [p]])
    scorePoint(p)
  }

  const onMove = (e) => {
    if (!drawingRef.current) return
    const p = toPoint(e)
    setStrokes((prev) => {
      if (!prev.length) return prev
      const last = prev[prev.length - 1]
      const prevPt = last[last.length - 1]
      if (Math.hypot(p.x - prevPt.x, p.y - prevPt.y) < 3) return prev
      const next = prev.slice(0, -1)
      next.push([...last, p])
      return next
    })
    scorePoint(p)
  }

  const onUp = () => {
    drawingRef.current = false
  }

  const reset = () => {
    setStrokes([])
    setProgress({ cov: 0, acc: 0 })
    coveredRef.current = new Set()
    hitsRef.current = 0
    totalRef.current = 0
  }

  const nextGlyph = () => setIndex((i) => (i + 1) % GLYPHS.length)

  const handleListen = () => playWord(audioKeyFor(glyph))

  const handleValidate = () => {
    if (!canFinish) return
    showFeedback(true)
    setGameState((s) => ({ ...s, stars: (s.stars ?? 0) + 1 }))
    setTimeout(nextGlyph, 1400)
  }

  return (
    <main className="screen flex h-full min-h-0 w-full max-w-full flex-col overflow-y-auto overflow-x-hidden pb-4">
      <ScreenTitle>✍️ J'écris</ScreenTitle>

      <p className="cp-level-badge mx-3.5 mt-2 shrink-0 text-center">
        {isDigit ? 'Chiffre' : 'Lettre'} {glyph} — suis les pointillés avec ton doigt
      </p>

      <div className="mx-auto mt-1 flex shrink-0 items-center gap-3">
        <button type="button" className="listen-btn" onClick={handleListen} aria-label="Écouter">🔊 Écouter</button>
      </div>

      <div className="zone-coloring-svg-wrap mx-auto mt-2 w-full max-w-[340px]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB} ${VB}`}
          className="zone-coloring-svg w-full rounded-2xl border-4 border-[#e8b84b] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
          style={{ touchAction: 'none', cursor: 'crosshair' }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          role="img"
          aria-label={`Trace ${glyph}`}
        >
          {/* guide : chemin de la lettre en pointillés + point de départ vert */}
          {guideScaled.map((stroke, i) => (
            <g key={`g-${i}`}>
              <polyline
                points={stroke.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
                fill="none"
                stroke="#c9b6e0"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2 14"
                opacity="0.8"
              />
              <circle cx={stroke[0].x} cy={stroke[0].y} r="9" fill="#66bb6a" />
            </g>
          ))}
          {/* tracé de l'enfant */}
          {polylines.map((pts, i) => (
            <polyline
              key={i}
              points={pts}
              fill="none"
              stroke="#ff7043"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>

      {!canFinish && (
        <p className="zone-coloring-hint">✏️ Suis le chemin ({pct}%)</p>
      )}

      <div className="petite-actions mt-2 flex justify-center gap-3">
        <button type="button" onClick={reset} className="col-btn col-btn--petite reset">🗑️ Effacer</button>
        <button
          type="button"
          onClick={handleValidate}
          disabled={!canFinish}
          className={`col-btn col-btn--petite validate${canFinish ? '' : ' col-btn--locked'}`}
        >
          ✅ Bravo !
        </button>
        <button type="button" onClick={nextGlyph} className="col-btn col-btn--petite">➡️ Suivant</button>
      </div>

      <button
        type="button"
        onPointerUp={() => switchScreen(SCREENS.LEVEL_SELECT)}
        className="close-btn mx-4 mb-3 mt-3 shrink-0 cursor-pointer rounded-[18px] border-none px-6 py-3 font-sans text-[0.95rem] font-extrabold text-white transition-transform duration-100 active:translate-y-[3px]"
      >
        ← Retour
      </button>
    </main>
  )
}
