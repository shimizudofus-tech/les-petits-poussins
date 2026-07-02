import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { resolveScreen, SCREENS } from '../constants/screens'
import {
  getUpgradeCost,
  isFarmUpgradeAtMax,
  isValidFarmUpgradeKey,
} from '../data/farmUpgrades'
import { getCatalogItem, getItemCost, isItemMaxed } from '../data/farmCatalog'
import { createInitialGameState } from '../data/initialGameState'
import {
  applyExerciseResult,
  evaluateBadgeUnlocks,
  finishTestInState,
  recordTestAnswerInState,
  startTestInState,
  unlockBadgeInState,
  cancelTestInState,
} from '../utils/achievements'
import { setVoiceDisabledHandler, resolveSpeechText } from '../utils/audio'
import { initBilling, checkPremium, getOfferings, purchasePackage, restorePurchases, isBillingAvailable } from '../utils/billing'
import { playWord } from '../utils/audioManager'
import { hapticSuccess, hapticError } from '../utils/haptics'
import { ensureTodayMissions, MISSION_BY_ID } from '../data/missions'
import { isLegendary, nextLockedLegendary } from '../data/legendaries'
import DailyStreakCalendar from '../components/DailyStreakCalendar'
import { translate } from '../i18n/strings'
import { getActiveAudioSettings, mergeAudioSettings, setActiveAudioSettings } from '../utils/audioSettings'
import { setMusicVolume, stopBackgroundMusic, unlockAudioOnFirstInteraction } from '../utils/music'
import { setSoftAudioEnabled, setSoftAudioVolume, initClickSfx } from '../utils/softAudio'
import { checkEvolution } from '../utils/evolution'
import { PARENT_RETURN_SESSION_KEY } from '../utils/parentContentStats'
import { clearSavedGameState, loadGameState, saveGameState } from '../utils/persistence'
import {
  ensureProfiles,
  getProfiles,
  setActiveProfileId,
  addProfile as addProfileUtil,
  deleteProfile as deleteProfileUtil,
} from '../utils/profiles'

export { SCREENS }

// Encouragements : le texte affiché ET la voix correspondent (même entrée),
// donc on n'a que des messages qui ont un MP3 de voix.
const SUCCESS_CHEERS = [
  { key: 'bravo', text: 'Bravo !' },
  { key: 'excellent', text: 'Excellent !' },
  { key: 'bien_joue', text: 'Bien joué !' },
  { key: 'continue_comme_ca', text: 'Continue comme ça !' },
]
// Échecs doux et variés (jamais punitifs) — chaque entrée a son MP3 de voix.
const FAIL_CHEERS = [
  { key: 'oups', text: 'Essaie encore !' },
  { key: 'presque', text: 'Presque ! Regarde bien.' },
  { key: 'pas_celle_ci', text: "Ce n'est pas celle-ci. Essaie encore !" },
]

function pickCheer(correct) {
  if (!correct) return FAIL_CHEERS[Math.floor(Math.random() * FAIL_CHEERS.length)]
  return SUCCESS_CHEERS[Math.floor(Math.random() * SUCCESS_CHEERS.length)]
}

// Coût en étoiles pour prendre un nouvel animal (l'adulte reste jusque-là).
export const NEW_ANIMAL_COST = 15

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(loadGameState)
  const initialProfiles = ensureProfiles()
  const [profiles, setProfiles] = useState(initialProfiles.list)
  const [activeProfileId, setActiveProfileIdState] = useState(initialProfiles.active)
  const [toast, setToast] = useState(null)
  const [modal, setModal] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const toastTimerRef = useRef(null)
  const feedbackTimerRef = useRef(null)
  const suppressPersistRef = useRef(false)
  const exerciseContextRef = useRef({ level: 'maternelle', section: 'petite', subject: 'coloring' })
  const exerciseAdvanceRef = useRef(null)
  const achievementNotifyRef = useRef(null)
  const activeTestRef = useRef(null)
  const recordMissionRef = useRef(null)
  const sessionCorrectRef = useRef(0)   // bonnes réponses de la session (coffre surprise)

  function normalizeSubject(level, subject) {
    if (level === 'cp' && subject === 'math') return 'maths'
    return subject
  }

  const showToast = useCallback((message, color = '#ff8f00') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ message, color })
    toastTimerRef.current = setTimeout(() => setToast(null), 2000)
  }, [])

  const hideModal = useCallback(() => setModal(null), [])

  const showModal = useCallback(({ icon = '🎉', title = '', body = '', buttons = [], content = null }) => {
    setModal({ icon, title, body, buttons, content })
  }, [])

  const setPremium = useCallback((value) => {
    setGameState((prev) => ({ ...prev, premium: Boolean(value) }))
  }, [])

  // Init billing + sync premium status on mount.
  useEffect(() => {
    initBilling().then(() => checkPremium().then((ok) => ok && setPremium(true)))
  }, [setPremium])

  const subscribe = useCallback(async () => {
    if (!isBillingAvailable()) {
      // Billing pas encore branché (RevenueCat) → accès direct pour l'instant.
      setPremium(true)
      showToast('Version complète débloquée ⭐', '#43a047')
      return
    }
    try {
      const offering = await getOfferings()
      if (!offering?.availablePackages?.length) {
        showToast('Offre indisponible, réessaie plus tard', '#e53935')
        return
      }
      const ok = await purchasePackage(offering.availablePackages[0])
      if (ok) {
        setPremium(true)
        showToast('Merci ! Contenu premium débloqué ⭐', '#43a047')
      }
    } catch (err) {
      if (!err?.userCancelled) showToast('Erreur de paiement', '#e53935')
    }
  }, [setPremium, showToast])

  const handleRestore = useCallback(async () => {
    const ok = await restorePurchases()
    if (ok) { setPremium(true); showToast('Abonnement restauré ⭐', '#43a047') }
    else showToast('Aucun abonnement trouvé', '#e53935')
  }, [setPremium, showToast])

  const showPaywall = useCallback(
    (body = 'Débloque tous les animaux et toute la ferme !') => {
      showModal({
        icon: '⭐',
        title: 'Version complète',
        body: `${body}\n\n🎁 Gratuit pendant les tests !`,
        buttons: [
          { label: 'Débloquer (gratuit pendant les tests)', type: 'primary', onClick: () => subscribe() },
          { label: 'Restaurer', type: 'secondary', onClick: () => handleRestore() },
          { label: 'Plus tard', type: 'secondary' },
        ],
      })
    },
    [showModal, subscribe, handleRestore],
  )

  const switchScreen = useCallback((screen) => {
    const target = resolveScreen(screen, SCREENS.TAMAGOTCHI)
    setGameState((prev) => ({ ...prev, currentScreen: target }))
  }, [])

  const setExerciseContext = useCallback(({ level, section, subject }) => {
    exerciseContextRef.current = {
      level,
      section,
      subject: normalizeSubject(level, subject),
    }
  }, [])

  const registerExerciseAdvance = useCallback((fn) => {
    exerciseAdvanceRef.current = fn
  }, [])

  const flushAchievementNotifications = useCallback(() => {
    const pending = achievementNotifyRef.current
    achievementNotifyRef.current = null
    if (!pending) return

    if (pending.testResult && pending.testResult.level !== 'cp') {
      const result = pending.testResult
      showToast(`Test terminé : ${result.score}/${result.length} (+${result.stars}⭐)`, '#7c4dff')
    }

    for (const badge of pending.badges) {
      showModal({
        icon: badge.icon,
        title: 'Badge débloqué !',
        body: `${badge.name} — +${badge.rewardStars ?? 0}⭐`,
        buttons: [{ label: 'Super !', type: 'primary' }],
      })
      break
    }
  }, [showModal, showToast])

  const unlockBadge = useCallback(
    (badgeId) => {
      let unlockedBadge = null
      setGameState((prev) => {
        const { achievements: nextAchievements, badge, stars } = unlockBadgeInState(
          prev.achievements,
          badgeId,
        )
        if (!badge) return prev
        unlockedBadge = badge
        return {
          ...prev,
          achievements: nextAchievements,
          stars: prev.stars + stars,
        }
      })
      if (unlockedBadge) {
        showModal({
          icon: unlockedBadge.icon,
          title: 'Badge débloqué !',
          body: `${unlockedBadge.name} — +${unlockedBadge.rewardStars ?? 0}⭐`,
          buttons: [{ label: 'Super !', type: 'primary' }],
        })
      }
      return unlockedBadge
    },
    [showModal],
  )

  const recordExerciseResult = useCallback(
    ({ level, section, subject, success, exerciseId, source }) => {
      setGameState((prev) => {
        const ctx = exerciseContextRef.current
        const resolved = {
          level: level ?? ctx.level,
          section: section ?? ctx.section,
          subject: normalizeSubject(level ?? ctx.level, subject ?? ctx.subject),
          success: Boolean(success),
          exerciseId,
          source,
        }

        let achievements = applyExerciseResult(prev.achievements, resolved)
        let bonusStars = 0
        const notifications = { badges: [], testResult: null, advanceTest: false }

        if (prev.achievements?.tests?.activeTest) {
          const testResult = recordTestAnswerInState(achievements, {
            success: resolved.success,
            exerciseId,
          })
          achievements = testResult.achievements

          if (testResult.finished && testResult.result) {
            notifications.testResult = testResult.result
            bonusStars += testResult.result.stars

            if (testResult.result.perfect) {
              const perfectUnlock = unlockBadgeInState(achievements, 'perfect_test')
              achievements = perfectUnlock.achievements
              if (perfectUnlock.badge) {
                bonusStars += perfectUnlock.stars
                notifications.badges.push(perfectUnlock.badge)
              }
            }
          } else if (achievements.tests.activeTest) {
            notifications.advanceTest = true
          }
        }

        const pending = evaluateBadgeUnlocks(achievements)
        for (const badgeId of pending) {
          const unlock = unlockBadgeInState(achievements, badgeId)
          achievements = unlock.achievements
          if (unlock.badge) {
            bonusStars += unlock.stars
            notifications.badges.push(unlock.badge)
          }
        }

        achievementNotifyRef.current = notifications
        queueMicrotask(flushAchievementNotifications)

        if (notifications.advanceTest) {
          queueMicrotask(() => {
            setTimeout(() => exerciseAdvanceRef.current?.(), 1800)
          })
        }

        // Révision adaptative : on compte les ratés par exercice (réussite → oublié).
        let reviewStats = prev.reviewStats ?? {}
        if (exerciseId) {
          reviewStats = { ...reviewStats }
          if (resolved.success) delete reviewStats[exerciseId]
          else reviewStats[exerciseId] = Math.min(5, (reviewStats[exerciseId] ?? 0) + 1)
        }

        // Journal d'activité quotidien (rapport parent) — on garde 14 jours max.
        const today = new Date().toISOString().slice(0, 10)
        const log = { ...(prev.activityLog ?? {}) }
        const day = log[today] ?? { success: 0, attempts: 0 }
        log[today] = {
          success: day.success + (resolved.success ? 1 : 0),
          attempts: day.attempts + 1,
        }
        const cutoff = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10)
        for (const d of Object.keys(log)) if (d < cutoff) delete log[d]

        return { ...prev, achievements, stars: prev.stars + bonusStars, reviewStats, activityLog: log }
      })
    },
    [flushAchievementNotifications],
  )

  const startTest = useCallback(({ level, section, subject, length = 5 }) => {
    setGameState((prev) => ({
      ...prev,
      achievements: startTestInState(prev.achievements, { level, section, subject, length }),
    }))
  }, [])

  const cancelTest = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      achievements: cancelTestInState(prev.achievements),
    }))
  }, [])

  const recordTestAnswer = useCallback(({ success, exerciseId }) => {
    setGameState((prev) => {
      const result = recordTestAnswerInState(prev.achievements, { success, exerciseId })
      if (result.finished && result.result) {
        queueMicrotask(() => {
          showToast(
            `Test terminé : ${result.result.score}/${result.result.length} (+${result.result.stars}⭐)`,
            '#7c4dff',
          )
        })
      }
      return { ...prev, achievements: result.achievements, stars: prev.stars + (result.result?.stars ?? 0) }
    })
  }, [showToast])

  const finishTest = useCallback(() => {
    setGameState((prev) => {
      const result = finishTestInState(prev.achievements)
      if (result.finished && result.result) {
        queueMicrotask(() => {
          showToast(
            `Test terminé : ${result.result.score}/${result.result.length} (+${result.result.stars}⭐)`,
            '#7c4dff',
          )
        })
      }
      return {
        ...prev,
        achievements: result.achievements,
        stars: prev.stars + (result.result?.stars ?? 0),
      }
    })
  }, [showToast])

  const showFeedback = useCallback(
    (correct, meta) => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
      const cheer = pickCheer(correct)
      // Texte affiché = voix jouée (bilingue : resolveSpeechText suit la langue).
      setFeedback({ correct, message: resolveSpeechText(cheer.key) ?? cheer.text })
      const inTest = Boolean(activeTestRef.current)
      playWord(cheer.key) // voix = texte affiché
      if (correct) hapticSuccess()
      else hapticError()
      if (correct && !inTest) {
        setGameState((prev) => ({ ...prev, stars: prev.stars + 2 }))
        recordMissionRef.current?.('exercises')

        // Coffre surprise : toutes les 5 bonnes réponses de la session → +5 ⭐.
        sessionCorrectRef.current += 1
        if (sessionCorrectRef.current % 5 === 0) {
          const lang = getActiveAudioSettings().lang === 'en' ? 'en' : 'fr'
          setGameState((prev) => ({ ...prev, stars: prev.stars + 5 }))
          setTimeout(() => {
            showModal({
              icon: '🎁',
              title: translate(lang, 'chest.title'),
              body: `${translate(lang, 'chest.body')}\n${translate(lang, 'chest.won')}`,
              buttons: [{ label: translate(lang, 'chest.btn'), type: 'primary' }],
            })
          }, 1500)
        }
      }
      if (meta?.skipAchievement !== true) {
        recordExerciseResult({
          success: correct,
          exerciseId: meta?.exerciseId,
          level: meta?.level,
          section: meta?.section,
          subject: meta?.subject,
          source: meta?.source,
        })
      }
      feedbackTimerRef.current = setTimeout(() => setFeedback(null), 1400)
    },
    [recordExerciseResult, showModal],
  )

  const setSubject = useCallback((level, subject) => {
    setGameState((prev) => ({
      ...prev,
      currentSubject: { ...prev.currentSubject, [level]: subject },
    }))
  }, [])

  const selectBuilderItem = useCallback((itemId) => {
    setGameState((prev) => ({ ...prev, builderSelectedItem: itemId }))
  }, [])

  const upgradeFarmPart = useCallback(
    (partKey) => {
      if (!isValidFarmUpgradeKey(partKey)) {
        queueMicrotask(() => showToast('⚠️ Amélioration inconnue.', '#ef5350'))
        return
      }

      setGameState((prev) => {
        const currentLevel = prev.farmUpgrades?.[partKey] ?? 0

        if (isFarmUpgradeAtMax(currentLevel)) {
          queueMicrotask(() => showToast('Niveau maximum atteint !', '#ff8f00'))
          return prev
        }

        const cost = getUpgradeCost(currentLevel)

        if (prev.stars < cost) {
          queueMicrotask(() => showToast("❌ Pas assez d'étoiles !", '#ef5350'))
          return prev
        }

        queueMicrotask(() => showToast('✅ Ferme améliorée !', '#66bb6a'))

        return {
          ...prev,
          stars: prev.stars - cost,
          farmUpgrades: {
            ...prev.farmUpgrades,
            [partKey]: currentLevel + 1,
          },
        }
      })
    },
    [showToast],
  )

  const buyFarmItem = useCallback(
    (id) => {
      const item = getCatalogItem(id)
      if (!item) {
        queueMicrotask(() => showToast('⚠️ Amélioration inconnue.', '#ef5350'))
        return
      }
      setGameState((prev) => {
        const shop = prev.farmShop ?? {}
        if (isItemMaxed(shop, id)) {
          queueMicrotask(() => showToast('Niveau maximum atteint !', '#ff8f00'))
          return prev
        }
        const cost = getItemCost(shop, id)
        if (prev.stars < cost) {
          queueMicrotask(() => showToast("❌ Pas assez d'étoiles !", '#ef5350'))
          return prev
        }
        queueMicrotask(() => showToast(`✅ ${item.name} amélioré !`, '#66bb6a'))
        return {
          ...prev,
          stars: prev.stars - cost,
          farmShop: { ...shop, [id]: (shop[id] ?? 0) + 1 },
        }
      })
    },
    [showToast],
  )

  const placeBuilderItem = useCallback(
    (cellIndex) => {
      setGameState((prev) => {
        if (!prev.builderSelectedItem) {
          queueMicrotask(() => showToast('👆 Sélectionne un objet !', '#ff8f00'))
          return prev
        }

        const item = prev.shop.find((x) => x.id === prev.builderSelectedItem)
        if (!item) return prev

        if (prev.farmLayout[cellIndex]) {
          queueMicrotask(() => showToast('🚫 Case occupée !', '#ef5350'))
          return prev
        }

        if (prev.stars < item.price) {
          queueMicrotask(() => showToast("❌ Pas assez d'étoiles !", '#ef5350'))
          return prev
        }

        const farmLayout = [...prev.farmLayout]
        farmLayout[cellIndex] = item.icon
        queueMicrotask(() => showToast(`✅ ${item.name} posé !`, '#66bb6a'))

        return {
          ...prev,
          stars: prev.stars - item.price,
          farmLayout,
        }
      })
    },
    [showToast],
  )

  const selectAnimal = useCallback(
    (animalKey) => {
      setGameState((prev) => {
        const animal = prev.collection[animalKey]
        if (!animal) {
          queueMicrotask(() => showToast('⚠️ Animal inconnu.', '#ef5350'))
          return prev
        }
        if (!animal.unlocked) {
          queueMicrotask(() => showToast('Animal pas encore débloqué.', '#ef5350'))
          return prev
        }
        if (prev.currentAnimalKey === animalKey) {
          return prev
        }

        queueMicrotask(() => showToast(`${animal.name} rejoint la ferme !`, '#66bb6a'))

        return {
          ...prev,
          currentAnimalKey: animalKey,
          currentScreen: SCREENS.TAMAGOTCHI,
          hunger: 50,
        }
      })
    },
    [showToast],
  )

  const setAnimalDisplayStage = useCallback((animalKey, stage) => {
    setGameState((prev) => {
      const animal = prev.collection[animalKey]
      if (!animal || !animal.unlocked) return prev
      return {
        ...prev,
        collection: { ...prev.collection, [animalKey]: { ...animal, displayStage: stage } },
      }
    })
  }, [])

  // Prendre un nouvel animal : l'animal adulte RESTE, on n'en prend un nouveau
  // que quand on a assez d'étoiles (coût ci-dessous). Tirage au hasard, sans nom.
  const adoptNewAnimal = useCallback(() => {
    setGameState((prev) => {
      const current = prev.collection[prev.currentAnimalKey]
      const isAdult = current?.currentStage === 'adult' || current?.completed
      if (!isAdult) {
        queueMicrotask(() => showToast("Fais d'abord grandir ton animal ! 🐣", '#ff8f00'))
        return prev
      }
      // Les légendaires ne s'obtiennent QUE via la série de 7 jours → exclus ici.
      const lockedKeys = Object.keys(prev.collection).filter(
        (key) => !prev.collection[key].unlocked && !isLegendary(key),
      )
      if (lockedKeys.length === 0) {
        queueMicrotask(() => showToast('Tu as déjà tous les animaux ! 🎉', '#66bb6a'))
        return prev
      }
      // Gratuit : 2 animaux max (poule + 1). Au-delà → version complète.
      if (!prev.premium) {
        const unlockedCount = Object.values(prev.collection).filter((a) => a.unlocked).length
        if (unlockedCount >= 2) {
          queueMicrotask(() => showPaywall('Débloque tous les animaux avec la version complète !'))
          return prev
        }
      }
      if (prev.stars < NEW_ANIMAL_COST) {
        queueMicrotask(() => showToast(`Il te faut ${NEW_ANIMAL_COST} ⭐ pour un nouvel animal !`, '#ef5350'))
        return prev
      }

      const nextKey = lockedKeys[Math.floor(Math.random() * lockedKeys.length)]
      const nextAnimal = prev.collection[nextKey]
      // Pas de nom révélé avant l'ouverture de l'œuf/cadeau.
      queueMicrotask(() => showToast('🎉 Nouvel animal débloqué !', '#7c4dff'))

      return {
        ...prev,
        stars: prev.stars - NEW_ANIMAL_COST,
        currentAnimalKey: nextKey,
        hunger: 50,
        collection: { ...prev.collection, [nextKey]: { ...nextAnimal, unlocked: true } },
      }
    })
  }, [showToast, showPaywall])

  const updateAudioSettings = useCallback((patch) => {
    setGameState((prev) => {
      const audioSettings = mergeAudioSettings({ ...prev.audioSettings, ...patch })
      setActiveAudioSettings(audioSettings)
      setMusicVolume(audioSettings.musicVolume)
      if (!audioSettings.musicEnabled) {
        stopBackgroundMusic()
      }
      return { ...prev, audioSettings }
    })
  }, [])

  const resetProgress = useCallback(() => {
    suppressPersistRef.current = true
    clearSavedGameState()

    try {
      sessionStorage.removeItem(PARENT_RETURN_SESSION_KEY)
    } catch {
      // sessionStorage indisponible — on ignore
    }

    const fresh = createInitialGameState()
    fresh.currentScreen = SCREENS.TAMAGOTCHI

    setModal(null)
    setFeedback(null)
    setToast(null)
    setGameState(fresh)
    saveGameState(fresh)
    suppressPersistRef.current = false

    queueMicrotask(() => showToast('Progression réinitialisée', '#66bb6a'))
  }, [showToast])

  // ── Multi-profils ──
  // La sauvegarde du profil courant est déjà persistée à chaque changement
  // d'état → on bascule juste la clé active puis on recharge l'état du profil.
  const switchProfile = useCallback((id) => {
    setActiveProfileId(id)
    setActiveProfileIdState(id)
    setProfiles(getProfiles())
    setModal(null)
    setFeedback(null)
    const next = loadGameState()
    next.currentScreen = SCREENS.TAMAGOTCHI
    setGameState(next)
  }, [])

  const addProfile = useCallback((name) => {
    const profile = addProfileUtil(name)
    setProfiles(getProfiles())
    switchProfile(profile.id) // nouveau profil → état neuf
    return profile
  }, [switchProfile])

  const deleteProfile = useCallback((id) => {
    const remaining = deleteProfileUtil(id)
    setProfiles(remaining)
    if (id === activeProfileId && remaining[0]) {
      switchProfile(remaining[0].id)
    } else {
      setActiveProfileIdState(getProfiles().find((p) => p.id === activeProfileId) ? activeProfileId : remaining[0]?.id ?? null)
    }
  }, [activeProfileId, switchProfile])

  const toggleDyslexiaFont = useCallback(() => {
    setGameState((prev) => ({ ...prev, dyslexiaFont: !prev.dyslexiaFont }))
  }, [])

  const setTimeLimit = useCallback((minutes) => {
    setGameState((prev) => ({ ...prev, timeLimitMin: Math.max(0, minutes | 0) }))
  }, [])

  const resetScreenTime = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      screenTimeToday: 0,
      screenTimeDate: new Date().toISOString().slice(0, 10),
    }))
  }, [])

  const endTutorial = useCallback((rewarded) => {
    setGameState((prev) => {
      if (prev.tutorialDone) return prev
      const bonus = rewarded && !prev.tutorialRewarded ? 15 : 0
      if (bonus) queueMicrotask(() => showToast('🎉 Tutoriel terminé : +15 ⭐ !', '#7c4dff'))
      return { ...prev, tutorialDone: true, tutorialRewarded: prev.tutorialRewarded || bonus > 0, stars: (prev.stars || 0) + bonus }
    })
  }, [showToast])

  // Compteur de temps d'écran (toutes les 5 s, seulement onglet visible).
  useEffect(() => {
    const id = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return
      setGameState((prev) => {
        const today = new Date().toISOString().slice(0, 10)
        if (prev.screenTimeDate !== today) return { ...prev, screenTimeDate: today, screenTimeToday: 5 }
        return { ...prev, screenTimeToday: (prev.screenTimeToday || 0) + 5 }
      })
    }, 5000)
    return () => clearInterval(id)
  }, [])

  // Récompense quotidienne (streak) : une fois par jour au lancement.
  const dailyRewardRef = useRef(false)
  useEffect(() => {
    if (dailyRewardRef.current) return
    dailyRewardRef.current = true
    const today = new Date().toISOString().slice(0, 10)
    setGameState((prev) => {
      if (prev.lastRewardDate === today) return prev
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      const streak = prev.lastRewardDate === yesterday ? (prev.dayStreak || 0) + 1 : 1
      const reward = Math.min(2 + streak, 10)
      const dayInWeek = ((streak - 1) % 7) + 1

      // Tous les 7 jours consécutifs : on débloque un animal légendaire.
      let collection = prev.collection
      let awarded = null
      if (streak % 7 === 0) {
        const leg = nextLockedLegendary(prev.collection)
        if (leg) {
          awarded = leg
          collection = { ...prev.collection, [leg.key]: { ...prev.collection[leg.key], unlocked: true } }
        }
      }

      const lang = getActiveAudioSettings().lang === 'en' ? 'en' : 'fr'
      queueMicrotask(() =>
        showModal({
          icon: awarded ? '🌟' : '🎁',
          title: awarded
            ? translate(lang, 'daily.legendReward')
            : `${translate(lang, 'daily.dailyGift')} — ${translate(lang, 'daily.day')} ${streak} !`,
          body: `+${reward} ⭐ ${translate(lang, 'daily.forVisit')}`,
          content: <DailyStreakCalendar dayInWeek={dayInWeek} awarded={awarded} />,
          buttons: [{ label: translate(lang, 'daily.thanks'), type: 'primary' }],
        }),
      )
      return { ...prev, stars: (prev.stars || 0) + reward, lastRewardDate: today, dayStreak: streak, collection }
    })
  }, [showModal])

  // Missions du jour : régénère au lancement si nouveau jour.
  const missionsInitRef = useRef(false)
  useEffect(() => {
    if (missionsInitRef.current) return
    missionsInitRef.current = true
    setGameState((prev) => ({ ...prev, ...ensureTodayMissions(prev) }))
  }, [])

  // Avance une mission ; récompense automatique à la cible atteinte.
  const recordMission = useCallback((type) => {
    setGameState((prev) => {
      const base = ensureTodayMissions(prev)
      let bonus = 0
      let doneLabel = null
      const missions = base.missions.map((m) => {
        if (m.id !== type) return m
        const def = MISSION_BY_ID[m.id]
        if (!def || m.claimed) return m
        const progress = Math.min(def.target, (m.progress || 0) + 1)
        if (progress >= def.target && !m.claimed) {
          bonus += def.reward
          doneLabel = def.label
          return { ...m, progress, claimed: true }
        }
        return { ...m, progress }
      })
      if (doneLabel) {
        queueMicrotask(() => showToast(`🎯 Mission réussie ! +${bonus} ⭐`, '#7c4dff'))
      }
      return { ...prev, ...base, missions, stars: (prev.stars || 0) + bonus }
    })
  }, [showToast])
  recordMissionRef.current = recordMission

  const feedAnimal = useCallback(() => {
    setGameState((prev) => {
      if (prev.stars < 1) {
        queueMicrotask(() => showToast("❌ Plus d'étoiles ! Va jouer !", '#ef5350'))
        return prev
      }

      const animal = prev.collection[prev.currentAnimalKey]
      const isFullyGrown = animal.currentStage === 'adult' || animal.completed

      if (isFullyGrown) {
        // L'animal adulte RESTE. On invite juste à prendre un nouvel animal.
        queueMicrotask(() =>
          showToast(
            `${animal.name} est adulte ! 🥚 Prends un nouvel animal quand tu as ${NEW_ANIMAL_COST} ⭐.`,
            '#ff8f00',
          ),
        )
        return prev
      }

      const agedAnimal = { ...animal, age: animal.age + 1 }
      const collectionWithAge = {
        ...prev.collection,
        [prev.currentAnimalKey]: agedAnimal,
      }
      const { collection, event } = checkEvolution(prev.currentAnimalKey, collectionWithAge)

      if (event?.type === 'hatch') {
        queueMicrotask(() => showToast(`🎊 L'œuf a éclos ! Bébé ${event.name} !`, '#7c4dff'))
      } else if (event?.type === 'adult') {
        queueMicrotask(() => showToast(`Bravo ! ${event.name} est adulte ! 🏆`, '#7c4dff'))
      }

      queueMicrotask(() => recordMissionRef.current?.('feed'))
      return {
        ...prev,
        stars: prev.stars - 1,
        hunger: Math.min(100, prev.hunger + 30),
        collection,
      }
    })
  }, [showToast])

  // Renommer l'animal courant (personnalisation enfant).
  const renameAnimal = useCallback((name) => {
    const clean = String(name || '').trim().slice(0, 14)
    if (!clean) return
    setGameState((prev) => {
      const key = prev.currentAnimalKey
      const animal = prev.collection[key]
      if (!animal) return prev
      return {
        ...prev,
        collection: { ...prev.collection, [key]: { ...animal, customName: clean } },
      }
    })
  }, [])

  useEffect(() => {
    if (suppressPersistRef.current) return
    saveGameState(gameState)
  }, [gameState])

  useEffect(() => {
    const settings = mergeAudioSettings(gameState.audioSettings)
    setActiveAudioSettings(settings)
    setMusicVolume(settings.musicVolume)
    setSoftAudioVolume(settings.musicVolume)
    setSoftAudioEnabled(settings.musicEnabled)
    if (!settings.musicEnabled) {
      stopBackgroundMusic()
    }
  }, [gameState.audioSettings])

  useEffect(() => {
    activeTestRef.current = gameState.achievements?.tests?.activeTest ?? null
  }, [gameState.achievements?.tests?.activeTest])

  useEffect(() => {
    setVoiceDisabledHandler(() => showToast('Voix désactivée', '#8d6e3a'))
    unlockAudioOnFirstInteraction(() => getActiveAudioSettings())
    initClickSfx()
    return () => setVoiceDisabledHandler(null)
  }, [showToast])

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        if (prev.hunger <= 0) return prev
        const newHunger = Math.max(0, prev.hunger - 2)
        if (newHunger <= 10 && prev.hunger > 10) {
          queueMicrotask(() => showToast('😢 Ton animal a faim !', '#ef5350'))
        }
        return { ...prev, hunger: newHunger }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [showToast])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
    }
  }, [])

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        switchScreen,
        feedAnimal,
        adoptNewAnimal,
        showPaywall,
        setPremium,
        subscribe,
        restorePurchases: handleRestore,
        recordMission,
        renameAnimal,
        showFeedback,
        setSubject,
        selectBuilderItem,
        placeBuilderItem,
        upgradeFarmPart,
        buyFarmItem,
        selectAnimal,
        setAnimalDisplayStage,
        resetProgress,
        profiles,
        activeProfileId,
        switchProfile,
        addProfile,
        deleteProfile,
        toggleDyslexiaFont,
        setTimeLimit,
        resetScreenTime,
        endTutorial,
        updateAudioSettings,
        setExerciseContext,
        registerExerciseAdvance,
        recordExerciseResult,
        unlockBadge,
        startTest,
        cancelTest,
        recordTestAnswer,
        finishTest,
        showToast,
        showModal,
        hideModal,
        toast,
        modal,
        feedback,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
