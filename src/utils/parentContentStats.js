import { exercisesByLevel, getExercises, getMaternelleExercises } from '../data/exercises'

export const PARENT_RETURN_SESSION_KEY = 'les-petits-poussins-parent-return'

const AUDIO_PATH_PREFIX = 'src/assets/audio/voix'

const SECTION_KEYS = ['petite', 'moyenne', 'grande']

function collectAllExercises() {
  const all = []
  for (const subjects of Object.values(exercisesByLevel)) {
    for (const [key, value] of Object.entries(subjects)) {
      if (SECTION_KEYS.includes(key) && value && typeof value === 'object') {
        for (const sectionList of Object.values(value)) {
          if (Array.isArray(sectionList)) all.push(...sectionList)
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

export function getMaternelleMoyenneStats() {
  return {
    colors: getMaternelleExercises('moyenne', 'colors').length,
    shapes: getMaternelleExercises('moyenne', 'shapes').length,
    counting: getMaternelleExercises('moyenne', 'counting').length,
    puzzles: getMaternelleExercises('moyenne', 'puzzles').length,
    patterns: getMaternelleExercises('moyenne', 'patterns').length,
  }
}

export function getMaternelleGrandeStats() {
  return {
    letters: getMaternelleExercises('grande', 'letters').length,
    sounds: getMaternelleExercises('grande', 'sounds').length,
    counting: getMaternelleExercises('grande', 'counting').length,
    puzzles: getMaternelleExercises('grande', 'puzzles').length,
    logic: getMaternelleExercises('grande', 'logic').length,
  }
}

export function getExerciseContentStats() {
  const petite = getMaternellePetiteStats()
  const moyenne = getMaternelleMoyenneStats()
  const grande = getMaternelleGrandeStats()
  return {
    dictee: getExercises('cp', 'dictee').length,
    lecture: getExercises('cp', 'lecture').length,
    maths: getExercises('cp', 'maths').length,
    colors: petite.colors,
    shapes: petite.shapes,
    counting: petite.counting,
    petite,
    moyenne,
    grande,
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
