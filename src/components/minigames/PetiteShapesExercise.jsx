import { useMemo, useState } from 'react'
import { getMaternelleExercises, pickMaternelleExercise } from '../../data/exercises'
import { SHAPE_RENDERERS } from '../../data/exercises/shapeRenderers'
import { useGame } from '../../context/GameContext'
import { getUnlockedDifficulty, recordMaternelleSuccess } from '../../utils/maternelleProgress'
import ExerciseUnavailable from './ExerciseUnavailable'
import PetiteExerciseHeader from './PetiteExerciseHeader'
import { promptKeyForShape } from '../../utils/audioPrompts'

const SHAPE_AUDIO_BY_ID = {
  circle: 'cercle',
  square: 'carre',
  triangle: 'triangle',
  rectangle: 'rectangle',
  star: 'etoile',
  heart: 'coeur',
}

function resolveShapeAudioKey(shape) {
  if (shape?.audioKey) return shape.audioKey
  if (shape?.shapeId && SHAPE_AUDIO_BY_ID[shape.shapeId]) {
    return SHAPE_AUDIO_BY_ID[shape.shapeId]
  }
  const fromName = shape?.name
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
  return fromName || null
}

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
  const inTest = Boolean(gameState.achievements?.tests?.activeTest)
  const maxDifficulty = getUnlockedDifficulty(gameState.learningProgress, section, 'shapes')
  const quiz = useMemo(() => buildShapeQuiz(section, maxDifficulty), [section, maxDifficulty])
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)

  if (!quiz) {
    return <ExerciseUnavailable />
  }

  const { target, options } = quiz
  const shapeAudioKey = resolveShapeAudioKey(target)

  const handleSelect = (shape) => {
    if (answered) return
    setSelected(shape.name)
    const isCorrect = shape.shapeId === target.shapeId
    setAnswered(true)
    showFeedback(isCorrect)
    if (isCorrect) {
      recordMaternelleSuccess(setGameState, section, 'shapes')
      onCorrect?.()
    } else if (!inTest) {
      setTimeout(() => { setAnswered(false); setSelected(null) }, 1100)
    }
  }

  return (
    <>
      <PetiteExerciseHeader
        instruction="Trouve la forme"
        parentHint={`Cherche : ${target.name}`}
        audioKey={promptKeyForShape(shapeAudioKey)}
        audioLabel={target.name}
      />
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
              className={`shape-item petite-shape-item flex cursor-pointer flex-col items-center gap-2 rounded-[18px] border-[4px] px-5 py-4 text-[0.88rem] font-extrabold text-[#5d3a00] ${
                selected === shape.name
                  ? 'selected border-[#ff8f00] bg-[rgba(255,224,130,0.85)]'
                  : 'border-transparent bg-white/80'
              }`}
            >
              <svg className="shape-svg h-[72px] w-[72px] text-[#5d3a00]" viewBox="0 0 52 52">
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
