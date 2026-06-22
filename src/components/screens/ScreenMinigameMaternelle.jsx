import { useState } from 'react'
import ScreenTitle from './ScreenTitle'
import SubjectTabs from '../minigames/SubjectTabs'
import ColoringExercise from '../minigames/ColoringExercise'
import ShapesExercise from '../minigames/ShapesExercise'
import CountExercise from '../minigames/CountExercise'
import { SCREENS, useGame } from '../../context/GameContext'

const MAT_TABS = [
  { id: 'colors', label: '🎨 Couleurs' },
  { id: 'shapes', label: '🔷 Formes' },
  { id: 'count', label: '🔢 Compter' },
]

export default function ScreenMinigameMaternelle() {
  const { gameState, setSubject, switchScreen } = useGame()
  const [exerciseKey, setExerciseKey] = useState(0)
  const subject = gameState.currentSubject.mat

  const handleSubject = (sub) => {
    setSubject('mat', sub)
    setExerciseKey((k) => k + 1)
  }

  const handleCorrect = () => {
    setTimeout(() => setExerciseKey((k) => k + 1), 1800)
  }

  return (
    <main className="screen screen-minigame-maternelle flex h-full min-h-0 w-full max-w-full flex-col overflow-y-auto overflow-x-hidden pb-4">
      <ScreenTitle>🌈 Maternelle</ScreenTitle>

      <SubjectTabs tabs={MAT_TABS} active={subject} onSelect={handleSubject} />

      <div className="exercise-area flex flex-1 flex-col gap-3 overflow-y-auto px-3.5 pb-1 pt-3.5">
        {subject === 'colors' && (
          <ColoringExercise
            key={exerciseKey}
            exerciseKey={exerciseKey}
            onCorrect={handleCorrect}
            onReload={() => setExerciseKey((k) => k + 1)}
          />
        )}
        {subject === 'shapes' && <ShapesExercise key={exerciseKey} onCorrect={handleCorrect} />}
        {subject === 'count' && <CountExercise key={exerciseKey} onCorrect={handleCorrect} />}
      </div>

      <button
        type="button"
        onPointerUp={() => switchScreen(SCREENS.LEVEL_SELECT)}
        className="close-btn mx-4 mb-3 mt-2 shrink-0 cursor-pointer rounded-[18px] border-none px-6 py-3 font-sans text-[0.95rem] font-extrabold text-white transition-transform duration-100 active:translate-y-[3px]"
      >
        ← Retour
      </button>
    </main>
  )
}
