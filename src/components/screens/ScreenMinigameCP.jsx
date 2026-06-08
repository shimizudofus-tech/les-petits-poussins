import { useState } from 'react'
import ScreenTitle from './ScreenTitle'
import SubjectTabs from '../minigames/SubjectTabs'
import MathExercise from '../minigames/MathExercise'
import DicteeExercise from '../minigames/DicteeExercise'
import LectureExercise from '../minigames/LectureExercise'
import { SCREENS, useGame } from '../../context/GameContext'

const CP_TABS = [
  { id: 'math', label: '➕ Maths' },
  { id: 'dictee', label: '🔤 Dictée' },
  { id: 'lecture', label: '📖 Lecture' },
]

export default function ScreenMinigameCP() {
  const { gameState, setSubject, switchScreen } = useGame()
  const [exerciseKey, setExerciseKey] = useState(0)
  const subject = gameState.currentSubject.cp

  const handleSubject = (sub) => {
    setSubject('cp', sub)
    setExerciseKey((k) => k + 1)
  }

  const handleCorrect = () => {
    setTimeout(() => setExerciseKey((k) => k + 1), 1800)
  }

  return (
    <main className="screen screen-minigame-cp flex h-full min-h-0 w-full max-w-full flex-col overflow-y-auto overflow-x-hidden pb-4">
      <ScreenTitle>✏️ CP — École</ScreenTitle>

      <SubjectTabs tabs={CP_TABS} active={subject} onSelect={handleSubject} />

      <div className="exercise-area flex flex-1 flex-col gap-3 overflow-y-auto px-3.5 pb-1 pt-3.5">
        {subject === 'math' && <MathExercise key={exerciseKey} onCorrect={handleCorrect} />}
        {subject === 'dictee' && <DicteeExercise key={exerciseKey} onCorrect={handleCorrect} />}
        {subject === 'lecture' && <LectureExercise key={exerciseKey} onCorrect={handleCorrect} />}
      </div>

      <button
        type="button"
        onClick={() => switchScreen(SCREENS.LEVEL_SELECT)}
        className="close-btn mx-4 mb-3 mt-2 shrink-0 cursor-pointer rounded-[18px] border-none px-6 py-3 font-sans text-[0.95rem] font-extrabold text-white transition-transform duration-100 active:translate-y-[3px]"
      >
        ← Retour
      </button>
    </main>
  )
}
