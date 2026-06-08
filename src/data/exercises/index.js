import { maternelleColorExercises } from './maternelle/colors'
import { maternelleShapeExercises } from './maternelle/shapes'
import { maternelleCountingExercises } from './maternelle/counting'
import { petiteColoringExercises } from './maternelle/petite/coloring'
import { petiteColorRecognitionExercises } from './maternelle/petite/colors'
import { petiteShapeExercises } from './maternelle/petite/shapes'
import { petiteCountingExercises } from './maternelle/petite/counting'
import { petitePuzzleExercises } from './maternelle/petite/puzzles'
import { cpMathExercises } from './cp/maths'
import { cpDicteeExercises } from './cp/dictee'
import { cpLectureExercises } from './cp/lecture'

const maternellePetiteExercises = {
  coloring: petiteColoringExercises,
  colors: petiteColorRecognitionExercises,
  shapes: petiteShapeExercises,
  counting: petiteCountingExercises,
  puzzles: petitePuzzleExercises,
}

/** @deprecated Ancien bloc Maternelle plat — conservé pour compatibilité */
export const exercisesByLevel = {
  maternelle: {
    colors: maternelleColorExercises,
    shapes: maternelleShapeExercises,
    counting: maternelleCountingExercises,
    petite: maternellePetiteExercises,
  },
  cp: {
    maths: cpMathExercises,
    dictee: cpDicteeExercises,
    lecture: cpLectureExercises,
  },
}

export function getMaternelleExercises(section, subject) {
  const sectionData = exercisesByLevel.maternelle?.[section]
  if (!sectionData || Array.isArray(sectionData)) return []
  return sectionData[subject] ?? []
}

export function getExercises(level, subject) {
  if (level === 'maternelle') {
    return exercisesByLevel.maternelle?.[subject] ?? []
  }
  return exercisesByLevel[level]?.[subject] ?? []
}

export function pickMaternelleExercise(section, subject, maxDifficulty = 3) {
  const list = getMaternelleExercises(section, subject).filter(
    (item) => (item.difficulty ?? 1) <= maxDifficulty,
  )
  if (!list.length) {
    console.warn(`[exercises] Aucun exercice maternelle/${section}/${subject} (diff ≤ ${maxDifficulty})`)
    return null
  }
  return list[Math.floor(Math.random() * list.length)]
}

export function pickRandomExercise(level, subject) {
  const list = getExercises(level, subject)
  if (!list.length) {
    console.warn(`[exercises] Aucun exercice pour ${level}/${subject}`)
    return null
  }
  return list[Math.floor(Math.random() * list.length)]
}

export {
  maternelleColorExercises,
  maternelleShapeExercises,
  maternelleCountingExercises,
  maternellePetiteExercises,
  petiteColoringExercises,
  petiteColorRecognitionExercises,
  petiteShapeExercises,
  petiteCountingExercises,
  petitePuzzleExercises,
  cpMathExercises,
  cpDicteeExercises,
  cpLectureExercises,
}
