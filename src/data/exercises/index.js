import { maternelleColorExercises } from './maternelle/colors'
import { maternelleShapeExercises } from './maternelle/shapes'
import { maternelleCountingExercises } from './maternelle/counting'
import { cpMathExercises } from './cp/maths'
import { cpDicteeExercises } from './cp/dictee'
import { cpLectureExercises } from './cp/lecture'

export const exercisesByLevel = {
  maternelle: {
    colors: maternelleColorExercises,
    shapes: maternelleShapeExercises,
    counting: maternelleCountingExercises,
  },
  cp: {
    maths: cpMathExercises,
    dictee: cpDicteeExercises,
    lecture: cpLectureExercises,
  },
}

export function getExercises(level, subject) {
  return exercisesByLevel[level]?.[subject] ?? []
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
  cpMathExercises,
  cpDicteeExercises,
  cpLectureExercises,
}
