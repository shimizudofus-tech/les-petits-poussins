// Progression CE2 — calquée sur CP/CE1 (niveaux 1→3, 5 bonnes réponses pour monter).
export const CE2_SUBJECTS = ['dictee', 'lecture', 'maths']

export const CE2_UI_SUBJECT_MAP = {
  dictee: 'dictee',
  lecture: 'lecture',
  math: 'maths',
}

export const CE2_SUBJECT_LABELS = {
  dictee: 'Dictée',
  lecture: 'Lecture',
  maths: 'Maths',
}

export const CORRECTS_TO_UNLOCK_CE2 = 5
export const MAX_CE2_DIFFICULTY = 3

export function createCe2ActivityProgress() {
  return { unlockedDifficulty: 1, correctAnswers: 0 }
}

export function createDefaultCe2Progress() {
  return Object.fromEntries(CE2_SUBJECTS.map((key) => [key, createCe2ActivityProgress()]))
}

export function getCe2UnlockedDifficulty(learningProgress, subject) {
  return learningProgress?.ce2?.[subject]?.unlockedDifficulty ?? 1
}

export function getCe2ActivityProgress(learningProgress, subject) {
  return learningProgress?.ce2?.[subject] ?? createCe2ActivityProgress()
}

export function recordCe2Success(setGameState, subject) {
  if (!CE2_SUBJECTS.includes(subject)) return

  setGameState((prev) => {
    const base = prev.learningProgress ?? {}
    const ce2Data = { ...(base.ce2 ?? createDefaultCe2Progress()) }
    const current = ce2Data[subject] ?? createCe2ActivityProgress()
    const nextCorrect = current.correctAnswers + 1

    if (nextCorrect >= CORRECTS_TO_UNLOCK_CE2 && current.unlockedDifficulty < MAX_CE2_DIFFICULTY) {
      ce2Data[subject] = { unlockedDifficulty: current.unlockedDifficulty + 1, correctAnswers: 0 }
    } else {
      ce2Data[subject] = { unlockedDifficulty: current.unlockedDifficulty, correctAnswers: nextCorrect }
    }

    return { ...prev, learningProgress: { ...base, ce2: ce2Data } }
  })
}

export const CE2_TESTABLE_SUBJECTS = new Set(CE2_SUBJECTS)

export function formatCe2TestHistoryEntry(test) {
  const label = CE2_SUBJECT_LABELS[test.subject] ?? test.subject
  return `${label} CE2 — ${test.score}/${test.length}`
}
