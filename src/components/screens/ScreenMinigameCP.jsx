import { useEffect, useRef, useState } from 'react'
import ScreenTitle from './ScreenTitle'
import SubjectTabs from '../minigames/SubjectTabs'
import MathExercise from '../minigames/MathExercise'
import DicteeExercise from '../minigames/DicteeExercise'
import LectureExercise from '../minigames/LectureExercise'
import ClockExercise from '../minigames/ClockExercise'
import ScienceExercise from '../minigames/ScienceExercise'
import CpTestResult from '../minigames/CpTestResult'
import { getExercises } from '../../data/exercises'
import { SCREENS, useGame } from '../../context/GameContext'
import {
  CP_SUBJECT_LABELS,
  CP_TESTABLE_SUBJECTS,
  CP_UI_SUBJECT_MAP,
  getCpUnlockedDifficulty,
  recordCpSuccess,
} from '../../utils/cpProgress'

const CP_TABS = [
  { id: 'math', label: '➕ Maths' },
  { id: 'dictee', label: '🔤 Dictée' },
  { id: 'lecture', label: '📖 Lecture' },
  { id: 'heure', label: '⏰ Heure' },
  { id: 'sciences', label: '🔬 Sciences' },
]

function countCpPool(subject, maxDifficulty) {
  return getExercises('cp', subject).filter((item) => (item.difficulty ?? 1) <= maxDifficulty).length
}

export default function ScreenMinigameCP() {
  const {
    gameState,
    setSubject,
    switchScreen,
    setExerciseContext,
    setGameState,
    registerExerciseAdvance,
    startTest,
    cancelTest,
    showToast,
  } = useGame()
  const [exerciseKey, setExerciseKey] = useState(0)
  const [testResult, setTestResult] = useState(null)
  const historyLenRef = useRef(gameState.achievements?.tests?.history?.length ?? 0)

  const subject = gameState.currentSubject.cp
  const progressSubject = CP_UI_SUBJECT_MAP[subject] ?? subject
  const level = getCpUnlockedDifficulty(gameState.learningProgress, progressSubject)
  const levelLabel = CP_SUBJECT_LABELS[progressSubject] ?? 'CP'
  const activeTest = gameState.achievements?.tests?.activeTest
  const isCpTestActive = activeTest?.level === 'cp'
  const poolSize = countCpPool(progressSubject, level)
  const canStartTest = CP_TESTABLE_SUBJECTS.has(progressSubject) && !activeTest && poolSize > 0

  useEffect(() => {
    setExerciseContext({ level: 'cp', section: null, subject })
  }, [subject, setExerciseContext])

  useEffect(() => {
    registerExerciseAdvance(() => {
      setExerciseKey((k) => k + 1)
    })
    return () => registerExerciseAdvance(null)
  }, [registerExerciseAdvance])

  useEffect(() => {
    return () => cancelTest()
  }, [cancelTest])

  useEffect(() => {
    const history = gameState.achievements?.tests?.history ?? []
    if (history.length > historyLenRef.current) {
      const latest = history[history.length - 1]
      if (latest?.level === 'cp' && latest.subject === progressSubject) {
        setTestResult(latest)
      }
    }
    historyLenRef.current = history.length
  }, [gameState.achievements?.tests?.history, progressSubject])

  const handleSubject = (sub) => {
    if (isCpTestActive) {
      cancelTest()
      showToast('Test arrêté', '#8d6e3a')
    }
    setTestResult(null)
    setSubject('cp', sub)
    setExerciseKey((k) => k + 1)
  }

  const handleCorrect = () => {
    recordCpSuccess(setGameState, progressSubject)
    if (!isCpTestActive) {
      setTimeout(() => setExerciseKey((k) => k + 1), 1800)
    }
  }

  const handleStartTest = () => {
    if (poolSize === 0) {
      showToast("Pas assez d'exercices pour un test", '#8d6e3a')
      return
    }
    setTestResult(null)
    startTest({ level: 'cp', section: null, subject: progressSubject, length: 5 })
    setExerciseKey((k) => k + 1)
    showToast('Petit test : 5 questions !', '#7c4dff')
  }

  const handleReplayTest = () => {
    setTestResult(null)
    handleStartTest()
  }

  const handleBackFromResult = () => {
    setTestResult(null)
  }

  return (
    <main className="screen screen-minigame-cp flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden overflow-x-hidden pb-4">
      <ScreenTitle>✏️ CP — École</ScreenTitle>

      <SubjectTabs tabs={CP_TABS} active={subject} onSelect={handleSubject} />

      <p className="cp-level-badge mx-3.5 mt-2 shrink-0 text-center">
        {levelLabel} — Niveau {level}
      </p>

      {isCpTestActive ? (
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

      <div className="exercise-area flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto px-3.5 pb-1 pt-3.5">
        {testResult && !isCpTestActive ? (
          <CpTestResult
            result={testResult}
            subjectLabel={levelLabel}
            onReplay={handleReplayTest}
            onBack={handleBackFromResult}
          />
        ) : (
          <>
            {subject === 'math' && (
              <MathExercise key={exerciseKey} exerciseKey={exerciseKey} onCorrect={handleCorrect} />
            )}
            {subject === 'dictee' && (
              <DicteeExercise key={exerciseKey} exerciseKey={exerciseKey} onCorrect={handleCorrect} />
            )}
            {subject === 'lecture' && (
              <LectureExercise key={exerciseKey} exerciseKey={exerciseKey} onCorrect={handleCorrect} />
            )}
            {subject === 'heure' && (
              <ClockExercise key={exerciseKey} exerciseKey={exerciseKey} onCorrect={handleCorrect} />
            )}
            {subject === 'sciences' && (
              <ScienceExercise key={exerciseKey} exerciseKey={exerciseKey} onCorrect={handleCorrect} />
            )}
          </>
        )}
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
