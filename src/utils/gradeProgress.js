// Progression générique pour les niveaux primaires "grade" (cm1, cm2…).
// Même règles que CP/CE1/CE2 : 3 niveaux, 5 bonnes réponses pour monter.
export const GRADE_SUBJECTS = ['dictee', 'lecture', 'maths']

export const GRADE_UI_SUBJECT_MAP = { dictee: 'dictee', lecture: 'lecture', math: 'maths' }
export const GRADE_SUBJECT_LABELS = { dictee: 'Dictée', lecture: 'Lecture', maths: 'Maths' }
export const GRADE_TESTABLE_SUBJECTS = new Set(GRADE_SUBJECTS)

export const CORRECTS_TO_UNLOCK_GRADE = 5
export const MAX_GRADE_DIFFICULTY = 3

export function createGradeActivityProgress() {
  return { unlockedDifficulty: 1, correctAnswers: 0 }
}

export function createDefaultGradeProgress() {
  return Object.fromEntries(GRADE_SUBJECTS.map((k) => [k, createGradeActivityProgress()]))
}

export function getGradeUnlockedDifficulty(learningProgress, level, subject) {
  return learningProgress?.[level]?.[subject]?.unlockedDifficulty ?? 1
}

export function getGradeActivityProgress(learningProgress, level, subject) {
  return learningProgress?.[level]?.[subject] ?? createGradeActivityProgress()
}

export function recordGradeSuccess(setGameState, level, subject) {
  if (!GRADE_SUBJECTS.includes(subject)) return
  setGameState((prev) => {
    const base = prev.learningProgress ?? {}
    const data = { ...(base[level] ?? createDefaultGradeProgress()) }
    const current = data[subject] ?? createGradeActivityProgress()
    const next = current.correctAnswers + 1
    data[subject] =
      next >= CORRECTS_TO_UNLOCK_GRADE && current.unlockedDifficulty < MAX_GRADE_DIFFICULTY
        ? { unlockedDifficulty: current.unlockedDifficulty + 1, correctAnswers: 0 }
        : { unlockedDifficulty: current.unlockedDifficulty, correctAnswers: next }
    return { ...prev, learningProgress: { ...base, [level]: data } }
  })
}

export function formatGradeTestHistoryEntry(test, levelLabel) {
  const label = GRADE_SUBJECT_LABELS[test.subject] ?? test.subject
  return `${label} ${levelLabel} — ${test.score}/${test.length}`
}
