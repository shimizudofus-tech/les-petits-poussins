import { maternelleColorExercises } from './maternelle/colors'
import { maternelleShapeExercises } from './maternelle/shapes'
import { maternelleCountingExercises } from './maternelle/counting'
import { petiteColoringExercises } from './maternelle/petite/coloring'
import { petiteColorRecognitionExercises } from './maternelle/petite/colors'
import { petiteShapeExercises } from './maternelle/petite/shapes'
import { petiteCountingExercises } from './maternelle/petite/counting'
import { petitePuzzleExercises, petiteLegacyPuzzleExercises } from './maternelle/petite/puzzles'
import { moyenneColorExercises } from './maternelle/moyenne/colors'
import { moyenneShapeExercises } from './maternelle/moyenne/shapes'
import { moyenneCountingExercises } from './maternelle/moyenne/counting'
import { moyennePuzzleExercises, moyenneLegacyPuzzleExercises } from './maternelle/moyenne/puzzles'
import { moyennePatternExercises } from './maternelle/moyenne/patterns'
import { grandeLetterExercises } from './maternelle/grande/letters'
import { grandeSoundExercises } from './maternelle/grande/sounds'
import { grandeCountingExercises } from './maternelle/grande/counting'
import { grandePuzzleExercises, grandeLegacyPuzzleExercises } from './maternelle/grande/puzzles'
import { grandeLogicExercises } from './maternelle/grande/logic'
import { cpMathExercises } from './cp/maths'
import { cpDicteeExercises } from './cp/dictee'
import { cpLectureExercises } from './cp/lecture'
import { ce1MathExercises } from './ce1/maths'
import { ce1DicteeExercises } from './ce1/dictee'
import { ce1LectureExercises } from './ce1/lecture'
import { ce2MathExercises } from './ce2/maths'
import { ce2DicteeExercises } from './ce2/dictee'
import { ce2LectureExercises } from './ce2/lecture'
import { cm1MathExercises } from './cm1/maths'
import { cm1DicteeExercises } from './cm1/dictee'
import { cm1LectureExercises } from './cm1/lecture'
import { cm2MathExercises } from './cm2/maths'
import { cm2DicteeExercises } from './cm2/dictee'
import { cm2LectureExercises } from './cm2/lecture'

const maternellePetiteExercises = {
  coloring: petiteColoringExercises,
  colors: petiteColorRecognitionExercises,
  shapes: petiteShapeExercises,
  counting: petiteCountingExercises,
  puzzles: petitePuzzleExercises,
}

const maternelleMoyenneExercises = {
  colors: moyenneColorExercises,
  shapes: moyenneShapeExercises,
  counting: moyenneCountingExercises,
  puzzles: moyennePuzzleExercises,
  patterns: moyennePatternExercises,
}

const maternelleGrandeExercises = {
  letters: grandeLetterExercises,
  sounds: grandeSoundExercises,
  counting: grandeCountingExercises,
  puzzles: grandePuzzleExercises,
  logic: grandeLogicExercises,
}

/** @deprecated Ancien bloc Maternelle plat — conservé pour compatibilité */
export const exercisesByLevel = {
  maternelle: {
    colors: maternelleColorExercises,
    shapes: maternelleShapeExercises,
    counting: maternelleCountingExercises,
    petite: maternellePetiteExercises,
    moyenne: maternelleMoyenneExercises,
    grande: maternelleGrandeExercises,
  },
  cp: {
    maths: cpMathExercises,
    dictee: cpDicteeExercises,
    lecture: cpLectureExercises,
  },
  ce1: {
    maths: ce1MathExercises,
    dictee: ce1DicteeExercises,
    lecture: ce1LectureExercises,
  },
  ce2: {
    maths: ce2MathExercises,
    dictee: ce2DicteeExercises,
    lecture: ce2LectureExercises,
  },
  cm1: {
    maths: cm1MathExercises,
    dictee: cm1DicteeExercises,
    lecture: cm1LectureExercises,
  },
  cm2: {
    maths: cm2MathExercises,
    dictee: cm2DicteeExercises,
    lecture: cm2LectureExercises,
  },
}

export function getMaternelleExercises(section, subject) {
  const sectionData = exercisesByLevel.maternelle?.[section]
  if (!sectionData || Array.isArray(sectionData)) return []
  return sectionData[subject] ?? []
}

export function getLegacyPuzzleExercises(section) {
  const legacyBySection = {
    petite: petiteLegacyPuzzleExercises,
    moyenne: moyenneLegacyPuzzleExercises,
    grande: grandeLegacyPuzzleExercises,
  }
  return legacyBySection[section] ?? []
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

export function pickCpExercise(subject, maxDifficulty = 3) {
  const list = getExercises('cp', subject).filter(
    (item) => (item.difficulty ?? 1) <= maxDifficulty,
  )
  if (!list.length) {
    console.warn(`[exercises] Aucun exercice cp/${subject} (diff ≤ ${maxDifficulty})`)
    return null
  }
  return list[Math.floor(Math.random() * list.length)]
}

// Picker générique par niveau primaire (cp, ce1, …)
export function pickGradeExercise(level, subject, maxDifficulty = 3) {
  const list = getExercises(level, subject).filter(
    (item) => (item.difficulty ?? 1) <= maxDifficulty,
  )
  if (!list.length) {
    console.warn(`[exercises] Aucun exercice ${level}/${subject} (diff ≤ ${maxDifficulty})`)
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
  maternelleMoyenneExercises,
  moyenneColorExercises,
  moyenneShapeExercises,
  moyenneCountingExercises,
  moyennePuzzleExercises,
  moyennePatternExercises,
  maternelleGrandeExercises,
  grandeLetterExercises,
  grandeSoundExercises,
  grandeCountingExercises,
  grandePuzzleExercises,
  grandeLogicExercises,
  cpMathExercises,
  cpDicteeExercises,
  cpLectureExercises,
}
