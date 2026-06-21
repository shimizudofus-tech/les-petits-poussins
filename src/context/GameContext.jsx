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
import { setVoiceDisabledHandler } from '../utils/audio'
import { playError, playSuccess } from '../utils/audioManager'
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

// Joyful, kid-friendly encouragements rotated on each answer so the maternelle
// feedback stays lively instead of repeating the same word every time.
const KID_CHEERS = ['Bravo !', 'Super !', 'Génial !', 'Bien joué !', 'Hourra !', 'Trop fort !', 'Champion !', 'Magnifique !']
const KID_RETRIES = ['Encore !', 'Presque !', 'Réessaie !', 'On continue !']

function pickCheer(correct) {
  const pool = correct ? KID_CHEERS : KID_RETRIES
  return pool[Math.floor(Math.random() * pool.length)]
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

  const showModal = useCallback(({ icon = '🎉', title = '', body = '', buttons = [] }) => {
    setModal({ icon, title, body, buttons })
  }, [])

  // Abonnement (1,99 €/mois). Stub : le paiement réel (Google Play Billing /
  // RevenueCat via l'app native Capacitor) sera branché ici plus tard.
  const subscribe = useCallback(() => {
    showToast('Abonnement bientôt disponible 🙂', '#7c4dff')
  }, [showToast])

  // Met à jour l'accès premium (utilisé par le paiement et le bouton test parent).
  const setPremium = useCallback((value) => {
    setGameState((prev) => ({ ...prev, premium: Boolean(value) }))
  }, [])

  // Fenêtre "Version complète" déclenchée quand on touche du contenu verrouillé.
  const showPaywall = useCallback(
    (body = 'Débloque CP, CE1, CE2, tous les animaux et toute la ferme !') => {
      showModal({
        icon: '⭐',
        title: 'Version complète — 1,99 €/mois',
        body,
        buttons: [
          { label: "S'abonner", type: 'primary', onClick: () => subscribe() },
          { label: 'Plus tard', type: 'secondary' },
        ],
      })
    },
    [showModal, subscribe],
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

        return { ...prev, achievements, stars: prev.stars + bonusStars, reviewStats }
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
      setFeedback({ correct, message: pickCheer(correct) })
      const inTest = Boolean(activeTestRef.current)
      if (correct) {
        playSuccess()
        if (!inTest) {
          setGameState((prev) => ({ ...prev, stars: prev.stars + 2 }))
        }
      } else {
        playError()
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
    [recordExerciseResult],
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
      const lockedKeys = Object.keys(prev.collection).filter((key) => !prev.collection[key].unlocked)
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
      queueMicrotask(() =>
        showModal({
          icon: '🎁',
          title: `Cadeau du jour — Jour ${streak} !`,
          body: `+${reward} ⭐ pour ta visite. Reviens demain pour plus !`,
          buttons: [{ label: 'Merci !', type: 'primary' }],
        }),
      )
      return { ...prev, stars: (prev.stars || 0) + reward, lastRewardDate: today, dayStreak: streak }
    })
  }, [showModal])

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

      return {
        ...prev,
        stars: prev.stars - 1,
        hunger: Math.min(100, prev.hunger + 30),
        collection,
      }
    })
  }, [showToast])

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
