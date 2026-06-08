import { useEffect, useMemo, useState } from 'react'
import { PALETTE_COLORS } from '../../data/canvasDrawings'
import { pickMaternelleExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import { getUnlockedDifficulty, recordMaternelleSuccess } from '../../utils/maternelleProgress'
import ExerciseUnavailable from './ExerciseUnavailable'

export default function ZoneColoringExercise({ exerciseKey, section = 'petite', onCorrect }) {
  const { gameState, setGameState, showFeedback } = useGame()
  const maxDifficulty = getUnlockedDifficulty(gameState.learningProgress, section, 'coloring')
  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[0])

  const exercise = useMemo(
    () => pickMaternelleExercise(section, 'coloring', maxDifficulty),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exerciseKey, maxDifficulty, section],
  )

  const [zoneFills, setZoneFills] = useState({})

  useEffect(() => {
    setZoneFills({})
  }, [exerciseKey, exercise?.id])

  const fills = useMemo(() => {
    if (!exercise) return {}
    const initial = {}
    for (const zone of exercise.zones) {
      initial[zone.id] = zoneFills[zone.id] ?? zone.defaultFill
    }
    return initial
  }, [exercise, zoneFills])

  if (!exercise) {
    return <ExerciseUnavailable />
  }

  const handleZoneClick = (zoneId) => {
    setZoneFills((prev) => ({ ...prev, [zoneId]: selectedColor }))
  }

  const handleReset = () => {
    setZoneFills({})
  }

  const handleFinish = () => {
    showFeedback(true)
    recordMaternelleSuccess(setGameState, section, 'coloring')
    onCorrect?.()
  }

  return (
    <>
      <div className="mb-1 text-center text-[0.9rem] font-extrabold text-[#5d3a00]">
        🖍️ Colorie : {exercise.title}
      </div>
      <p className="mb-2 text-center text-[0.72rem] font-bold text-[#8d6e3a]">
        Choisis une couleur, puis touche une zone !
      </p>

      <div className="color-palette flex flex-wrap justify-center gap-2">
        {PALETTE_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setSelectedColor(color)}
            className={`color-swatch h-10 w-10 rounded-full border-[3px] shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-transform active:scale-90 ${
              selectedColor === color
                ? 'scale-110 border-white shadow-[0_0_0_3px_#ff8f00]'
                : 'border-white/50'
            }`}
            style={{
              background: color,
              borderColor: color === '#ffffff' && selectedColor !== color ? '#ccc' : undefined,
            }}
            aria-label={`Couleur ${color}`}
          />
        ))}
      </div>

      <div className="zone-coloring-svg-wrap mx-auto mt-3 w-full max-w-[280px]">
        <svg
          viewBox={exercise.viewBox}
          className="zone-coloring-svg w-full rounded-2xl border-4 border-[#e8b84b] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
          role="img"
          aria-label={`Coloriage ${exercise.title}`}
        >
          {exercise.zones.map((zone) => (
            <path
              key={zone.id}
              d={zone.d}
              fill={fills[zone.id] ?? zone.defaultFill}
              stroke="#5d4037"
              strokeWidth={zone.strokeOnly ? 3 : 2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="zone-coloring-zone cursor-pointer"
              onClick={() => handleZoneClick(zone.id)}
              onKeyDown={(e) => e.key === 'Enter' && handleZoneClick(zone.id)}
              tabIndex={0}
              role="button"
              aria-label={`Zone ${zone.id}`}
            />
          ))}
        </svg>
      </div>

      <div className="coloring-actions mt-3 flex justify-center gap-2.5">
        <button type="button" onClick={handleReset} className="col-btn reset">
          🗑️ Effacer
        </button>
        <button type="button" onClick={handleFinish} className="col-btn validate">
          ✅ Terminer (+2⭐)
        </button>
      </div>
    </>
  )
}
