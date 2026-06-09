export const MATERNELLE_SECTIONS = ['petite', 'moyenne', 'grande']

export const PETITE_ACTIVITIES = ['coloring', 'colors', 'shapes', 'counting', 'puzzles']

export const MOYENNE_ACTIVITIES = ['colors', 'shapes', 'counting', 'puzzles', 'patterns']

export const SECTION_ACTIVITIES = {
  petite: PETITE_ACTIVITIES,
  moyenne: MOYENNE_ACTIVITIES,
}

export const CORRECTS_TO_UNLOCK = 5

export const MAX_MATERNELLE_DIFFICULTY = 3

export function createActivityProgress() {
  return { unlockedDifficulty: 1, correctAnswers: 0 }
}

export function createSectionProgress(activities) {
  return Object.fromEntries(activities.map((key) => [key, createActivityProgress()]))
}

export function createDefaultLearningProgress() {
  return {
    maternelle: {
      petite: createSectionProgress(PETITE_ACTIVITIES),
      moyenne: createSectionProgress(MOYENNE_ACTIVITIES),
    },
  }
}

export function getUnlockedDifficulty(learningProgress, section, activity) {
  return (
    learningProgress?.maternelle?.[section]?.[activity]?.unlockedDifficulty ?? 1
  )
}

export function recordMaternelleSuccess(setGameState, section, activity) {
  setGameState((prev) => {
    const base = prev.learningProgress ?? createDefaultLearningProgress()
    const sectionData = { ...base.maternelle?.[section] }
    const current = sectionData[activity] ?? createActivityProgress()
    const nextCorrect = current.correctAnswers + 1

    if (nextCorrect >= CORRECTS_TO_UNLOCK && current.unlockedDifficulty < MAX_MATERNELLE_DIFFICULTY) {
      sectionData[activity] = {
        unlockedDifficulty: current.unlockedDifficulty + 1,
        correctAnswers: 0,
      }
    } else {
      sectionData[activity] = {
        unlockedDifficulty: current.unlockedDifficulty,
        correctAnswers: nextCorrect,
      }
    }

    return {
      ...prev,
      learningProgress: {
        ...base,
        maternelle: {
          ...base.maternelle,
          [section]: sectionData,
        },
      },
    }
  })
}
