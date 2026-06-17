// Progression CE1 — calquée sur le CP (niveaux 1→3, 5 bonnes réponses pour monter).
export const CE1_SUBJECTS = ['dictee', 'lecture', 'maths']

export const CE1_UI_SUBJECT_MAP = {
  dictee: 'dictee',
  lecture: 'lecture',
  math: 'maths',
}

export const CE1_SUBJECT_LABELS = {
  dictee: 'Dictée',
  lecture: 'Lecture',
  maths: 'Maths',
}

export const CORRECTS_TO_UNLOCK_CE1 = 5
export const MAX_CE1_DIFFICULTY = 3

export function createCe1ActivityProgress() {
  return { unlockedDifficulty: 1, correctAnswers: 0 }
}

export function createDefaultCe1Progress() {
  return Object.fromEntries(CE1_SUBJECTS.map((key) => [key, createCe1ActivityProgress()]))
}

export function getCe1UnlockedDifficulty(learningProgress, subject) {
  return learningProgress?.ce1?.[subject]?.unlockedDifficulty ?? 1
}

export function getCe1ActivityProgress(learningProgress, subject) {
  return learningProgress?.ce1?.[subject] ?? createCe1ActivityProgress()
}

export function recordCe1Success(setGameState, subject) {
  if (!CE1_SUBJECTS.includes(subject)) return

  setGameState((prev) => {
    const base = prev.learningProgress ?? {}
    const ce1Data = { ...(base.ce1 ?? createDefaultCe1Progress()) }
    const current = ce1Data[subject] ?? createCe1ActivityProgress()
    const nextCorrect = current.correctAnswers + 1

    if (nextCorrect >= CORRECTS_TO_UNLOCK_CE1 && current.unlockedDifficulty < MAX_CE1_DIFFICULTY) {
      ce1Data[subject] = { unlockedDifficulty: current.unlockedDifficulty + 1, correctAnswers: 0 }
    } else {
      ce1Data[subject] = { unlockedDifficulty: current.unlockedDifficulty, correctAnswers: nextCorrect }
    }

    return { ...prev, learningProgress: { ...base, ce1: ce1Data } }
  })
}

export const CE1_TESTABLE_SUBJECTS = new Set(CE1_SUBJECTS)

export function formatCe1TestHistoryEntry(test) {
  const label = CE1_SUBJECT_LABELS[test.subject] ?? test.subject
  return `${label} CE1 — ${test.score}/${test.length}`
}
