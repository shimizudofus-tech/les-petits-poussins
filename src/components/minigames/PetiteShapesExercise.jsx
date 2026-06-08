import { useMemo, useState } from 'react'
import { getMaternelleExercises, pickMaternelleExercise } from '../../data/exercises'
import { SHAPE_RENDERERS } from '../../data/exercises/shapeRenderers'
import { useGame } from '../../context/GameContext'
import { getUnlockedDifficulty, recordMaternelleSuccess } from '../../utils/maternelleProgress'
import ExerciseUnavailable from './ExerciseUnavailable'

function buildShapeQuiz(section, maxDifficulty) {
  const target = pickMaternelleExercise(section, 'shapes', maxDifficulty)
  if (!target) return null

  const pool = getMaternelleExercises(section, 'shapes').filter(
    (item) => (item.difficulty ?? 1) <= maxDifficulty && item.shapeId !== target.shapeId,
  )

  const maxChoices = maxDifficulty === 1 ? 2 : 3
  const distractors = []
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  for (const item of shuffled) {
    if (distractors.length >= maxChoices - 1) break
    if (!distractors.find((d) => d.shapeId === item.shapeId)) {
      distractors.push(item)
    }
  }

  const options = [target, ...distractors].sort(() => Math.random() - 0.5)
  return { target, options }
}

export default function PetiteShapesExercise({ section = 'petite', onCorrect }) {
  const { gameState, setGameState, showFeedback } = useGame()
  const maxDifficulty = getUnlockedDifficulty(gameState.learningProgress, section, 'shapes')
  const quiz = useMemo(() => buildShapeQuiz(section, maxDifficulty), [section, maxDifficulty])
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)

  if (!quiz) {
    return <ExerciseUnavailable />
  }

  const { target, options } = quiz

  const handleSelect = (shape) => {
    if (answered) return
    setSelected(shape.name)
    const isCorrect = shape.shapeId === target.shapeId
    setAnswered(true)
    showFeedback(isCorrect)
    if (isCorrect) {
      recordMaternelleSuccess(setGameState, section, 'shapes')
      onCorrect?.()
    }
  }

  return (
    <>
      <div className="mb-2 text-center text-[0.95rem] font-extrabold text-[#5d3a00]">
        👆 Trouve le <strong>{target.name}</strong> !
      </div>
      <div className="shapes-row flex flex-wrap justify-center gap-4">
        {options.map((shape) => {
          const ShapeIcon = SHAPE_RENDERERS[shape.shapeId]
          return (
            <div
              key={shape.id}
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(shape)}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(shape)}
              className={`shape-item petite-shape-item flex cursor-pointer flex-col items-center gap-1 rounded-[16px] border-[3px] px-4 py-3 text-[0.8rem] font-extrabold text-[#5d3a00] ${
                selected === shape.name
                  ? 'selected border-[#ff8f00] bg-[rgba(255,224,130,0.85)]'
                  : 'border-transparent bg-white/80'
              }`}
            >
              <svg className="shape-svg h-[60px] w-[60px] text-[#5d3a00]" viewBox="0 0 52 52">
                {ShapeIcon ? <ShapeIcon /> : null}
              </svg>
              <span>{shape.name}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}
