import { resolveBuilderIcon } from '../data/builderAssets'
import { CHICKEN_STAGE_ICONS } from '../data/chickenAssets'
import { clampFarmUpgrades, DEFAULT_FARM_UPGRADES } from '../data/farmUpgrades'
import { createInitialGameState } from '../data/initialGameState'
import { mergeAudioSettings } from './audioSettings'
import { resolveScreen } from '../constants/screens'
import {
  createDefaultLearningProgress,
  createSectionProgress,
  GRANDE_ACTIVITIES,
  MOYENNE_ACTIVITIES,
  PETITE_ACTIVITIES,
} from './maternelleProgress'
import { mergeAchievements } from './achievements'

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
    const raw = localStorage.getItem(STORAGE_KEY)
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
      currentScreen: resolveScreen(saved.currentScreen ?? initial.currentScreen),
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
  } catch {
    // Quota dépassé ou localStorage indisponible — on ignore silencieusement
  }
}

export function clearSavedGameState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage indisponible — on ignore
  }
}
