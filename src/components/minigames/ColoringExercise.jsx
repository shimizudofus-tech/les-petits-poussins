import { useCallback, useEffect, useMemo, useRef } from 'react'
import { COLORING_FIGURES, PALETTE_COLORS } from '../../data/canvasDrawings'
import { pickRandomExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import ExerciseUnavailable from './ExerciseUnavailable'

const FIGURE_BY_ID = {
  chicken: COLORING_FIGURES[0],
  flower: COLORING_FIGURES[1],
  house: COLORING_FIGURES[2],
}

export default function ColoringExercise({ exerciseKey, onCorrect, onReload }) {
  const { gameState, setGameState, showFeedback } = useGame()
  const canvasRef = useRef(null)
  const paintingRef = useRef(false)
  const currentColorRef = useRef(gameState.coloring.currentColor)

  const colorExercise = useMemo(
    () => pickRandomExercise('maternelle', 'colors'),
    [exerciseKey],
  )

  const figure = useMemo(() => {
    if (!colorExercise) return null
    return FIGURE_BY_ID[colorExercise.figureId] ?? COLORING_FIGURES[0]
  }, [colorExercise])

  currentColorRef.current = gameState.coloring.currentColor

  const initCanvas = useCallback(() => {
    if (!figure) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    figure.draw(ctx)
    setGameState((prev) => ({
      ...prev,
      coloring: { ...prev.coloring, drawn: false },
    }))
  }, [figure, setGameState])

  useEffect(() => {
    if (figure) initCanvas()
  }, [initCanvas, figure])

  if (!colorExercise || !figure) {
    return <ExerciseUnavailable />
  }

  const getPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const src = e.touches ? e.touches[0] : e
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top) * scaleY,
    }
  }

  const startPaint = (e) => {
    paintingRef.current = true
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const p = getPos(e)
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    e.preventDefault()
  }

  const doPaint = (e) => {
    if (!paintingRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const p = getPos(e)
    ctx.lineWidth = 18
    ctx.lineCap = 'round'
    ctx.strokeStyle = currentColorRef.current
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    setGameState((prev) => ({
      ...prev,
      coloring: { ...prev.coloring, drawn: true },
    }))
    e.preventDefault()
  }

  const endPaint = () => {
    paintingRef.current = false
  }

  const selectColor = (color) => {
    setGameState((prev) => ({
      ...prev,
      coloring: { ...prev.coloring, currentColor: color },
    }))
  }

  const handleValidate = () => {
    showFeedback(true)
    onCorrect?.()
  }

  return (
    <>
      <div className="mb-1 text-center text-[0.85rem] font-extrabold text-[#5d3a00]">
        🖌️ {colorExercise.prompt ?? `Colorie ${figure.label} !`}{' '}
        <span className="text-base">{colorExercise.emoji}</span>
      </div>
      <div className="coloring-area flex flex-col items-center gap-2.5">
        <div className="color-palette flex flex-wrap justify-center gap-2">
          {PALETTE_COLORS.map((color) => (
            <div
              key={color}
              role="button"
              tabIndex={0}
              onClick={() => selectColor(color)}
              onKeyDown={(e) => e.key === 'Enter' && selectColor(color)}
              className={`color-swatch h-9 w-9 cursor-pointer rounded-full border-[3px] shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-[transform,box-shadow] duration-150 active:scale-90 ${
                gameState.coloring.currentColor === color
                  ? 'active-color scale-125 border-white shadow-[0_0_0_3px_#ff8f00]'
                  : 'border-white/50'
              }`}
              style={{
                background: color,
                borderColor: color === '#ffffff' && gameState.coloring.currentColor !== color ? '#ccc' : undefined,
              }}
            />
          ))}
        </div>

        <canvas
          ref={canvasRef}
          id="coloring-canvas"
          width={280}
          height={200}
          className="cursor-crosshair touch-none rounded-2xl border-4 border-[#e8b84b] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
          onMouseDown={startPaint}
          onMouseMove={doPaint}
          onMouseUp={endPaint}
          onMouseLeave={endPaint}
          onTouchStart={startPaint}
          onTouchMove={doPaint}
          onTouchEnd={endPaint}
        />

        <div className="coloring-actions flex gap-2.5">
          <button type="button" onClick={onReload} className="col-btn reset">
            🗑️ Effacer
          </button>
          <button type="button" onClick={handleValidate} className="col-btn validate">
            ✅ Valider (+2⭐)
          </button>
        </div>
      </div>
    </>
  )
}
