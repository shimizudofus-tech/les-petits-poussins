import { useEffect, useState } from 'react'
import ScreenTitle from './ScreenTitle'
import SubjectTabs from '../minigames/SubjectTabs'
import ZoneColoringExercise from '../minigames/ZoneColoringExercise'
import PetiteColorsExercise from '../minigames/PetiteColorsExercise'
import PetiteShapesExercise from '../minigames/PetiteShapesExercise'
import PetiteCountExercise from '../minigames/PetiteCountExercise'
import PuzzleExercise from '../minigames/PuzzleExercise'
import MoyenneColorsExercise from '../minigames/MoyenneColorsExercise'
import MoyenneShapesExercise from '../minigames/MoyenneShapesExercise'
import MoyenneCountExercise from '../minigames/MoyenneCountExercise'
import PatternExercise from '../minigames/PatternExercise'
import GrandeLettersExercise from '../minigames/GrandeLettersExercise'
import GrandeSoundsExercise from '../minigames/GrandeSoundsExercise'
import GrandeCountExercise from '../minigames/GrandeCountExercise'
import GrandeLogicExercise from '../minigames/GrandeLogicExercise'
import { TESTABLE_SUBJECTS } from '../../data/badges'
import { SCREENS, useGame } from '../../context/GameContext'

const DEFAULT_SUBJECT = {
  petite: 'coloring',
  moyenne: 'colors',
  grande: 'letters',
}

const SECTION_META = {
  petite: {
    icon: '🐣',
    title: 'Petite Section',
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
    tabs: [
      { id: 'colors', label: '🎨 Couleurs +' },
      { id: 'shapes', label: '🔷 Formes +' },
      { id: 'counting', label: '🔢 Compter' },
      { id: 'puzzles', label: '🧩 Puzzle' },
      { id: 'patterns', label: '🔁 Suites' },
    ],
  },
  grande: {
    icon: '🐔',
    title: 'Grande Section',
    tabs: [
      { id: 'letters', label: '🔤 Lettres' },
      { id: 'sounds', label: '👂 Sons' },
      { id: 'counting', label: '🔢 Compter 10' },
      { id: 'puzzles', label: '🧩 Puzzle +' },
      { id: 'logic', label: '🧠 Logique' },
    ],
  },
}

export default function ScreenMaternelleSection() {
  const {
    gameState,
    setSubject,
    switchScreen,
    setExerciseContext,
    registerExerciseAdvance,
    startTest,
    showToast,
  } = useGame()
  const [exerciseKey, setExerciseKey] = useState(0)

  const section = gameState.maternelleSection ?? 'petite'
  const meta = SECTION_META[section] ?? SECTION_META.petite
  const subject = gameState.currentSubject?.[section] ?? DEFAULT_SUBJECT[section] ?? 'coloring'
  const activeTest = gameState.achievements?.tests?.activeTest
  const canStartTest = TESTABLE_SUBJECTS.has(subject) && !activeTest

  useEffect(() => {
    setExerciseContext({ level: 'maternelle', section, subject })
  }, [section, subject, setExerciseContext])

  useEffect(() => {
    registerExerciseAdvance(() => {
      setExerciseKey((k) => k + 1)
    })
    return () => registerExerciseAdvance(null)
  }, [registerExerciseAdvance])

  const handleSubject = (sub) => {
    setSubject(section, sub)
    setExerciseKey((k) => k + 1)
  }

  const handleCorrect = () => {
    if (activeTest) return
    setTimeout(() => setExerciseKey((k) => k + 1), 1800)
  }

  const handleStartTest = () => {
    startTest({ level: 'maternelle', section, subject, length: 5 })
    setExerciseKey((k) => k + 1)
    showToast('Petit test : 5 questions !', '#7c4dff')
  }

  const comingSoon = false
  const isPuzzle = subject === 'puzzles'
  const tabVariant =
    section === 'petite' || section === 'moyenne' || section === 'grande' ? section : undefined

  const renderExercise = () => {
    if (section === 'petite') {
      if (subject === 'coloring') {
        return (
          <ZoneColoringExercise
            key={exerciseKey}
            section={section}
            exerciseKey={exerciseKey}
            onCorrect={handleCorrect}
          />
        )
      }
      if (subject === 'colors') {
        return <PetiteColorsExercise key={exerciseKey} section={section} onCorrect={handleCorrect} />
      }
      if (subject === 'shapes') {
        return <PetiteShapesExercise key={exerciseKey} section={section} onCorrect={handleCorrect} />
      }
      if (subject === 'counting') {
        return <PetiteCountExercise key={exerciseKey} section={section} onCorrect={handleCorrect} />
      }
      if (subject === 'puzzles') {
        return (
          <PuzzleExercise
            key={exerciseKey}
            section={section}
            exerciseKey={exerciseKey}
            onCorrect={handleCorrect}
          />
        )
      }
    }

    if (section === 'moyenne') {
      if (subject === 'colors') {
        return <MoyenneColorsExercise key={exerciseKey} section={section} onCorrect={handleCorrect} />
      }
      if (subject === 'shapes') {
        return <MoyenneShapesExercise key={exerciseKey} section={section} onCorrect={handleCorrect} />
      }
      if (subject === 'counting') {
        return <MoyenneCountExercise key={exerciseKey} section={section} onCorrect={handleCorrect} />
      }
      if (subject === 'puzzles') {
        return (
          <PuzzleExercise
            key={exerciseKey}
            section={section}
            exerciseKey={exerciseKey}
            onCorrect={handleCorrect}
          />
        )
      }
      if (subject === 'patterns') {
        return <PatternExercise key={exerciseKey} section={section} onCorrect={handleCorrect} />
      }
    }

    if (section === 'grande') {
      if (subject === 'letters') {
        return <GrandeLettersExercise key={exerciseKey} section={section} onCorrect={handleCorrect} />
      }
      if (subject === 'sounds') {
        return <GrandeSoundsExercise key={exerciseKey} section={section} onCorrect={handleCorrect} />
      }
      if (subject === 'counting') {
        return <GrandeCountExercise key={exerciseKey} section={section} onCorrect={handleCorrect} />
      }
      if (subject === 'puzzles') {
        return (
          <PuzzleExercise
            key={exerciseKey}
            section={section}
            exerciseKey={exerciseKey}
            onCorrect={handleCorrect}
          />
        )
      }
      if (subject === 'logic') {
        return <GrandeLogicExercise key={exerciseKey} section={section} onCorrect={handleCorrect} />
      }
    }

    return null
  }

  return (
    <main
      className={`screen screen-maternelle-section flex h-full min-h-0 w-full max-w-full flex-col overflow-x-hidden ${
        isPuzzle ? 'screen-maternelle-section--puzzle overflow-hidden pb-1' : 'overflow-y-auto pb-4'
      }`}
    >
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
            La {meta.title} arrive bientôt. Essaie la Petite ou la Moyenne Section !
          </p>
        </div>
      ) : (
        <>
          <SubjectTabs
            tabs={meta.tabs}
            active={subject}
            onSelect={handleSubject}
            variant={tabVariant}
          />

          {activeTest ? (
            <div className="test-banner mx-3.5 mt-2 shrink-0">
              Petit test — Question {Math.min(activeTest.index + 1, activeTest.length)} /{' '}
              {activeTest.length}
            </div>
          ) : null}

          {canStartTest ? (
            <button type="button" onClick={handleStartTest} className="test-start-btn mx-3.5 mt-2 shrink-0">
              📝 Petit test (5 questions)
            </button>
          ) : null}

          <div
            className={
              isPuzzle
                ? 'exercise-area exercise-area--puzzle flex min-h-0 flex-1 flex-col overflow-hidden'
                : 'exercise-area flex flex-1 flex-col gap-3 overflow-y-auto px-3.5 pb-1 pt-3.5'
            }
          >
            {renderExercise()}
          </div>
        </>
      )}

      {!isPuzzle ? (
        <button
          type="button"
          onPointerUp={() => switchScreen(SCREENS.LEVEL_SELECT)}
          className="close-btn mx-4 mb-3 mt-2 shrink-0 cursor-pointer rounded-[18px] border-none px-6 py-3 font-sans text-[0.95rem] font-extrabold text-white transition-transform duration-100 active:translate-y-[3px]"
        >
          ← Retour
        </button>
      ) : null}
    </main>
  )
}
