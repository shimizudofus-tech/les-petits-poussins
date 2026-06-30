import { useState } from 'react'
import AnimalIcon from '../AnimalIcon'
import MobileScreenLayout from '../layout/MobileScreenLayout'
import { CHICKEN_STAGE_ICONS } from '../../data/chickenAssets'
import { SCREENS, useGame } from '../../context/GameContext'
import { isImageIcon, resolveStageIcon } from '../../utils/animalIcon'

// EGG_ANIMALS kept in sync with animalIcon.js
const EGG_ANIMALS = new Set(['chicken', 'duck'])

const STAGE_ORDER = ['egg', 'baby', 'adult']
const getStageLabels = (animalKey, animal) => ({
  egg: EGG_ANIMALS.has(animalKey) ? 'Œuf' : 'Mystère',
  baby: animal?.stages?.baby?.name || 'Bébé',
  adult: 'Adulte',
})

function isStageReached(animal, stage) {
  if (animal.completed) return true
  return STAGE_ORDER.indexOf(stage) <= STAGE_ORDER.indexOf(animal.currentStage)
}

function getDisplayStage(animal) {
  return animal.displayStage ?? animal.currentStage
}

function getCollectionImageSrc(animalKey, animal) {
  if (!animal.unlocked) {
    // egg SVG for ovipares, barn door for mammals
    return resolveStageIcon(animalKey, 'egg', CHICKEN_STAGE_ICONS.egg)
  }
  const stage = getDisplayStage(animal)
  return resolveStageIcon(animalKey, stage, animal.stages[stage]?.icon)
}

function getStageLabel(animal, stage) {
  if (stage === 'adult') return 'Adulte ✨'
  if (stage === 'baby') return `${animal.stages.baby?.name || 'Bébé'} 🌱`
  return animal.stages.egg?.name || 'Œuf'
}

function StageSprite({ animalKey, animal, stage }) {
  const labels = getStageLabels(animalKey, animal)
  const src = resolveStageIcon(animalKey, stage, animal.stages[stage]?.icon)
  if (isImageIcon(src)) {
    return <img src={src} alt={labels[stage]} draggable={false} className="stage-picker-img" />
  }
  return <AnimalIcon icon={src} alt={labels[stage]} className="stage-picker-emoji" />
}

function StagePicker({ animalKey, animal, onSelect, onClose }) {
  const displayStage = getDisplayStage(animal)
  const labels = getStageLabels(animalKey, animal)
  return (
    <div className="stage-picker-overlay" onClick={onClose}>
      <div className="stage-picker-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="stage-picker-header">
          <span className="stage-picker-title">{animal.name}</span>
          <button type="button" className="stage-picker-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>
        <p className="stage-picker-hint">Choisis le stade à afficher</p>
        <div className="stage-picker-grid">
          {STAGE_ORDER.map((stage) => {
            const reached = isStageReached(animal, stage)
            const selected = displayStage === stage
            return (
              <button
                key={stage}
                type="button"
                disabled={!reached}
                onClick={() => reached && onSelect(stage)}
                className={`stage-picker-card${selected ? ' selected' : ''}${!reached ? ' locked' : ''}`}
              >
                {reached ? (
                  <StageSprite animalKey={animalKey} animal={animal} stage={stage} />
                ) : (
                  <span className="stage-picker-lock">🔒</span>
                )}
                <span className="stage-picker-label">{labels[stage]}</span>
                {selected && <span className="stage-picker-check">✓</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BackHeader({ title, titleIcon, onBack }) {
  return (
    <header className="screen-header shrink-0 border-b-[3px] border-[#c8902a] bg-gradient-to-br from-[#ffe082] to-[#ffcc02] px-[var(--screen-padding)] py-1.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/40 text-xl font-black text-[#5d3a00] active:scale-90"
          style={{ touchAction: 'manipulation' }}
          aria-label="Retour"
        >
          ←
        </button>
        <h1 className="min-w-0 flex-1 truncate text-center text-sm font-black uppercase tracking-wide text-[#5d3a00]">
          {titleIcon ? `${titleIcon} ` : ''}{title}
        </h1>
        <div className="h-11 w-11 shrink-0" />
      </div>
    </header>
  )
}

export default function ScreenCollection() {
  const { gameState, selectAnimal, showToast, switchScreen, setAnimalDisplayStage } = useGame()
  const [pickerKey, setPickerKey] = useState(null)
  const animals = Object.entries(gameState.collection)
  const unlockedCount = animals.filter(([, animal]) => animal.unlocked).length
  const totalCount = animals.length

  const handleCardClick = (key, animal) => {
    if (animal.unlocked) {
      setPickerKey(key)
    } else {
      showToast('🔒 Verrouillé !', '#9e9e9e')
    }
  }

  const handleStageSelect = (stage) => {
    if (pickerKey) {
      setAnimalDisplayStage(pickerKey, stage)
    }
  }

  const pickerAnimal = pickerKey ? gameState.collection[pickerKey] : null

  return (
    <MobileScreenLayout
      className="screen-collection"
      header={<BackHeader title="MA COLLECTION" titleIcon="📖" onBack={() => switchScreen(SCREENS.TAMAGOTCHI)} />}
      mainClassName="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden"
    >
      <p className="collection-subtitle shrink-0 px-3 py-1 text-center text-[0.68rem] font-bold leading-snug text-[#8d6e3a]">
        Fais grandir tes animaux pour les débloquer !
      </p>

      <div className="collection-content">
        <div className="collection-album">
          <div className="collection-grid">
            {animals.map(([key, animal]) => {
              const src = getCollectionImageSrc(key, animal)
              const isCurrent = gameState.currentAnimalKey === key
              const displayStage = getDisplayStage(animal)
              const isAdult = displayStage === 'adult' || animal.completed

              return (
                <div
                  key={key}
                  className={`collection-item text-center transition-transform duration-200 ${
                    animal.unlocked ? 'unlocked' : ''
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCardClick(key, animal)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCardClick(key, animal)}
                  style={{ cursor: 'pointer' }}
                >
                  {isAdult && animal.unlocked && (
                    <span className="collection-badge">Adulte</span>
                  )}

                  {isImageIcon(src) ? (
                    <img
                      src={src}
                      alt={animal.unlocked ? animal.name : 'Verrouillé'}
                      draggable={false}
                      className="collection-sprite mx-auto"
                    />
                  ) : (
                    <AnimalIcon
                      icon={src}
                      alt={animal.unlocked ? animal.name : 'Verrouillé'}
                      className="collection-sprite mx-auto block text-[3.75rem] leading-none"
                    />
                  )}

                  <span className="collection-label mt-2 block text-[0.72rem] font-extrabold text-[#5d3a00]">
                    {animal.unlocked ? animal.name : '???'}
                  </span>

                  {animal.unlocked && (
                    <>
                      <span className="collection-stage">{getStageLabel(animal, displayStage)}</span>
                      {isCurrent ? (
                        <span className="collection-current">Dans la ferme</span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); selectAnimal(key) }}
                          className="collection-choose-btn"
                        >
                          Choisir
                        </button>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => switchScreen(SCREENS.BADGES)}
          className="collection-badges-btn"
        >
          🏅 Voir mes badges
        </button>

        <p className="collection-progress" aria-live="polite">
          {unlockedCount} / {totalCount} animaux découverts
        </p>
      </div>

      {pickerAnimal && (
        <StagePicker
          animalKey={pickerKey}
          animal={pickerAnimal}
          onSelect={handleStageSelect}
          onClose={() => setPickerKey(null)}
        />
      )}
    </MobileScreenLayout>
  )
}
