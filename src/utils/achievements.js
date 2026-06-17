import { BADGE_BY_ID, getTestStarReward } from '../data/badges'
import {
  GRANDE_ACTIVITIES,
  MOYENNE_ACTIVITIES,
  PETITE_ACTIVITIES,
} from './maternelleProgress'

export const CP_SUBJECTS = ['dictee', 'lecture', 'maths']

export function createActivityStats() {
  return {
    totalSuccess: 0,
    totalAttempts: 0,
    currentStreak: 0,
    bestStreak: 0,
    perfectTests: 0,
    lastSuccessAt: null,
  }
}

function createSectionStats(activities) {
  return Object.fromEntries(activities.map((key) => [key, createActivityStats()]))
}

export function createDefaultAchievements() {
  return {
    successStats: {
      maternelle: {
        petite: createSectionStats(PETITE_ACTIVITIES),
        moyenne: createSectionStats(MOYENNE_ACTIVITIES),
        grande: createSectionStats(GRANDE_ACTIVITIES),
      },
      cp: Object.fromEntries(CP_SUBJECTS.map((key) => [key, createActivityStats()])),
      ce1: Object.fromEntries(CP_SUBJECTS.map((key) => [key, createActivityStats()])),
      ce2: Object.fromEntries(CP_SUBJECTS.map((key) => [key, createActivityStats()])),
    },
    badges: {},
    tests: {
      history: [],
      activeTest: null,
    },
  }
}

function mergeActivityStats(saved) {
  return {
    ...createActivityStats(),
    ...saved,
    totalSuccess: saved?.totalSuccess ?? 0,
    totalAttempts: saved?.totalAttempts ?? 0,
    currentStreak: saved?.currentStreak ?? 0,
    bestStreak: saved?.bestStreak ?? 0,
    perfectTests: saved?.perfectTests ?? 0,
    lastSuccessAt: saved?.lastSuccessAt ?? null,
  }
}

function mergeSectionStats(savedSection, defaultSection) {
  const merged = { ...defaultSection }
  for (const key of Object.keys(defaultSection)) {
    merged[key] = mergeActivityStats(savedSection?.[key])
  }
  return merged
}

export function mergeAchievements(saved) {
  const defaults = createDefaultAchievements()
  if (!saved || typeof saved !== 'object') return defaults

  return {
    successStats: {
      maternelle: {
        petite: mergeSectionStats(saved.successStats?.maternelle?.petite, defaults.successStats.maternelle.petite),
        moyenne: mergeSectionStats(saved.successStats?.maternelle?.moyenne, defaults.successStats.maternelle.moyenne),
        grande: mergeSectionStats(saved.successStats?.maternelle?.grande, defaults.successStats.maternelle.grande),
      },
      cp: mergeSectionStats(saved.successStats?.cp, defaults.successStats.cp),
      ce1: mergeSectionStats(saved.successStats?.ce1, defaults.successStats.ce1),
      ce2: mergeSectionStats(saved.successStats?.ce2, defaults.successStats.ce2),
    },
    badges: { ...(saved.badges ?? {}) },
    tests: {
      history: Array.isArray(saved.tests?.history) ? saved.tests.history.slice(-20) : [],
      activeTest: saved.tests?.activeTest
        ? {
            ...saved.tests.activeTest,
            answers: [...(saved.tests.activeTest.answers ?? [])],
          }
        : null,
    },
  }
}

function getStatsBucket(achievements, { level, section, subject }) {
  if (level === 'cp') {
    return achievements.successStats.cp[subject] ?? createActivityStats()
  }
  if (level === 'ce1') {
    return achievements.successStats.ce1[subject] ?? createActivityStats()
  }
  if (level === 'ce2') {
    return achievements.successStats.ce2[subject] ?? createActivityStats()
  }
  return achievements.successStats.maternelle[section]?.[subject] ?? createActivityStats()
}

function setStatsBucket(achievements, { level, section, subject }, stats) {
  if (level === 'cp') {
    achievements.successStats.cp[subject] = stats
    return
  }
  if (level === 'ce1') {
    achievements.successStats.ce1[subject] = stats
    return
  }
  if (level === 'ce2') {
    achievements.successStats.ce2[subject] = stats
    return
  }
  if (!achievements.successStats.maternelle[section]) {
    achievements.successStats.maternelle[section] = {}
  }
  achievements.successStats.maternelle[section][subject] = stats
}

export function applyExerciseResult(achievements, { level, section, subject, success }) {
  const next = mergeAchievements(achievements)
  const stats = { ...getStatsBucket(next, { level, section, subject }) }

  stats.totalAttempts += 1
  if (success) {
    stats.totalSuccess += 1
    stats.currentStreak += 1
    stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak)
    stats.lastSuccessAt = new Date().toISOString()
  } else {
    stats.currentStreak = 0
  }

  setStatsBucket(next, { level, section, subject }, stats)
  return next
}

function sumAllSuccesses(achievements) {
  let total = 0
  for (const section of Object.values(achievements.successStats.maternelle)) {
    for (const stats of Object.values(section)) total += stats.totalSuccess
  }
  for (const stats of Object.values(achievements.successStats.cp)) {
    total += stats.totalSuccess
  }
  for (const stats of Object.values(achievements.successStats.ce1 ?? {})) {
    total += stats.totalSuccess
  }
  for (const stats of Object.values(achievements.successStats.ce2 ?? {})) {
    total += stats.totalSuccess
  }
  return total
}

function sumSubjectSuccess(achievements, subjectKeys) {
  let total = 0
  for (const section of Object.values(achievements.successStats.maternelle)) {
    for (const key of subjectKeys) {
      total += section[key]?.totalSuccess ?? 0
    }
  }
  return total
}

function sectionChampionReady(achievements, sectionKey, activities) {
  const section = achievements.successStats.maternelle[sectionKey]
  if (!section) return false
  return activities.every((activity) => (section[activity]?.totalSuccess ?? 0) >= 10)
}

export function evaluateBadgeUnlocks(achievements) {
  const unlocked = []
  const total = sumAllSuccesses(achievements)
  const colorsTotal = sumSubjectSuccess(achievements, ['colors'])
  const puzzlesTotal = sumSubjectSuccess(achievements, ['puzzles'])
  const lettersTotal = sumSubjectSuccess(achievements, ['letters'])

  const checks = [
    { id: 'first_success', ready: total >= 1 },
    { id: 'five_success', ready: total >= 5 },
    { id: 'ten_success', ready: total >= 10 },
    { id: 'colors_friend', ready: colorsTotal >= 10 },
    { id: 'puzzle_builder', ready: puzzlesTotal >= 5 },
    { id: 'letter_explorer', ready: lettersTotal >= 10 },
    { id: 'petite_champion', ready: sectionChampionReady(achievements, 'petite', PETITE_ACTIVITIES) },
    { id: 'moyenne_champion', ready: sectionChampionReady(achievements, 'moyenne', MOYENNE_ACTIVITIES) },
    { id: 'grande_champion', ready: sectionChampionReady(achievements, 'grande', GRANDE_ACTIVITIES) },
  ]

  for (const { id, ready } of checks) {
    if (ready && !achievements.badges[id]) unlocked.push(id)
  }

  return unlocked
}

export function unlockBadgeInState(achievements, badgeId) {
  if (achievements.badges[badgeId]) return { achievements, badge: null, stars: 0 }
  const def = BADGE_BY_ID[badgeId]
  if (!def) return { achievements, badge: null, stars: 0 }

  const next = mergeAchievements(achievements)
  next.badges[badgeId] = { unlockedAt: new Date().toISOString() }
  return { achievements: next, badge: def, stars: def.rewardStars ?? 0 }
}

export function cancelTestInState(achievements) {
  const next = mergeAchievements(achievements)
  if (!next.tests.activeTest) return next
  next.tests.activeTest = null
  return next
}

export function startTestInState(achievements, { level, section, subject, length = 5 }) {
  const next = mergeAchievements(achievements)
  next.tests.activeTest = {
    level,
    section: section ?? null,
    subject,
    length,
    index: 0,
    correct: 0,
    answers: [],
    startedAt: new Date().toISOString(),
  }
  return next
}

export function recordTestAnswerInState(achievements, { success, exerciseId }) {
  const next = mergeAchievements(achievements)
  const test = next.tests.activeTest
  if (!test) return { achievements: next, finished: false }

  const updatedTest = {
    ...test,
    index: test.index + 1,
    correct: test.correct + (success ? 1 : 0),
    answers: [
      ...test.answers,
      { success, exerciseId: exerciseId ?? null, at: new Date().toISOString() },
    ],
  }

  next.tests = { ...next.tests, activeTest: updatedTest }

  if (updatedTest.index >= updatedTest.length) {
    return finishTestInState(next)
  }

  return { achievements: next, finished: false }
}

export function finishTestInState(achievements) {
  const next = mergeAchievements(achievements)
  const test = next.tests.activeTest
  if (!test) return { achievements: next, finished: false, result: null }

  const length = test.length
  const score = Math.min(test.correct, length)
  const perfect = score >= length
  const stars = getTestStarReward(score, length)

  const result = {
    level: test.level,
    section: test.section,
    subject: test.subject,
    score,
    length,
    stars,
    perfect,
    finishedAt: new Date().toISOString(),
  }

  next.tests.history = [...next.tests.history, result].slice(-20)
  next.tests.activeTest = null

  if (perfect) {
    const stats = getStatsBucket(next, {
      level: test.level,
      section: test.section,
      subject: test.subject,
    })
    stats.perfectTests += 1
    setStatsBucket(next, { level: test.level, section: test.section, subject: test.subject }, stats)
  }

  return { achievements: next, finished: true, result }
}

export function getBadgeProgress(achievements, badgeId) {
  const merged = mergeAchievements(achievements)
  const total = sumAllSuccesses(merged)
  const colorsTotal = sumSubjectSuccess(merged, ['colors'])
  const puzzlesTotal = sumSubjectSuccess(merged, ['puzzles'])
  const lettersTotal = sumSubjectSuccess(merged, ['letters'])

  switch (badgeId) {
    case 'first_success':
      return { current: Math.min(total, 1), target: 1 }
    case 'five_success':
      return { current: Math.min(total, 5), target: 5 }
    case 'ten_success':
      return { current: Math.min(total, 10), target: 10 }
    case 'colors_friend':
      return { current: Math.min(colorsTotal, 10), target: 10 }
    case 'puzzle_builder':
      return { current: Math.min(puzzlesTotal, 5), target: 5 }
    case 'letter_explorer':
      return { current: Math.min(lettersTotal, 10), target: 10 }
    case 'petite_champion':
      return sectionChampionProgress(merged, 'petite', PETITE_ACTIVITIES)
    case 'moyenne_champion':
      return sectionChampionProgress(merged, 'moyenne', MOYENNE_ACTIVITIES)
    case 'grande_champion':
      return sectionChampionProgress(merged, 'grande', GRANDE_ACTIVITIES)
    default:
      return null
  }
}

function sectionChampionProgress(achievements, sectionKey, activities) {
  const section = achievements.successStats.maternelle[sectionKey] ?? {}
  const values = activities.map((activity) => section[activity]?.totalSuccess ?? 0)
  const minSuccess = values.length ? Math.min(...values) : 0
  return { current: Math.min(minSuccess, 10), target: 10 }
}

export function getAchievementSummary(achievements) {
  const merged = mergeAchievements(achievements)
  let totalSuccess = 0
  let totalAttempts = 0
  let bestStreak = 0

  const walk = (stats) => {
    totalSuccess += stats.totalSuccess
    totalAttempts += stats.totalAttempts
    bestStreak = Math.max(bestStreak, stats.bestStreak)
  }

  for (const section of Object.values(merged.successStats.maternelle)) {
    for (const stats of Object.values(section)) walk(stats)
  }
  for (const stats of Object.values(merged.successStats.cp)) walk(stats)
  for (const stats of Object.values(merged.successStats.ce1 ?? {})) walk(stats)
  for (const stats of Object.values(merged.successStats.ce2 ?? {})) walk(stats)

  const badgesUnlocked = Object.keys(merged.badges).length

  return {
    totalSuccess,
    totalAttempts,
    bestStreak,
    badgesUnlocked,
    badgesTotal: Object.keys(BADGE_BY_ID).length,
    recentBadges: Object.entries(merged.badges)
      .sort((a, b) => String(b[1].unlockedAt).localeCompare(String(a[1].unlockedAt)))
      .slice(0, 5)
      .map(([id]) => id),
    testHistory: merged.tests.history.slice(-5),
    successStats: merged.successStats,
    badges: merged.badges,
  }
}
