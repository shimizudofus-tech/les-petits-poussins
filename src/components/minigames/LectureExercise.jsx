import { useMemo } from 'react'
import { pickCpExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import { getCpUnlockedDifficulty } from '../../utils/cpProgress'
import { playWord } from '../../utils/audioManager'
import ExerciseImageDisplay from './ExerciseImageDisplay'
import AnswerButtons from './AnswerButtons'
import ExerciseUnavailable from './ExerciseUnavailable'

export default function LectureExercise({ onCorrect, exerciseKey = 0 }) {
  const { gameState } = useGame()
  const maxDifficulty = getCpUnlockedDifficulty(gameState.learningProgress, 'lecture')

  const exercise = useMemo(() => {
    const source = pickCpExercise('lecture', maxDifficulty)
    if (!source) return null

    const parts = source.sentence.split('___')
    return {
      ...source,
      before: parts[0] ?? '',
      after: parts[1] ?? '',
      options: [...source.choices].sort(() => Math.random() - 0.5).map((o) => ({ label: o, value: o })),
    }
  }, [exerciseKey, maxDifficulty])

  if (!exercise) {
    return <ExerciseUnavailable />
  }

  return (
    <>
      <div className="lecture-card">
        <div className="lecture-image">
          <ExerciseImageDisplay imageKey={exercise.imageKey} className="text-[3rem]" />
        </div>
        <button
          type="button"
          onClick={() => playWord(exercise.audioKey ?? exercise.answer)}
          className="listen-btn mx-auto mb-2 block"
        >
          🔊 Écouter
        </button>
        <div className="lecture-phrase">
          {exercise.before}
          <span className="lecture-missing">_ _ _ _ _</span>
          {exercise.after}
        </div>
      </div>
      <div className="mt-1 text-center text-[0.82rem] font-extrabold text-[#5d3a00]">
        Quel mot manque-t-il ?
      </div>
      <AnswerButtons
        options={exercise.options}
        correct={exercise.answer}
        onCorrect={onCorrect}
        columns={3}
      />
    </>
  )
}
