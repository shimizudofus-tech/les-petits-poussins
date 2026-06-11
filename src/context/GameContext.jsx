import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { resolveScreen, SCREENS } from '../constants/screens'
import {
  getUpgradeCost,
  isFarmUpgradeAtMax,
  isValidFarmUpgradeKey,
} from '../data/farmUpgrades'
import { createInitialGameState } from '../data/initialGameState'
import { setVoiceDisabledHandler } from '../utils/audio'
import { playError, playSuccess } from '../utils/audioManager'
import { getActiveAudioSettings, mergeAudioSettings, setActiveAudioSettings } from '../utils/audioSettings'
import { setMusicVolume, startBackgroundMusic, stopBackgroundMusic, unlockAudioOnFirstInteraction } from '../utils/music'
import { checkEvolution } from '../utils/evolution'
import { PARENT_RETURN_SESSION_KEY } from '../utils/parentContentStats'
import { clearSavedGameState, loadGameState, saveGameState } from '../utils/persistence'

export { SCREENS }

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(loadGameState)
  const [toast, setToast] = useState(null)
  const [modal, setModal] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const toastTimerRef = useRef(null)
  const feedbackTimerRef = useRef(null)
  const suppressPersistRef = useRef(false)

  const showToast = useCallback((message, color = '#ff8f00') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ message, color })
    toastTimerRef.current = setTimeout(() => setToast(null), 2000)
  }, [])

  const hideModal = useCallback(() => setModal(null), [])

  const showModal = useCallback(({ icon = '🎉', title = '', body = '', buttons = [] }) => {
    setModal({ icon, title, body, buttons })
  }, [])

  const switchScreen = useCallback((screen) => {
    const target = resolveScreen(screen, SCREENS.TAMAGOTCHI)
    setGameState((prev) => ({ ...prev, currentScreen: target }))
  }, [])

  const showFeedback = useCallback((correct) => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
    setFeedback({ correct })
    if (correct) {
      playSuccess()
      setGameState((prev) => ({ ...prev, stars: prev.stars + 2 }))
    } else {
      playError()
    }
    feedbackTimerRef.current = setTimeout(() => setFeedback(null), 1400)
  }, [])

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

  const unlockNextAnimal = useCallback(
    (currentAnimalKey, collection) => {
      const keys = Object.keys(collection)
      const idx = keys.indexOf(currentAnimalKey)
      if (idx + 1 >= keys.length) return collection

      const nextKey = keys[idx + 1]
      const nextAnimal = collection[nextKey]
      const updatedCollection = {
        ...collection,
        [nextKey]: { ...nextAnimal, unlocked: true },
      }

      setTimeout(() => {
        showModal({
          icon: '🎉',
          title: `${nextAnimal.name} débloqué !`,
          body: `Veux-tu t'occuper de ${nextAnimal.name} maintenant ?`,
          buttons: [
            {
              label: 'Choisir cet animal',
              type: 'primary',
              onClick: () => selectAnimal(nextKey),
            },
            { label: 'Continuer', type: 'secondary' },
          ],
        })
      }, 500)

      return updatedCollection
    },
    [showModal, selectAnimal],
  )

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

  const feedAnimal = useCallback(() => {
    setGameState((prev) => {
      if (prev.stars < 1) {
        queueMicrotask(() => showToast("❌ Plus d'étoiles ! Va jouer !", '#ef5350'))
        return prev
      }

      const animal = prev.collection[prev.currentAnimalKey]
      const isFullyGrown = animal.currentStage === 'adult' || animal.completed

      if (isFullyGrown) {
        queueMicrotask(() =>
          showToast(
            `${animal.name} est adulte ! Tu peux t'occuper d'un autre animal dans la Collection.`,
            '#ff8f00',
          ),
        )

        return {
          ...prev,
          stars: prev.stars - 1,
          hunger: Math.min(100, prev.hunger + 30),
        }
      }

      const agedAnimal = { ...animal, age: animal.age + 1 }
      const collectionWithAge = {
        ...prev.collection,
        [prev.currentAnimalKey]: agedAnimal,
      }
      let { collection, event } = checkEvolution(prev.currentAnimalKey, collectionWithAge)

      if (event?.type === 'hatch') {
        queueMicrotask(() => showToast(`🎊 L'œuf a éclos ! Bébé ${event.name} !`, '#7c4dff'))
      } else if (event?.type === 'adult') {
        queueMicrotask(() => showToast(`Bravo ! ${event.name} est adulte !`, '#7c4dff'))
        collection = unlockNextAnimal(prev.currentAnimalKey, collection)
      }

      return {
        ...prev,
        stars: prev.stars - 1,
        hunger: Math.min(100, prev.hunger + 30),
        collection,
      }
    })
  }, [showToast, unlockNextAnimal])

  useEffect(() => {
    if (suppressPersistRef.current) return
    saveGameState(gameState)
  }, [gameState])

  useEffect(() => {
    const settings = mergeAudioSettings(gameState.audioSettings)
    setActiveAudioSettings(settings)
    setMusicVolume(settings.musicVolume)
    if (!settings.musicEnabled) {
      stopBackgroundMusic()
    }
  }, [gameState.audioSettings])

  useEffect(() => {
    setVoiceDisabledHandler(() => showToast('Voix désactivée', '#8d6e3a'))
    unlockAudioOnFirstInteraction(() => getActiveAudioSettings())
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
        showFeedback,
        setSubject,
        selectBuilderItem,
        placeBuilderItem,
        upgradeFarmPart,
        selectAnimal,
        resetProgress,
        updateAudioSettings,
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
