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
  GRADE_SUBJECT_LABELS,
  GRADE_TESTABLE_SUBJECTS,
  GRADE_UI_SUBJECT_MAP,
  getGradeUnlockedDifficulty,
  recordGradeSuccess,
} from '../../utils/gradeProgress'

const TABS = [
  { id: 'math', label: '➕ Maths' },
  { id: 'dictee', label: '🔤 Dictée' },
  { id: 'lecture', label: '📖 Lecture' },
]

function countPool(level, subject, maxDifficulty) {
  return getExercises(level, subject).filter((item) => (item.difficulty ?? 1) <= maxDifficulty).length
}

// Écran d'exercices générique pour un niveau primaire (level: 'cm1' | 'cm2' | …).
export default function ScreenMinigameGrade({ level, levelLabel, title }) {
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

  const subject = gameState.currentSubject?.[level] ?? 'math'
  const progressSubject = GRADE_UI_SUBJECT_MAP[subject] ?? subject
  const difficulty = getGradeUnlockedDifficulty(gameState.learningProgress, level, progressSubject)
  const subjectLabel = GRADE_SUBJECT_LABELS[progressSubject] ?? levelLabel
  const activeTest = gameState.achievements?.tests?.activeTest
  const isTestActive = activeTest?.level === level
  const poolSize = countPool(level, progressSubject, difficulty)
  const canStartTest = GRADE_TESTABLE_SUBJECTS.has(progressSubject) && !activeTest && poolSize > 0

  useEffect(() => {
    setExerciseContext({ level, section: null, subject })
  }, [subject, level, setExerciseContext])

  useEffect(() => {
    registerExerciseAdvance(() => setExerciseKey((k) => k + 1))
    return () => registerExerciseAdvance(null)
  }, [registerExerciseAdvance])

  useEffect(() => () => cancelTest(), [cancelTest])

  useEffect(() => {
    const history = gameState.achievements?.tests?.history ?? []
    if (history.length > historyLenRef.current) {
      const latest = history[history.length - 1]
      if (latest?.level === level && latest.subject === progressSubject) setTestResult(latest)
    }
    historyLenRef.current = history.length
  }, [gameState.achievements?.tests?.history, progressSubject, level])

  const handleSubject = (sub) => {
    if (isTestActive) {
      cancelTest()
      showToast('Test arrêté', '#8d6e3a')
    }
    setTestResult(null)
    setSubject(level, sub)
    setExerciseKey((k) => k + 1)
  }

  const handleCorrect = () => {
    recordGradeSuccess(setGameState, level, progressSubject)
    if (!isTestActive) setTimeout(() => setExerciseKey((k) => k + 1), 1800)
  }

  const handleStartTest = () => {
    if (poolSize === 0) {
      showToast("Pas assez d'exercices pour un test", '#8d6e3a')
      return
    }
    setTestResult(null)
    startTest({ level, section: null, subject: progressSubject, length: 5 })
    setExerciseKey((k) => k + 1)
    showToast('Petit test : 5 questions !', '#7c4dff')
  }

  const handleReplayTest = () => {
    setTestResult(null)
    handleStartTest()
  }

  return (
    <main className="screen screen-minigame-cp flex h-full min-h-0 w-full max-w-full flex-col overflow-y-auto overflow-x-hidden pb-4">
      <ScreenTitle>{title}</ScreenTitle>

      <SubjectTabs tabs={TABS} active={subject} onSelect={handleSubject} />

      <p className="cp-level-badge mx-3.5 mt-2 shrink-0 text-center">
        {subjectLabel} — Niveau {difficulty}
      </p>

      {isTestActive ? (
        <div className="test-banner mx-3.5 mt-2 shrink-0">
          Petit test — Question {Math.min(activeTest.index + 1, activeTest.length)} / {activeTest.length}
        </div>
      ) : null}

      {canStartTest ? (
        <button type="button" onClick={handleStartTest} className="test-start-btn mx-3.5 mt-2 shrink-0">
          📝 Petit test (5 questions)
        </button>
      ) : null}

      <div className="exercise-area flex flex-1 flex-col gap-3 overflow-y-auto px-3.5 pb-1 pt-3.5">
        {testResult && !isTestActive ? (
          <CpTestResult result={testResult} subjectLabel={subjectLabel} onReplay={handleReplayTest} onBack={() => setTestResult(null)} />
        ) : (
          <>
            {subject === 'math' && <MathExercise key={exerciseKey} exerciseKey={exerciseKey} level={level} onCorrect={handleCorrect} />}
            {subject === 'dictee' && <DicteeExercise key={exerciseKey} exerciseKey={exerciseKey} level={level} onCorrect={handleCorrect} />}
            {subject === 'lecture' && <LectureExercise key={exerciseKey} exerciseKey={exerciseKey} level={level} onCorrect={handleCorrect} />}
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
