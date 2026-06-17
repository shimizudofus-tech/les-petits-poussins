import { SCREENS } from '../constants/screens'
import { BUILDER_ICONS } from './builderAssets'
import { CHICKEN_STAGE_ICONS } from './chickenAssets'
import { DEFAULT_FARM_UPGRADES } from './farmUpgrades'
import { DEFAULT_AUDIO_SETTINGS } from '../utils/audioSettings'
import { createDefaultLearningProgress } from '../utils/maternelleProgress'
import { createDefaultAchievements } from '../utils/achievements'

export function createInitialGameState() {
  return {
    stars: 10,
    farmLevel: 1,
    hunger: 50,
    currentAnimalKey: 'chicken',
    builderSelectedItem: null,
    farmLayout: Array(9).fill(null),
    farmUpgrades: { ...DEFAULT_FARM_UPGRADES },
    farmShop: {},
    farmPlacements: {},
    animalCare: {},
    feedRewardClaimedAt: 0,
    currentScreen: SCREENS.TAMAGOTCHI,
    maternelleSection: 'petite',
    learningProgress: createDefaultLearningProgress(),
    achievements: createDefaultAchievements(),
    audioSettings: { ...DEFAULT_AUDIO_SETTINGS },

    collection: {
      chicken: {
        name: 'Poule',
        age: 0,
        currentStage: 'egg',
        completed: false,
        unlocked: true,
        stages: {
          egg: { icon: CHICKEN_STAGE_ICONS.egg, name: 'Œuf', nextAge: 3 },
          baby: { icon: CHICKEN_STAGE_ICONS.baby, name: 'Poussin', nextAge: 8 },
          adult: { icon: CHICKEN_STAGE_ICONS.adult, name: 'Poule' },
        },
      },
      pig: {
        name: 'Cochon',
        age: 0,
        currentStage: 'egg',
        completed: false,
        unlocked: false,
        stages: {
          egg: { icon: '📦', name: 'Mystère', nextAge: 3 },
          baby: { icon: '🐷', name: 'Porcelet', nextAge: 8 },
          adult: { icon: '🐖', name: 'Cochon' },
        },
      },
      cow: {
        name: 'Vache',
        age: 0,
        currentStage: 'egg',
        completed: false,
        unlocked: false,
        stages: {
          egg: { icon: '📦', name: 'Mystère', nextAge: 4 },
          baby: { icon: '🐮', name: 'Veau', nextAge: 10 },
          adult: { icon: '🐄', name: 'Vache' },
        },
      },
      sheep: {
        name: 'Mouton',
        age: 0,
        currentStage: 'egg',
        completed: false,
        unlocked: false,
        stages: {
          egg: { icon: '📦', name: 'Mystère', nextAge: 4 },
          baby: { icon: '🐑', name: 'Agneau', nextAge: 10 },
          adult: { icon: '🐏', name: 'Mouton' },
        },
      },
      rabbit: {
        name: 'Lapin',
        age: 0,
        currentStage: 'egg',
        completed: false,
        unlocked: false,
        stages: {
          egg: { icon: '📦', name: 'Mystère', nextAge: 5 },
          baby: { icon: '🐰', name: 'Lapereau', nextAge: 12 },
          adult: { icon: '🐇', name: 'Lapin' },
        },
      },
      duck: {
        name: 'Canard',
        age: 0,
        currentStage: 'egg',
        completed: false,
        unlocked: false,
        stages: {
          egg: { icon: '📦', name: 'Mystère', nextAge: 5 },
          baby: { icon: '🐤', name: 'Caneton', nextAge: 12 },
          adult: { icon: '🦆', name: 'Canard' },
        },
      },
    },

    shop: [
      { id: 'fence', icon: BUILDER_ICONS.fence, price: 2, name: 'Barrière' },
      { id: 'flower', icon: BUILDER_ICONS.flower, price: 3, name: 'Fleur' },
      { id: 'tree', icon: BUILDER_ICONS.tree, price: 5, name: 'Arbre' },
      { id: 'tractor', icon: BUILDER_ICONS.tractor, price: 10, name: 'Tracteur' },
      { id: 'well', icon: BUILDER_ICONS.well, price: 8, name: 'Fontaine' },
      { id: 'hay', icon: BUILDER_ICONS.hay, price: 4, name: 'Blé' },
    ],

    currentSubject: { petite: 'coloring', moyenne: 'colors', grande: 'letters', cp: 'math', ce1: 'math', ce2: 'math' },
    coloring: { currentColor: '#ef5350', drawn: false },
    dictee: { word: '', typed: [], scrambled: [] },
  }
}
