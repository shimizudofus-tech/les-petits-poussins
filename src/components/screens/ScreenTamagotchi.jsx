import { useState } from 'react'
import AnimalIcon from '../AnimalIcon'
import MobileScreenLayout from '../layout/MobileScreenLayout'
import ParentSettingsButton from '../ParentSettingsButton'
import { SCREENS, NEW_ANIMAL_COST, useGame } from '../../context/GameContext'
import { isImageIcon, resolveStageIcon } from '../../utils/animalIcon'

export default function ScreenTamagotchi() {
  const { gameState, feedAnimal, adoptNewAnimal, switchScreen } = useGame()
  const [isFeeding, setIsFeeding] = useState(false)

  const animal = gameState.collection[gameState.currentAnimalKey]
  const displayStage = animal.displayStage ?? animal.currentStage
  const stageInfo = animal.stages[displayStage]
  const isFullyGrown = animal.currentStage === 'adult' || animal.completed

  const spriteSrc = resolveStageIcon(
    gameState.currentAnimalKey,
    displayStage,
    stageInfo.icon,
  )

  // Tant qu'il est dans l'œuf/la boîte : on ne révèle pas le nom de l'animal.
  const isEgg = animal.currentStage === 'egg'
  const displayName = isEgg ? 'Œuf mystère' : (stageInfo?.name || animal.name)

  // Progression de croissance (œuf → bébé → adulte) à partir de l'âge réel.
  const eggMax = animal.stages.egg?.nextAge ?? 1
  const babyMax = animal.stages.baby?.nextAge ?? eggMax + 1
  let growthPct = 100
  let growthCaption = '✨ Adulte !'
  if (animal.currentStage === 'egg') {
    growthPct = Math.max(0, Math.min(100, Math.round((animal.age / eggMax) * 100)))
    growthCaption = "🥚 Avant l'éclosion"
  } else if (animal.currentStage === 'baby') {
    const span = Math.max(1, babyMax - eggMax)
    growthPct = Math.max(0, Math.min(100, Math.round(((animal.age - eggMax) / span) * 100)))
    growthCaption = '🐣 Devient grand'
  }
  const stageRank = animal.currentStage === 'egg' ? 0 : animal.currentStage === 'baby' ? 1 : 2

  const handleFeed = () => {
    if (gameState.stars >= 1) {
      setIsFeeding(true)
      setTimeout(() => setIsFeeding(false), 220)
    }
    feedAnimal()
  }

  const spriteClass = `farm-animal-sprite drop-shadow-lg transition-transform duration-150 ${
    isFeeding ? 'animal-sprite-feeding' : 'animate-bounce'
  }`

  const header = (
    <header className="screen-header shrink-0 border-b-[3px] border-[#c8902a] bg-gradient-to-br from-[#ffe082] to-[#ffcc02] px-[var(--screen-padding)] py-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="status-chip status-chip--stars shrink-0">⭐ {gameState.stars}</div>
        <h1 className="min-w-0 flex-1 truncate text-center text-sm font-black uppercase tracking-wide text-[#5d3a00]">
          🐔 MA FERME
        </h1>
        <ParentSettingsButton />
      </div>
    </header>
  )

  const footer = (
    <div className="flex flex-col gap-2 px-[var(--screen-padding)] pb-2.5 pt-1">
      {isFullyGrown ? (
        <button
          type="button"
          onClick={adoptNewAnimal}
          className={`kid-btn kid-btn--feed${gameState.stars < NEW_ANIMAL_COST ? ' kid-btn--locked' : ''}`}
        >
          🥚 Nouvel animal ({NEW_ANIMAL_COST}⭐)
        </button>
      ) : (
        <button type="button" onClick={handleFeed} className="kid-btn kid-btn--feed">
          🍎 Nourrir (1⭐)
        </button>
      )}
      <button
        type="button"
        onClick={() => switchScreen(SCREENS.LEVEL_SELECT)}
        className="kid-btn kid-btn--play"
      >
        🎮 Jouer &amp; Apprendre
      </button>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => switchScreen(SCREENS.COLLECTION)}
          className="kid-btn kid-btn--ghost flex-1"
        >
          📖 Collection
        </button>
        <button
          type="button"
          onClick={() => switchScreen(SCREENS.FARM_EXPLORE)}
          className="kid-btn kid-btn--ghost flex-1"
        >
          🌾 Explorer
        </button>
        <button
          type="button"
          onClick={() => switchScreen(SCREENS.UPGRADE)}
          className="kid-btn kid-btn--ghost flex-1"
        >
          ✨ Améliorer
        </button>
      </div>
    </div>
  )

  return (
    <MobileScreenLayout
      className="screen-tamagotchi font-sans"
      header={header}
      scrollable={false}
      footer={footer}
      mainClassName="relative flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-[var(--screen-padding)] py-2">
        <div className="relative z-10 flex min-h-0 flex-1 items-end justify-center">
          {isImageIcon(spriteSrc) ? (
            <img
              src={spriteSrc}
              alt=""
              aria-hidden="true"
              draggable={false}
              className={spriteClass}
            />
          ) : (
            <AnimalIcon icon={spriteSrc} alt="" className={spriteClass} />
          )}
        </div>

        <div className="growth-tracker shrink-0">
          <div className="growth-steps" aria-hidden="true">
            <span className={`growth-step${stageRank >= 0 ? ' growth-step--done' : ''}${stageRank === 0 ? ' growth-step--active' : ''}`}>🥚</span>
            <span className={`growth-link${stageRank >= 1 ? ' growth-link--done' : ''}`} />
            <span className={`growth-step${stageRank >= 1 ? ' growth-step--done' : ''}${stageRank === 1 ? ' growth-step--active' : ''}`}>🐣</span>
            <span className={`growth-link${stageRank >= 2 ? ' growth-link--done' : ''}`} />
            <span className={`growth-step${stageRank >= 2 ? ' growth-step--done growth-step--active' : ''}`}>🏆</span>
          </div>
          <div className="growth-bar" role="progressbar" aria-valuenow={growthPct} aria-valuemin={0} aria-valuemax={100}>
            <div className="growth-bar-fill" style={{ width: `${growthPct}%` }} />
          </div>
          <span className="growth-caption">{isFullyGrown ? '✨ Adulte !' : `${growthCaption} · ${growthPct}%`}</span>
        </div>

        <div className="tamagotchi-home-card shrink-0 px-3 py-2.5 text-center">
          <h2 className="text-lg font-black text-[#5d3a00]">{displayName}</h2>
        </div>
      </div>
    </MobileScreenLayout>
  )
}
