import { useState } from 'react'
import ScreenTitle from './ScreenTitle'
import SubjectTabs from '../minigames/SubjectTabs'
import ZoneColoringExercise from '../minigames/ZoneColoringExercise'
import PetiteColorsExercise from '../minigames/PetiteColorsExercise'
import PetiteShapesExercise from '../minigames/PetiteShapesExercise'
import PetiteCountExercise from '../minigames/PetiteCountExercise'
import PuzzleExercise from '../minigames/PuzzleExercise'
import { SCREENS, useGame } from '../../context/GameContext'

const SECTION_META = {
  petite: {
    icon: '🐣',
    title: 'Petite Section',
    subtitle: 'Petits',
    tabs: [
      { id: 'coloring', label: '🖍️ Colorier' },
      { id: 'colors', label: '🎨 Couleurs' },
      { id: 'shapes', label: '🔷 Formes' },
      { id: 'counting', label: '🔢 Compter' },
      { id: 'puzzles', label: '🧩 Puzzle' },
    ],
  },
  moyenne: {
    icon: '🐥',
    title: 'Moyenne Section',
    subtitle: 'Moyens',
    tabs: null,
  },
  grande: {
    icon: '🐔',
    title: 'Grande Section',
    subtitle: 'Grands',
    tabs: null,
  },
}

export default function ScreenMaternelleSection() {
  const { gameState, setSubject, switchScreen } = useGame()
  const [exerciseKey, setExerciseKey] = useState(0)

  const section = gameState.maternelleSection ?? 'petite'
  const meta = SECTION_META[section] ?? SECTION_META.petite
  const subject = gameState.currentSubject?.[section] ?? 'coloring'

  const handleSubject = (sub) => {
    setSubject(section, sub)
    setExerciseKey((k) => k + 1)
  }

  const handleCorrect = () => {
    setTimeout(() => setExerciseKey((k) => k + 1), 1800)
  }

  const comingSoon = section !== 'petite'

  return (
    <main className="screen screen-maternelle-section flex h-full min-h-0 w-full max-w-full flex-col overflow-y-auto overflow-x-hidden pb-4">
      <ScreenTitle>
        {meta.icon} {meta.title}
      </ScreenTitle>

      {comingSoon ? (
        <div className="maternelle-coming-soon flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="text-5xl" aria-hidden="true">
            {meta.icon}
          </span>
          <p className="text-base font-extrabold text-[#5d3a00]">Bientôt disponible !</p>
          <p className="text-[0.78rem] font-bold text-[#8d6e3a]">
            La {meta.title} arrive bientôt. Essaie la Petite Section pour l&apos;instant !
          </p>
        </div>
      ) : (
        <>
          <SubjectTabs tabs={meta.tabs} active={subject} onSelect={handleSubject} variant="petite" />

          <div className="exercise-area flex flex-1 flex-col gap-3 overflow-y-auto px-3.5 pb-1 pt-3.5">
            {subject === 'coloring' && (
              <ZoneColoringExercise
                key={exerciseKey}
                section={section}
                exerciseKey={exerciseKey}
                onCorrect={handleCorrect}
              />
            )}
            {subject === 'colors' && (
              <PetiteColorsExercise key={exerciseKey} section={section} onCorrect={handleCorrect} />
            )}
            {subject === 'shapes' && (
              <PetiteShapesExercise key={exerciseKey} section={section} onCorrect={handleCorrect} />
            )}
            {subject === 'counting' && (
              <PetiteCountExercise key={exerciseKey} section={section} onCorrect={handleCorrect} />
            )}
            {subject === 'puzzles' && (
              <PuzzleExercise
                key={exerciseKey}
                section={section}
                exerciseKey={exerciseKey}
                onCorrect={handleCorrect}
              />
            )}
          </div>
        </>
      )}

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
