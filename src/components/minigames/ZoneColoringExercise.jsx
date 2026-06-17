import { useEffect, useMemo, useState } from 'react'
import { PALETTE_COLORS } from '../../data/canvasDrawings'
import { pickMaternelleExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import { getUnlockedDifficulty, recordMaternelleSuccess } from '../../utils/maternelleProgress'
import ExerciseUnavailable from './ExerciseUnavailable'
import PetiteExerciseHeader from './PetiteExerciseHeader'

export default function ZoneColoringExercise({ exerciseKey, section = 'petite', onCorrect }) {
  const { gameState, setGameState, showFeedback } = useGame()
  const maxDifficulty = getUnlockedDifficulty(gameState.learningProgress, section, 'coloring')
  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[0])
  const [activeZone, setActiveZone] = useState(null)

  const exercise = useMemo(
    () => pickMaternelleExercise(section, 'coloring', maxDifficulty),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exerciseKey, maxDifficulty, section],
  )

  const [zoneFills, setZoneFills] = useState({})

  useEffect(() => {
    setZoneFills({})
    setActiveZone(null)
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
    setActiveZone(zoneId)
  }

  const handleReset = () => {
    setZoneFills({})
    setActiveZone(null)
  }

  // Anti-triche : il faut vraiment colorier avant de pouvoir terminer
  // (sinon on validait à l'infini sans rien colorier → étoiles infinies).
  const coloredCount = Object.keys(zoneFills).length
  const required = Math.max(3, Math.ceil(exercise.zones.length / 2))
  const canFinish = coloredCount >= required

  const handleFinish = () => {
    if (!canFinish) return
    showFeedback(true)
    recordMaternelleSuccess(setGameState, section, 'coloring')
    onCorrect?.()
  }

  return (
    <>
      <PetiteExerciseHeader
        instruction="Colorie"
        parentHint={`${exercise.title} — choisis une couleur, touche une zone`}
        audioKey={exercise.audioKey}
        audioLabel={exercise.title}
      />

      <div className="petite-palette flex flex-wrap justify-center gap-2.5">
        {PALETTE_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setSelectedColor(color)}
            className={`petite-palette-swatch ${
              selectedColor === color ? 'petite-palette-swatch--selected' : ''
            }`}
            style={{
              background: color,
              borderColor: color === '#ffffff' && selectedColor !== color ? '#ccc' : undefined,
            }}
            aria-label={`Couleur ${color}`}
            aria-pressed={selectedColor === color}
          />
        ))}
      </div>

      <div className="zone-coloring-svg-wrap mx-auto mt-2 w-full max-w-[360px]">
        <svg
          viewBox={exercise.viewBox}
          className="zone-coloring-svg w-full rounded-2xl border-4 border-[#e8b84b] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
          role="img"
          aria-label={`Coloriage ${exercise.title}`}
        >
          {exercise.zones.map((zone) => {
            const userFilled = Object.hasOwn(zoneFills, zone.id)
            const guideOpacity = zone.guideOpacity ?? exercise.guideOpacity ?? 0.38
            return (
              <path
                key={zone.id}
                d={zone.d}
                fill={fills[zone.id] ?? zone.defaultFill}
                fillOpacity={userFilled ? 1 : guideOpacity}
                stroke="#4e342e"
                strokeWidth={zone.strokeOnly ? 3 : 3}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`zone-coloring-zone cursor-pointer ${
                  activeZone === zone.id ? 'zone-coloring-zone--active' : ''
                }`}
                onClick={() => handleZoneClick(zone.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleZoneClick(zone.id)}
                tabIndex={0}
                role="button"
                aria-label={`Zone ${zone.id}`}
              />
            )
          })}
        </svg>
      </div>

      {!canFinish && (
        <p className="zone-coloring-hint">🎨 Colorie le dessin pour terminer ({coloredCount}/{required})</p>
      )}

      <div className="petite-actions mt-2 flex justify-center gap-3">
        <button type="button" onClick={handleReset} className="col-btn col-btn--petite reset">
          🗑️ Effacer
        </button>
        <button
          type="button"
          onClick={handleFinish}
          disabled={!canFinish}
          aria-disabled={!canFinish}
          className={`col-btn col-btn--petite validate${canFinish ? '' : ' col-btn--locked'}`}
        >
          ✅ Terminer
        </button>
      </div>
    </>
  )
}
