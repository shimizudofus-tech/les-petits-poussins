import { useState } from 'react'
import AnimalIcon from '../AnimalIcon'
import AppIcon from '../AppIcon'
import { getSeasonalEvent } from '../../data/seasonalEvents'
import StreakRewardsBar from '../StreakRewardsBar'
import { useT } from '../../i18n/useT'
import MobileScreenLayout from '../layout/MobileScreenLayout'
import ParentSettingsButton from '../ParentSettingsButton'
import { SCREENS, NEW_ANIMAL_COST, useGame } from '../../context/GameContext'
import { isImageIcon, resolveStageIcon } from '../../utils/animalIcon'
import { playAnimalSound } from '../../utils/audio'
import { getAnimalSound } from '../../data/animalSounds'

export default function ScreenTamagotchi() {
  const { gameState, feedAnimal, adoptNewAnimal, switchScreen, renameAnimal } = useGame()
  const t = useT()
  const [isFeeding, setIsFeeding] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const seasonal = getSeasonalEvent()

  const animal = gameState.collection[gameState.currentAnimalKey]
  const displayStage = animal.displayStage ?? animal.currentStage
  const stageInfo = animal.stages[displayStage]
  const isFullyGrown = animal.currentStage === 'adult' || animal.completed

  // Tant qu'il est dans l'œuf/la boîte : on ne révèle pas le nom de l'animal.
  const isEgg = animal.currentStage === 'egg'
  const displayName = isEgg ? t('home.eggMystery') : (animal.customName || stageInfo?.name || animal.name)

  // Progression de croissance (œuf → bébé → adulte) à partir de l'âge réel.
  const eggMax = animal.stages.egg?.nextAge ?? 1
  const babyMax = animal.stages.baby?.nextAge ?? eggMax + 1
  let growthPct = 100
  let growthCaption = `✨ ${t('home.adult')}`
  if (animal.currentStage === 'egg') {
    growthPct = Math.max(0, Math.min(100, Math.round((animal.age / eggMax) * 100)))
    growthCaption = `🥚 ${t('home.beforeHatch')}`
  } else if (animal.currentStage === 'baby') {
    const span = Math.max(1, babyMax - eggMax)
    growthPct = Math.max(0, Math.min(100, Math.round(((animal.age - eggMax) / span) * 100)))
    growthCaption = `🐣 ${t('home.growing')}`
  }
  const stageRank = animal.currentStage === 'egg' ? 0 : animal.currentStage === 'baby' ? 1 : 2

  // Niveau d'ouverture de l'œuf/cadeau selon la progression (0..3).
  const openLevel = growthPct >= 85 ? 3 : growthPct >= 55 ? 2 : growthPct >= 25 ? 1 : 0
  const spriteSrc = resolveStageIcon(
    gameState.currentAnimalKey,
    displayStage,
    stageInfo.icon,
    openLevel,
  )

  const handleFeed = () => {
    if (gameState.stars >= 1) {
      setIsFeeding(true)
      setTimeout(() => setIsFeeding(false), 220)
    }
    feedAnimal()
  }

  // Clic sur l'animal → son. (Pas de cri pour l'œuf.)
  const handleSpriteClick = () => {
    if (isEgg) return
    setIsFeeding(true)
    setTimeout(() => setIsFeeding(false), 220)
    playAnimalSound(gameState.currentAnimalKey, getAnimalSound(gameState.currentAnimalKey, animal.currentStage))
  }

  const spriteClass = `farm-animal-sprite drop-shadow-lg transition-transform duration-150 ${
    isFeeding ? 'animal-sprite-feeding' : 'animate-bounce'
  }`

  const header = (
    <header className="screen-header shrink-0 border-b-[3px] border-[#c8902a] bg-gradient-to-br from-[#ffe082] to-[#ffcc02] px-[var(--screen-padding)] py-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex shrink-0 items-center gap-1.5">
          <div className="status-chip status-chip--stars inline-flex items-center gap-1">
            <AppIcon name="star" size={18} /> {gameState.stars}
          </div>
          {(gameState.dayStreak || 0) > 1 && (
            <div className="status-chip status-chip--streak inline-flex items-center gap-1" title={`${gameState.dayStreak} jours d'affilée`}>
              <AppIcon name="flame" size={16} /> {gameState.dayStreak}
            </div>
          )}
        </div>
        <h1 className="min-w-0 flex-1 truncate text-center text-sm font-black uppercase tracking-wide text-[#5d3a00] inline-flex items-center justify-center gap-1.5">
          <AppIcon name="henhead" size={20} /> {t('home.farm')}
        </h1>
        <ParentSettingsButton />
      </div>
      {seasonal && (
        <div className="seasonal-banner" style={{ background: seasonal.tint }}>
          <span>{seasonal.emoji} {t(`season.${seasonal.id}`)} {seasonal.emoji}</span>
        </div>
      )}
    </header>
  )

  const footer = (
    <div className="flex flex-col gap-2 px-[var(--screen-padding)] pb-2.5 pt-1">
      {isFullyGrown ? (
        <button
          type="button"
          onClick={adoptNewAnimal}
          className={`kid-btn kid-btn--feed inline-flex items-center justify-center gap-1.5${gameState.stars < NEW_ANIMAL_COST ? ' kid-btn--locked' : ''}`}
        >
          <AppIcon name="egg" size={22} /> {t('home.newAnimal')} ({NEW_ANIMAL_COST}<AppIcon name="star" size={16} />)
        </button>
      ) : (
        <button type="button" onClick={handleFeed} className="kid-btn kid-btn--feed inline-flex items-center justify-center gap-1.5">
          <AppIcon name="apple" size={22} /> {t('home.feed')} (1<AppIcon name="star" size={16} />)
        </button>
      )}
      <button
        type="button"
        onClick={() => switchScreen(SCREENS.LEVEL_SELECT)}
        className="kid-btn kid-btn--play inline-flex items-center justify-center gap-1.5"
      >
        <AppIcon name="play" size={24} /> {t('home.play')}
      </button>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => switchScreen(SCREENS.COLLECTION)}
          className="kid-btn kid-btn--ghost flex-1 inline-flex items-center justify-center gap-1"
        >
          <AppIcon name="book" size={20} /> {t('home.collection')}
        </button>
        <button
          type="button"
          onClick={() => switchScreen(SCREENS.FARM_EXPLORE)}
          className="kid-btn kid-btn--ghost flex-1 inline-flex items-center justify-center gap-1"
        >
          <AppIcon name="wheat" size={20} /> {t('home.explore')}
        </button>
        <button
          type="button"
          onClick={() => switchScreen(SCREENS.UPGRADE)}
          className="kid-btn kid-btn--ghost flex-1 inline-flex items-center justify-center gap-1"
        >
          <AppIcon name="sparkle" size={20} /> {t('home.upgrade')}
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
        <div
          className={`relative z-10 flex min-h-0 flex-1 items-end justify-center${isEgg ? '' : ' cursor-pointer'}`}
          onClick={handleSpriteClick}
          role={isEgg ? undefined : 'button'}
          aria-label={isEgg ? undefined : 'Écouter le cri'}
        >
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
            <span className={`growth-step${stageRank >= 0 ? ' growth-step--done' : ''}${stageRank === 0 ? ' growth-step--active' : ''}`}><AppIcon name="egg" size={20} /></span>
            <span className={`growth-link${stageRank >= 1 ? ' growth-link--done' : ''}`} />
            <span className={`growth-step${stageRank >= 1 ? ' growth-step--done' : ''}${stageRank === 1 ? ' growth-step--active' : ''}`}><AppIcon name="hatch" size={20} /></span>
            <span className={`growth-link${stageRank >= 2 ? ' growth-link--done' : ''}`} />
            <span className={`growth-step${stageRank >= 2 ? ' growth-step--done growth-step--active' : ''}`}><AppIcon name="trophy" size={20} /></span>
          </div>
          <div className="growth-bar" role="progressbar" aria-valuenow={growthPct} aria-valuemin={0} aria-valuemax={100}>
            <div className="growth-bar-fill" style={{ width: `${growthPct}%` }} />
          </div>
          <span className="growth-caption">{isFullyGrown ? `✨ ${t('home.adult')}` : `${growthCaption} · ${growthPct}%`}</span>
        </div>

        <StreakRewardsBar />

        <div className="tamagotchi-home-card shrink-0 px-3 py-2.5 text-center">
          {editingName && !isEgg ? (
            <input
              autoFocus
              defaultValue={animal.customName || (stageInfo?.name || animal.name)}
              maxLength={14}
              className="animal-name-input"
              onBlur={(e) => { renameAnimal(e.target.value); setEditingName(false) }}
              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur() }}
            />
          ) : (
            <button
              type="button"
              className="animal-name-btn"
              onClick={() => !isEgg && setEditingName(true)}
              disabled={isEgg}
            >
              <h2 className="text-lg font-black text-[#5d3a00]">
                {displayName}{!isEgg && <span className="animal-name-edit"> ✏️</span>}
              </h2>
            </button>
          )}
        </div>
      </div>
    </MobileScreenLayout>
  )
}
