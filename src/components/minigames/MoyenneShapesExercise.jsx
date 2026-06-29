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
  oval: 'ovale',
  diamond: 'losange',
}

function resolveShapeAudioKey(exercise) {
  if (exercise?.audioKey) return exercise.audioKey
  if (exercise?.shapeId && SHAPE_AUDIO_BY_ID[exercise.shapeId]) {
    return SHAPE_AUDIO_BY_ID[exercise.shapeId]
  }
  return null
}

function buildShapeOptions(exercise, allShapes, maxDifficulty) {
  if (exercise.type === 'findShape') {
    const pool = allShapes.filter(
      (item) =>
        (item.difficulty ?? 1) <= maxDifficulty &&
        item.type === 'findShape' &&
        item.id !== exercise.id,
    )
    const distractors = []
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    for (const item of shuffled) {
      if (distractors.length >= (maxDifficulty === 1 ? 2 : 3) - 1) break
      if (!distractors.find((d) => d.shapeId === item.shapeId)) distractors.push(item)
    }
    return [exercise, ...distractors].sort(() => Math.random() - 0.5)
  }
  return shuffleObjects([exercise.correct, ...exercise.distractors])
}

function shuffleObjects(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

export default function MoyenneShapesExercise({ section = 'moyenne', onCorrect }) {
  const { gameState, setGameState, showFeedback } = useGame()
  const maxDifficulty = getUnlockedDifficulty(gameState.learningProgress, section, 'shapes')
  const exercise = useMemo(
    () => pickMaternelleExercise(section, 'shapes', maxDifficulty),
    [section, maxDifficulty],
  )
  const allShapes = useMemo(() => getMaternelleExercises(section, 'shapes'), [section])
  const options = useMemo(
    () => (exercise ? buildShapeOptions(exercise, allShapes, maxDifficulty) : []),
    [exercise, allShapes, maxDifficulty],
  )
  const [answered, setAnswered] = useState(false)

  if (!exercise) {
    return <ExerciseUnavailable />
  }

  const audioKey = resolveShapeAudioKey(exercise)

  const instruction =
    exercise.type === 'roundObject'
      ? 'Objet rond ?'
      : exercise.type === 'matchShape'
        ? 'Associe la forme'
        : 'Trouve la forme'

  const parentHint =
    exercise.type === 'roundObject'
      ? 'Quel objet est rond ?'
      : exercise.type === 'matchShape'
        ? `Forme : ${exercise.name}`
        : `Cherche : ${exercise.name}`

  const handleShapePick = (shape) => {
    if (answered) return
    setAnswered(true)
    const isCorrect = shape.shapeId === exercise.shapeId
    showFeedback(isCorrect)
    if (isCorrect) {
      recordMaternelleSuccess(setGameState, section, 'shapes')
      onCorrect?.()
    } else {
      setTimeout(() => setAnswered(false), 1100)
    }
  }

  const handleObjectPick = (choice) => {
    if (answered) return
    setAnswered(true)
    const targetId = exercise.correct.id
    const isCorrect = choice.id === targetId
    showFeedback(isCorrect)
    if (isCorrect) {
      recordMaternelleSuccess(setGameState, section, 'shapes')
      onCorrect?.()
    } else {
      setTimeout(() => setAnswered(false), 1100)
    }
  }

  if (exercise.type === 'findShape') {
    return (
      <>
        <PetiteExerciseHeader
          instruction={instruction}
          parentHint={parentHint}
          audioKey={promptKeyForShape(audioKey)}
          audioLabel={exercise.name}
        />
        <div className="shapes-row flex flex-wrap justify-center gap-4">
          {options.map((shape) => {
            const ShapeIcon = SHAPE_RENDERERS[shape.shapeId]
            return (
              <div
                key={shape.id}
                role="button"
                tabIndex={0}
                onClick={() => handleShapePick(shape)}
                onKeyDown={(e) => e.key === 'Enter' && handleShapePick(shape)}
                className="shape-item petite-shape-item moyenne-shape-item flex cursor-pointer flex-col items-center gap-2 rounded-[18px] border-[4px] border-transparent bg-white/80 px-5 py-4 text-[0.88rem] font-extrabold text-[#5d3a00]"
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

  return (
    <>
      <PetiteExerciseHeader
        instruction={instruction}
        parentHint={parentHint}
        audioKey={promptKeyForShape(audioKey)}
        audioLabel={exercise.name}
      />
      {exercise.type === 'matchShape' && (
        <div className="moyenne-shape-prompt flex justify-center py-2">
          <svg className="shape-svg h-[80px] w-[80px] text-[#5d3a00]" viewBox="0 0 52 52">
            {SHAPE_RENDERERS[exercise.shapeId] ? SHAPE_RENDERERS[exercise.shapeId]() : null}
          </svg>
        </div>
      )}
      <div className="moyenne-object-choices flex flex-wrap justify-center gap-3">
        {options.map((choice) => (
          <button
            key={choice.id}
            type="button"
            disabled={answered}
            onClick={() => handleObjectPick(choice)}
            className="moyenne-object-choice"
            aria-label={choice.label}
          >
            <span className="moyenne-object-emoji">{choice.emoji}</span>
            <span className="moyenne-object-label">{choice.label}</span>
          </button>
        ))}
      </div>
    </>
  )
}
