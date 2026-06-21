import { useMemo, useRef, useState } from 'react'
import ScreenTitle from './ScreenTitle'
import { SCREENS, useGame } from '../../context/GameContext'
import { playWord, playSuccess } from '../../utils/audio'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const DIGITS = '0123456789'.split('')
const GLYPHS = [...LETTERS, ...DIGITS]

const VB = 300
const REQUIRED_LEN = 230 // longueur de tracé minimale pour valider

function audioKeyFor(glyph) {
  if (/[0-9]/.test(glyph)) return glyph
  return `lettre_${glyph.toLowerCase()}`
}

export default function ScreenTracing() {
  const { gameState, setGameState, switchScreen, showFeedback } = useGame()
  const [index, setIndex] = useState(0)
  const [strokes, setStrokes] = useState([]) // [[{x,y}...], ...]
  const [len, setLen] = useState(0)
  const drawingRef = useRef(false)
  const svgRef = useRef(null)

  const glyph = GLYPHS[index % GLYPHS.length]
  const canFinish = len >= REQUIRED_LEN
  const pct = Math.min(100, Math.round((len / REQUIRED_LEN) * 100))

  const polylines = useMemo(
    () => strokes.map((s) => s.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')),
    [strokes],
  )

  const toPoint = (e) => {
    const r = svgRef.current.getBoundingClientRect()
    return {
      x: ((e.clientX - r.left) / r.width) * VB,
      y: ((e.clientY - r.top) / r.height) * VB,
    }
  }

  const onDown = (e) => {
    drawingRef.current = true
    svgRef.current.setPointerCapture?.(e.pointerId)
    const p = toPoint(e)
    setStrokes((prev) => [...prev, [p]])
  }

  const onMove = (e) => {
    if (!drawingRef.current) return
    const p = toPoint(e)
    setStrokes((prev) => {
      if (!prev.length) return prev
      const last = prev[prev.length - 1]
      const prevPt = last[last.length - 1]
      const d = Math.hypot(p.x - prevPt.x, p.y - prevPt.y)
      if (d < 3) return prev // ignore micro-mouvements
      setLen((L) => L + d)
      const next = prev.slice(0, -1)
      next.push([...last, p])
      return next
    })
  }

  const onUp = () => {
    drawingRef.current = false
  }

  const reset = () => {
    setStrokes([])
    setLen(0)
  }

  const nextGlyph = () => {
    reset()
    setIndex((i) => (i + 1) % GLYPHS.length)
  }

  const handleListen = () => playWord(audioKeyFor(glyph))

  const handleValidate = () => {
    if (!canFinish) return
    showFeedback(true)
    playSuccess()
    setGameState((s) => ({ ...s, stars: (s.stars ?? 0) + 1 }))
    setTimeout(nextGlyph, 1400)
  }

  const isDigit = /[0-9]/.test(glyph)

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
          {/* guide : glyphe en pointillés */}
          <text
            x={VB / 2}
            y={VB * 0.78}
            textAnchor="middle"
            fontSize={VB * 0.86}
            fontWeight="800"
            fontFamily="system-ui, sans-serif"
            fill="#f1eaf6"
            stroke="#c9b6e0"
            strokeWidth="3"
            strokeDasharray="5 9"
          >
            {glyph}
          </text>
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
        <p className="zone-coloring-hint">✏️ Trace la {isDigit ? 'chiffre' : 'lettre'} ({pct}%)</p>
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
        onClick={() => switchScreen(SCREENS.LEVEL_SELECT)}
        className="close-btn mx-4 mb-3 mt-3 shrink-0 cursor-pointer rounded-[18px] border-none px-6 py-3 font-sans text-[0.95rem] font-extrabold text-white transition-transform duration-100 active:translate-y-[3px]"
      >
        ← Retour
      </button>
    </main>
  )
}
