import { resolveBuilderIcon } from '../data/builderAssets'
import { CHICKEN_STAGE_ICONS } from '../data/chickenAssets'
import { clampFarmUpgrades, DEFAULT_FARM_UPGRADES } from '../data/farmUpgrades'
import { createInitialGameState } from '../data/initialGameState'
import { mergeAudioSettings } from './audioSettings'
import { SCREENS } from '../constants/screens'
import {
  createDefaultLearningProgress,
  createSectionProgress,
  GRANDE_ACTIVITIES,
  MOYENNE_ACTIVITIES,
  PETITE_ACTIVITIES,
} from './maternelleProgress'
import { createDefaultCpProgress, CP_SUBJECTS } from './cpProgress'
import { createDefaultCe1Progress, CE1_SUBJECTS } from './ce1Progress'
import { createDefaultCe2Progress, CE2_SUBJECTS } from './ce2Progress'
import { createDefaultGradeProgress, GRADE_SUBJECTS } from './gradeProgress'
import { mergeAchievements } from './achievements'
import { ensureProfiles, getActiveStateKey } from './profiles'

export const STORAGE_KEY = 'les-petits-poussins-game-state'

function mergeCollection(savedCollection = {}) {
  const initial = createInitialGameState().collection
  const merged = Object.fromEntries(
    Object.keys(initial).map((key) => {
      const saved = savedCollection[key] ?? {}
      const currentStage = saved.currentStage ?? initial[key].currentStage
      return [
        key,
        {
          ...initial[key],
          ...saved,
          completed: saved.completed ?? currentStage === 'adult',
          stages: {
            ...initial[key].stages,
            ...(saved.stages ?? {}),
          },
        },
      ]
    }),
  )

  // Toujours utiliser les imports Vite à jour pour la poule (évite URLs cassées en localStorage)
  merged.chicken = {
    ...merged.chicken,
    stages: {
      egg: { ...merged.chicken.stages.egg, icon: CHICKEN_STAGE_ICONS.egg },
      baby: { ...merged.chicken.stages.baby, icon: CHICKEN_STAGE_ICONS.baby },
      adult: { ...merged.chicken.stages.adult, icon: CHICKEN_STAGE_ICONS.adult },
    },
  }

  return merged
}

function mergeFarmUpgrades(saved, initial) {
  const merged = { ...initial.farmUpgrades, ...saved.farmUpgrades }

  if (!saved.farmUpgrades && Array.isArray(saved.farmLayout)) {
    const placed = saved.farmLayout.filter(Boolean).length
    if (placed > 0) {
      merged.garden = Math.max(merged.garden, Math.min(3, Math.ceil(placed / 2)))
      merged.decoration = Math.max(merged.decoration, Math.min(3, Math.floor(placed / 3)))
      merged.fence = Math.max(merged.fence, Math.min(3, Math.ceil(placed / 4)))
    }
  }

  return clampFarmUpgrades(merged)
}

function mergeSectionProgress(savedSection, defaultSection, activities) {
  const merged = { ...defaultSection }
  for (const activity of activities) {
    merged[activity] = {
      ...defaultSection[activity],
      ...savedSection?.[activity],
    }
  }
  return merged
}

function mergeCpProgress(savedCp, defaultCp) {
  const merged = { ...defaultCp }
  for (const subject of CP_SUBJECTS) {
    merged[subject] = {
      ...defaultCp[subject],
      ...savedCp?.[subject],
    }
  }
  return merged
}

function mergeCe1Progress(savedCe1, defaultCe1) {
  const merged = { ...defaultCe1 }
  for (const subject of CE1_SUBJECTS) {
    merged[subject] = {
      ...defaultCe1[subject],
      ...savedCe1?.[subject],
    }
  }
  return merged
}

function mergeCe2Progress(savedCe2, defaultCe2) {
  const merged = { ...defaultCe2 }
  for (const subject of CE2_SUBJECTS) {
    merged[subject] = {
      ...defaultCe2[subject],
      ...savedCe2?.[subject],
    }
  }
  return merged
}

function mergeGradeProgress(savedGrade, defaultGrade) {
  const merged = { ...defaultGrade }
  for (const subject of GRADE_SUBJECTS) {
    merged[subject] = {
      ...defaultGrade[subject],
      ...savedGrade?.[subject],
    }
  }
  return merged
}

function mergeLearningProgress(saved, initial) {
  const base = initial.learningProgress ?? createDefaultLearningProgress()
  const savedMaternelle = saved?.maternelle ?? {}
  const defaultMoyenne =
    base.maternelle?.moyenne ?? createSectionProgress(MOYENNE_ACTIVITIES)
  const defaultGrande =
    base.maternelle?.grande ?? createSectionProgress(GRANDE_ACTIVITIES)

  return {
    ...base,
    maternelle: {
      ...base.maternelle,
      petite: mergeSectionProgress(
        savedMaternelle.petite,
        base.maternelle.petite,
        PETITE_ACTIVITIES,
      ),
      moyenne: mergeSectionProgress(savedMaternelle.moyenne, defaultMoyenne, MOYENNE_ACTIVITIES),
      grande: mergeSectionProgress(savedMaternelle.grande, defaultGrande, GRANDE_ACTIVITIES),
    },
    cp: mergeCpProgress(saved?.cp, base.cp ?? createDefaultCpProgress()),
    ce1: mergeCe1Progress(saved?.ce1, base.ce1 ?? createDefaultCe1Progress()),
    ce2: mergeCe2Progress(saved?.ce2, base.ce2 ?? createDefaultCe2Progress()),
    cm1: mergeGradeProgress(saved?.cm1, base.cm1 ?? createDefaultGradeProgress()),
    cm2: mergeGradeProgress(saved?.cm2, base.cm2 ?? createDefaultGradeProgress()),
  }
}

function mergeCurrentSubject(saved, initial) {
  const merged = { ...initial.currentSubject, ...saved.currentSubject }
  if (!merged.petite && merged.mat) {
    merged.petite = merged.mat === 'count' ? 'counting' : merged.mat
  }
  if (!merged.petite) {
    merged.petite = initial.currentSubject.petite
  }
  return merged
}

export function loadGameState() {
  try {
    ensureProfiles()
    const raw = localStorage.getItem(getActiveStateKey())
    if (!raw) return createInitialGameState()

    const saved = JSON.parse(raw)
    const initial = createInitialGameState()

    return {
      ...initial,
      ...saved,
      shop: initial.shop,
      collection: mergeCollection(saved.collection),
      currentSubject: mergeCurrentSubject(saved, initial),
      maternelleSection: saved.maternelleSection ?? initial.maternelleSection,
      learningProgress: mergeLearningProgress(saved.learningProgress, initial),
      achievements: mergeAchievements(saved.achievements),
      audioSettings: mergeAudioSettings(saved.audioSettings),
      coloring: { ...initial.coloring, ...saved.coloring },
      dictee: { ...initial.dictee, ...saved.dictee },
      farmUpgrades: mergeFarmUpgrades(saved, initial),
      // Au lancement on revient toujours à l'accueil (pas l'écran quitté).
      currentScreen: SCREENS.TAMAGOTCHI,
      farmLayout:
        Array.isArray(saved.farmLayout) && saved.farmLayout.length === 9
          ? saved.farmLayout.map((cell) =>
              cell ? resolveBuilderIcon(cell, initial.shop) : null,
            )
          : initial.farmLayout,
    }
  } catch {
    return createInitialGameState()
  }
}

export function saveGameState(gameState) {
  try {
    localStorage.setItem(getActiveStateKey(), JSON.stringify(gameState))
  } catch {
    // Quota dépassé ou localStorage indisponible — on ignore silencieusement
  }
}

export function clearSavedGameState() {
  try {
    localStorage.removeItem(getActiveStateKey())
  } catch {
    // localStorage indisponible — on ignore
  }
}
