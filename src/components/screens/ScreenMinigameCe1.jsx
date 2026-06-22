import { useEffect, useRef, useState } from 'react'
import ScreenTitle from './ScreenTitle'
import SubjectTabs from '../minigames/SubjectTabs'
import MathExercise from '../minigames/MathExercise'
import DicteeExercise from '../minigames/DicteeExercise'
import LectureExercise from '../minigames/LectureExercise'
import CpTestResult from '../minigames/CpTestResult'
import { getExercises } from '../../data/exercises'
import { SCREENS, useGame } from '../../context/GameContext'
import {
  CE1_SUBJECT_LABELS,
  CE1_TESTABLE_SUBJECTS,
  CE1_UI_SUBJECT_MAP,
  getCe1UnlockedDifficulty,
  recordCe1Success,
} from '../../utils/ce1Progress'

const CE1_TABS = [
  { id: 'math', label: '➕ Maths' },
  { id: 'dictee', label: '🔤 Dictée' },
  { id: 'lecture', label: '📖 Lecture' },
]

function countCe1Pool(subject, maxDifficulty) {
  return getExercises('ce1', subject).filter((item) => (item.difficulty ?? 1) <= maxDifficulty).length
}

export default function ScreenMinigameCe1() {
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

  const subject = gameState.currentSubject.ce1 ?? 'math'
  const progressSubject = CE1_UI_SUBJECT_MAP[subject] ?? subject
  const level = getCe1UnlockedDifficulty(gameState.learningProgress, progressSubject)
  const levelLabel = CE1_SUBJECT_LABELS[progressSubject] ?? 'CE1'
  const activeTest = gameState.achievements?.tests?.activeTest
  const isCe1TestActive = activeTest?.level === 'ce1'
  const poolSize = countCe1Pool(progressSubject, level)
  const canStartTest = CE1_TESTABLE_SUBJECTS.has(progressSubject) && !activeTest && poolSize > 0

  useEffect(() => {
    setExerciseContext({ level: 'ce1', section: null, subject })
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
      if (latest?.level === 'ce1' && latest.subject === progressSubject) {
        setTestResult(latest)
      }
    }
    historyLenRef.current = history.length
  }, [gameState.achievements?.tests?.history, progressSubject])

  const handleSubject = (sub) => {
    if (isCe1TestActive) {
      cancelTest()
      showToast('Test arrêté', '#8d6e3a')
    }
    setTestResult(null)
    setSubject('ce1', sub)
    setExerciseKey((k) => k + 1)
  }

  const handleCorrect = () => {
    recordCe1Success(setGameState, progressSubject)
    if (!isCe1TestActive) {
      setTimeout(() => setExerciseKey((k) => k + 1), 1800)
    }
  }

  const handleStartTest = () => {
    if (poolSize === 0) {
      showToast("Pas assez d'exercices pour un test", '#8d6e3a')
      return
    }
    setTestResult(null)
    startTest({ level: 'ce1', section: null, subject: progressSubject, length: 5 })
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
    <main className="screen screen-minigame-cp flex h-full min-h-0 w-full max-w-full flex-col overflow-y-auto overflow-x-hidden pb-4">
      <ScreenTitle>✏️ CE1 — École</ScreenTitle>

      <SubjectTabs tabs={CE1_TABS} active={subject} onSelect={handleSubject} />

      <p className="cp-level-badge mx-3.5 mt-2 shrink-0 text-center">
        {levelLabel} — Niveau {level}
      </p>

      {isCe1TestActive ? (
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

      <div className="exercise-area flex flex-1 flex-col gap-3 overflow-y-auto px-3.5 pb-1 pt-3.5">
        {testResult && !isCe1TestActive ? (
          <CpTestResult
            result={testResult}
            subjectLabel={levelLabel}
            onReplay={handleReplayTest}
            onBack={handleBackFromResult}
          />
        ) : (
          <>
            {subject === 'math' && (
              <MathExercise key={exerciseKey} exerciseKey={exerciseKey} level="ce1" onCorrect={handleCorrect} />
            )}
            {subject === 'dictee' && (
              <DicteeExercise key={exerciseKey} exerciseKey={exerciseKey} level="ce1" onCorrect={handleCorrect} />
            )}
            {subject === 'lecture' && (
              <LectureExercise key={exerciseKey} exerciseKey={exerciseKey} level="ce1" onCorrect={handleCorrect} />
            )}
          </>
        )}
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
