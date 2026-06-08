import { exercisesByLevel, getExercises } from '../data/exercises'

export const PARENT_RETURN_SESSION_KEY = 'les-petits-poussins-parent-return'

const AUDIO_PATH_PREFIX = 'src/assets/audio/voix'

function collectAllExercises() {
  const all = []
  for (const subjects of Object.values(exercisesByLevel)) {
    for (const list of Object.values(subjects)) {
      all.push(...list)
    }
  }
  return all
}

export function getExerciseContentStats() {
  return {
    dictee: getExercises('cp', 'dictee').length,
    lecture: getExercises('cp', 'lecture').length,
    maths: getExercises('cp', 'maths').length,
    colors: getExercises('maternelle', 'colors').length,
    shapes: getExercises('maternelle', 'shapes').length,
    counting: getExercises('maternelle', 'counting').length,
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
