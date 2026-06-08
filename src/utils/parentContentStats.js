import { exercisesByLevel, getExercises, getMaternelleExercises } from '../data/exercises'

export const PARENT_RETURN_SESSION_KEY = 'les-petits-poussins-parent-return'

const AUDIO_PATH_PREFIX = 'src/assets/audio/voix'

function collectAllExercises() {
  const all = []
  for (const subjects of Object.values(exercisesByLevel)) {
    for (const [key, value] of Object.entries(subjects)) {
      if (key === 'petite' && value && typeof value === 'object') {
        for (const petiteList of Object.values(value)) {
          if (Array.isArray(petiteList)) all.push(...petiteList)
        }
      } else if (Array.isArray(value)) {
        all.push(...value)
      }
    }
  }
  return all
}

export function getMaternellePetiteStats() {
  return {
    coloring: getMaternelleExercises('petite', 'coloring').length,
    colors: getMaternelleExercises('petite', 'colors').length,
    shapes: getMaternelleExercises('petite', 'shapes').length,
    counting: getMaternelleExercises('petite', 'counting').length,
    puzzles: getMaternelleExercises('petite', 'puzzles').length,
  }
}

export function getExerciseContentStats() {
  const petite = getMaternellePetiteStats()
  return {
    dictee: getExercises('cp', 'dictee').length,
    lecture: getExercises('cp', 'lecture').length,
    maths: getExercises('cp', 'maths').length,
    colors: petite.colors,
    shapes: petite.shapes,
    counting: petite.counting,
    petite,
  }
}

export function getExpectedAudioFiles() {
  const keys = new Set()
  for (const exercise of collectAllExercises()) {
    if (exercise.audioKey) {
      keys.add(String(exercise.audioKey).toLowerCase().trim())
    }
  }

  return [...keys].sort().map((audioKey) => ({
    audioKey,
    path: `${AUDIO_PATH_PREFIX}/${audioKey}.mp3`,
  }))
}

export function getUsedImageKeys() {
  const keys = new Set()
  for (const exercise of collectAllExercises()) {
    if (exercise.imageKey) {
      keys.add(String(exercise.imageKey).toLowerCase().trim())
    }
  }
  return [...keys].sort()
}
