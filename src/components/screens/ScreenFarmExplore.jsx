import { useState, useEffect, useCallback } from 'react'
import FarmSceneCompact from '../farm/FarmSceneCompact'
import AnimalIcon from '../AnimalIcon'
import MobileScreenLayout from '../layout/MobileScreenLayout'
import { getAnimalSound } from '../../data/animalSounds'
import { getAnimalInfo } from '../../data/animalInfo'
import { SCREENS, useGame } from '../../context/GameContext'
import { isImageIcon, resolveStageIcon } from '../../utils/animalIcon'
import { playAnimalSound } from '../../utils/audio'
import {
  HUNGER_INTERVAL,
  FEED_REWARD,
  isAnimalHungry,
  ensureCareInitialized,
} from '../../utils/animalCare'

function pickReaction(animalKey) {
  const { reactions } = getAnimalInfo(animalKey)
  return reactions[Math.floor(Math.random() * reactions.length)]
}

function AnimalInfoSheet({ animalKey, animal, onClose }) {
  const info = getAnimalInfo(animalKey)
  const sound = getAnimalSound(animalKey, animal.currentStage)
  const stage = animal.displayStage ?? animal.currentStage
  const spriteSrc = resolveStageIcon(animalKey, stage, animal.stages[stage]?.icon)

  return (
    <div className="stage-picker-overlay" onClick={onClose}>
      <div className="animal-info-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="stage-picker-header">
          <span className="stage-picker-title">{animal.name}</span>
          <button type="button" className="stage-picker-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <div className="animal-info-sprite-wrap">
          {isImageIcon(spriteSrc) ? (
            <img src={spriteSrc} alt={animal.name} draggable={false} className="animal-info-sprite-img" />
          ) : (
            <AnimalIcon icon={spriteSrc} alt={animal.name} className="animal-info-sprite-emoji" />
          )}
        </div>

        <div className="animal-info-rows">
          <div className="animal-info-row">
            <span className="animal-info-icon">🔊</span>
            <div className="animal-info-content">
              <span className="animal-info-label">Cri</span>
              <span className="animal-info-value">{sound}</span>
            </div>
            <button
              type="button"
              className="animal-info-speak-btn"
              onClick={() => playAnimalSound(animalKey, sound)}
              aria-label="Écouter"
            >▶</button>
          </div>
          <div className="animal-info-row">
            <span className="animal-info-icon">🍽️</span>
            <div className="animal-info-content">
              <span className="animal-info-label">Mange</span>
              <span className="animal-info-value">{info.eats}</span>
            </div>
          </div>
          <div className="animal-info-row animal-info-row--fact">
            <span className="animal-info-icon">💡</span>
            <div className="animal-info-content">
              <span className="animal-info-label">Le sais-tu ?</span>
              <span className="animal-info-value">{info.fact}</span>
            </div>
          </div>
        </div>

        <button type="button" className="animal-info-close-btn" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  )
}

export default function ScreenFarmExplore() {
  const { gameState, setGameState, switchScreen, showToast, showPaywall } = useGame()
  const premium = gameState.premium ?? false

  const [tappedKey, setTappedKey] = useState(null)
  const [tappedReaction, setTappedReaction] = useState(null)
  const [infoKey, setInfoKey] = useState(null)
  const [moveMode, setMoveMode] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [happy, setHappy] = useState({})   // { [key]: expiry ms } — bulle contente éphémère

  const unlockedAnimals = Object.entries(gameState.collection).filter(([, a]) => a.unlocked)
  const infoAnimal = infoKey ? gameState.collection[infoKey] : null
  const animalCare = gameState.animalCare ?? {}

  // Init douce : pose lastFedAt = maintenant pour les animaux débloqués sans entrée
  // (anciennes sauvegardes + animaux nouvellement débloqués) → jamais affamé d'un coup.
  useEffect(() => {
    const { care, changed } = ensureCareInitialized(gameState.collection, gameState.animalCare, Date.now())
    if (changed) setGameState((s) => ({ ...s, animalCare: care }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedAnimals.length])

  // Horloge légère : réévalue la faim + gère les bulles contentes intermittentes.
  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)
      setHappy((h) => {
        const next = {}
        for (const k in h) if (h[k] > t) next[k] = h[k]
        if (Math.random() < 0.14) {
          const fed = unlockedAnimals
            .map(([k]) => k)
            .filter((k) => !isAnimalHungry(animalCare, k, t) && !(next[k] > t))
          if (fed.length) next[fed[Math.floor(Math.random() * fed.length)]] = t + 2500
        }
        return next
      })
    }, 1500)
    return () => clearInterval(id)
  }, [unlockedAnimals, animalCare])

  // État par animal pour la scène : 'hungry' | 'happy' | null
  const careState = {}
  unlockedAnimals.forEach(([k]) => {
    if (isAnimalHungry(animalCare, k, now)) careState[k] = 'hungry'
    else if ((happy[k] ?? 0) > now) careState[k] = 'happy'
    else careState[k] = null
  })
  const hungryCount = unlockedAnimals.filter(([k]) => isAnimalHungry(animalCare, k, now)).length
  const totalCount = unlockedAnimals.length
  const missionActive = hungryCount > 0

  // Nourrir un animal affamé : lastFedAt = maintenant, bulle contente, récompense
  // quand tout est nourri (1 seule fois par cycle de 24h).
  const feedOne = (key) => {
    const t = Date.now()
    // Tout calculer depuis l'état le plus récent (s) → enchaînement correct
    // même si plusieurs animaux sont nourris coup sur coup.
    setGameState((s) => {
      const care = { ...(s.animalCare ?? {}) }
      care[key] = { lastFedAt: t }
      const stillHungry = Object.entries(s.collection)
        .filter(([, a]) => a.unlocked)
        .map(([k]) => k)
        .filter((k) => isAnimalHungry(care, k, t))

      let stars = s.stars ?? 0
      let rewardAt = s.feedRewardClaimedAt ?? 0
      if (stillHungry.length === 0 && t - rewardAt >= HUNGER_INTERVAL) {
        stars += FEED_REWARD
        rewardAt = t
        queueMicrotask(() =>
          showToast(`🌟 Bravo, tous les animaux sont nourris ! +${FEED_REWARD} ⭐`, '#66bb6a'),
        )
      }
      return { ...s, animalCare: care, stars, feedRewardClaimedAt: rewardAt }
    })
    setHappy((h) => ({ ...h, [key]: t + 3500 }))
  }

  const handleAnimalTap = useCallback((animalKey, animal) => {
    const sound = getAnimalSound(animalKey, animal.currentStage)
    playAnimalSound(animalKey, sound)

    const reaction = pickReaction(animalKey)
    setTappedKey(animalKey)
    setTappedReaction(reaction)
    setTimeout(() => setTappedKey(null), 500)

    if (isAnimalHungry(gameState.animalCare, animalKey, Date.now())) {
      // Gratuit : Explorer en lecture seule → nourrir = version complète.
      if (!premium) showPaywall('Nourris tes animaux avec la version complète !')
      else feedOne(animalKey)
    } else if (missionActive) {
      showToast(`😊 ${animal.name} n'a pas faim pour le moment`, '#66bb6a')
    } else {
      setInfoKey(animalKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.animalCare, gameState.stars, gameState.feedRewardClaimedAt, unlockedAnimals, missionActive, premium, setGameState, showToast, showPaywall])

  const handlePlace = useCallback((key, pos) => {
    setGameState((s) => ({
      ...s,
      farmPlacements: { ...(s.farmPlacements ?? {}), [key]: pos },
    }))
  }, [setGameState])

  const handleStore = useCallback((key) => {
    setGameState((s) => ({
      ...s,
      farmPlacements: { ...(s.farmPlacements ?? {}), [key]: { stored: true } },
    }))
  }, [setGameState])

  const footer = (
    <div className="flex gap-2 px-[var(--screen-padding)] pb-3 pt-2">
      {moveMode ? (
        <button
          type="button"
          onClick={() => setMoveMode(false)}
          className="farm-feed-btn flex-1"
        >
          ✓ Terminé
        </button>
      ) : (
        <>
          <button
            type="button"
            onPointerUp={() => switchScreen(SCREENS.TAMAGOTCHI)}
            className="farm-explore-back flex-1"
          >
            ← Retour
          </button>
          <button
            type="button"
            onClick={() => {
              if (!premium) { showPaywall('Aménage ta ferme avec la version complète !'); return }
              setInfoKey(null); setMoveMode(true)
            }}
            className="farm-feed-btn"
          >
            🛠️ Aménager{!premium ? ' 🔒' : ''}
          </button>
        </>
      )}
    </div>
  )

  return (
    <MobileScreenLayout
      className="screen-farm-explore"
      title="EXPLORER LA FERME"
      titleIcon="🌾"
      scrollable={false}
      mainClassName="relative flex min-h-0 flex-1 flex-col overflow-hidden"
      footer={footer}
    >
      {missionActive && !moveMode && (
        <div className="farm-mission-bar shrink-0">
          <span className="farm-mission-icon" aria-hidden="true">🍎</span>
          <span className="farm-mission-text">Nourris les animaux</span>
          <span className="farm-mission-count">{hungryCount} / {totalCount}</span>
        </div>
      )}

      <FarmSceneCompact
        farmShop={gameState.farmShop}
        collection={gameState.collection}
        onAnimalClick={handleAnimalTap}
        tappedKey={tappedKey}
        tappedReaction={tappedReaction}
        careState={careState}
        placements={gameState.farmPlacements}
        onPlace={handlePlace}
        onStore={handleStore}
        moveMode={moveMode}
      />

      {infoAnimal && !moveMode && (
        <AnimalInfoSheet
          animalKey={infoKey}
          animal={infoAnimal}
          onClose={() => setInfoKey(null)}
        />
      )}
    </MobileScreenLayout>
  )
}
