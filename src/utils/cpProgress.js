export const CP_SUBJECTS = ['dictee', 'lecture', 'maths']

export const CP_UI_SUBJECT_MAP = {
  dictee: 'dictee',
  lecture: 'lecture',
  math: 'maths',
}

export const CP_SUBJECT_LABELS = {
  dictee: 'Dictée',
  lecture: 'Lecture',
  maths: 'Maths',
}

export const CORRECTS_TO_UNLOCK_CP = 5

export const MAX_CP_DIFFICULTY = 3

export function createCpActivityProgress() {
  return { unlockedDifficulty: 1, correctAnswers: 0 }
}

export function createDefaultCpProgress() {
  return Object.fromEntries(CP_SUBJECTS.map((key) => [key, createCpActivityProgress()]))
}

export function getCpUnlockedDifficulty(learningProgress, subject) {
  return learningProgress?.cp?.[subject]?.unlockedDifficulty ?? 1
}

export function getCpActivityProgress(learningProgress, subject) {
  return learningProgress?.cp?.[subject] ?? createCpActivityProgress()
}

export function recordCpSuccess(setGameState, subject) {
  if (!CP_SUBJECTS.includes(subject)) return

  setGameState((prev) => {
    const base = prev.learningProgress ?? {}
    const cpData = { ...(base.cp ?? createDefaultCpProgress()) }
    const current = cpData[subject] ?? createCpActivityProgress()
    const nextCorrect = current.correctAnswers + 1

    if (nextCorrect >= CORRECTS_TO_UNLOCK_CP && current.unlockedDifficulty < MAX_CP_DIFFICULTY) {
      cpData[subject] = {
        unlockedDifficulty: current.unlockedDifficulty + 1,
        correctAnswers: 0,
      }
    } else {
      cpData[subject] = {
        unlockedDifficulty: current.unlockedDifficulty,
        correctAnswers: nextCorrect,
      }
    }

    return {
      ...prev,
      learningProgress: {
        ...base,
        cp: cpData,
      },
    }
  })
}
