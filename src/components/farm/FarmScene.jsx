import AnimalIcon from '../AnimalIcon'
import { getFarmAssetSrc } from '../../data/farmAssets'
import { getVisualLevel } from '../../data/farmUpgrades'
import { isImageIcon, resolveStageIcon } from '../../utils/animalIcon'

function FarmCloud({ className }) {
  return (
    <svg className={className} viewBox="0 0 88 44" aria-hidden="true">
      <g fill="#ffffff" opacity="0.9">
        <ellipse cx="26" cy="26" rx="20" ry="13" />
        <ellipse cx="46" cy="18" rx="16" ry="11" />
        <ellipse cx="62" cy="28" rx="18" ry="12" />
      </g>
    </svg>
  )
}

function FarmAssetImage({ part, level, className }) {
  if (!level) return null
  return (
    <img
      src={getFarmAssetSrc(part, level)}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`farm-scene-asset ${className}`}
    />
  )
}

function FarmAnimal({ animalKey, animal, className, onClick, interactive, tapped, reaction, feedMode, isFed }) {
  if (!animal?.unlocked) return null

  const stage = animal.currentStage
  const icon = resolveStageIcon(animalKey, stage, animal.stages[stage]?.icon)

  const content = isImageIcon(icon) ? (
    <img src={icon} alt="" draggable={false} className="farm-scene-animal-img" />
  ) : (
    <AnimalIcon icon={icon} alt="" className="farm-scene-animal-emoji" />
  )

  const idleClass = interactive ? 'farm-animal--wander' : 'farm-scene-animal--bob'
  const animClass = tapped ? 'farm-animal--wiggle' : idleClass

  if (interactive && onClick) {
    return (
      <button
        type="button"
        className={`farm-scene-animal farm-scene-animal--interactive ${animClass} ${className}${isFed ? ' farm-animal--fed' : ''}`}
        onClick={() => onClick(animalKey, animal)}
        aria-label={animal.name}
      >
        {feedMode && !isFed && (
          <span className="farm-animal-feed-badge" aria-hidden="true">🍎</span>
        )}
        {feedMode && isFed && (
          <span className="farm-animal-feed-badge farm-animal-feed-badge--done" aria-hidden="true">✅</span>
        )}
        {!feedMode && tapped && reaction && (
          <span className="farm-animal-reaction" aria-hidden="true">{reaction}</span>
        )}
        {content}
      </button>
    )
  }

  return (
    <div className={`farm-scene-animal farm-scene-animal--bob ${className}`} aria-hidden={!interactive}>
      {content}
    </div>
  )
}

export default function FarmScene({
  farmUpgrades,
  collection,
  variant = 'compact',
  onAnimalClick,
  tappedKey,
  tappedReaction,
  feedMode = false,
  fedSet,
}) {
  const barn = getVisualLevel(farmUpgrades?.barn ?? 1)
  const nest = getVisualLevel(farmUpgrades?.nest ?? 1)
  const fence = getVisualLevel(farmUpgrades?.fence ?? 1)
  const garden = getVisualLevel(farmUpgrades?.garden ?? 1)
  const decoration = getVisualLevel(farmUpgrades?.decoration ?? 0)
  const animalsLevel = getVisualLevel(farmUpgrades?.animals ?? 1)

  const unlockedAnimals = Object.entries(collection ?? {}).filter(([, a]) => a.unlocked)
  const visibleAnimals = variant === 'large'
    ? unlockedAnimals
    : unlockedAnimals.slice(0, Math.max(1, animalsLevel + 1))
  const interactive = variant === 'large' && typeof onAnimalClick === 'function'

  return (
    <div
      className={`farm-scene-visual farm-scene-visual--${variant}`}
      aria-hidden={variant === 'compact'}
    >
      <div className="farm-scene-sky">
        <div className="farm-scene-sun" aria-hidden="true" />
      </div>

      <div className="farm-scene-clouds" aria-hidden="true">
        <FarmCloud className="farm-scene-cloud farm-scene-cloud--1" />
        <FarmCloud className="farm-scene-cloud farm-scene-cloud--2" />
        <FarmCloud className="farm-scene-cloud farm-scene-cloud--3" />
      </div>

      <div className="farm-scene-hill farm-scene-hill--back" />
      <div className="farm-scene-hill farm-scene-hill--front" />

      {barn > 0 && (
        <div className={`farm-scene-layer farm-scene-barn farm-scene-barn--lv${barn}`}>
          <FarmAssetImage part="barn" level={barn} className="farm-scene-barn-img" />
        </div>
      )}

      {fence > 0 && (
        <div className={`farm-scene-layer farm-scene-fence farm-scene-fence--lv${fence}`}>
          <FarmAssetImage part="fence" level={fence} className="farm-scene-fence-img" />
        </div>
      )}

      {garden > 0 && (
        <>
          <div className={`farm-scene-layer farm-scene-garden farm-scene-garden--left farm-scene-garden--lv${garden}`}>
            <FarmAssetImage part="garden" level={garden} className="farm-scene-garden-img farm-scene-sway" />
          </div>
          {garden < 3 && (
            <div className={`farm-scene-layer farm-scene-garden farm-scene-garden--right farm-scene-garden--lv${garden}`}>
              <FarmAssetImage
                part="garden"
                level={Math.max(1, garden - 1) || 1}
                className="farm-scene-garden-img farm-scene-garden-img--small farm-scene-sway farm-scene-sway--delay"
              />
            </div>
          )}
        </>
      )}

      {nest > 0 && (
        <div className={`farm-scene-layer farm-scene-nest farm-scene-nest--lv${nest}`}>
          <FarmAssetImage part="nest" level={nest} className="farm-scene-nest-img" />
        </div>
      )}

      {decoration > 0 && (
        <div className={`farm-scene-layer farm-scene-deco farm-scene-deco--lv${decoration}`}>
          <FarmAssetImage part="decoration" level={decoration} className="farm-scene-deco-img farm-scene-sway" />
        </div>
      )}

      <div className={`farm-scene-layer farm-scene-pen farm-scene-pen--lv${animalsLevel}`}>
        {visibleAnimals.map(([key, animal], index) => (
          <FarmAnimal
            key={key}
            animalKey={key}
            animal={animal}
            className={`farm-scene-animal--slot-${index}`}
            onClick={onAnimalClick}
            interactive={interactive}
            tapped={tappedKey === key}
            reaction={tappedReaction}
            feedMode={feedMode}
            isFed={fedSet?.has(key) ?? false}
          />
        ))}
      </div>

      <div className="farm-scene-foreground" aria-hidden="true">
        <span className="farm-scene-grass-tuft farm-scene-grass-tuft--1" />
        <span className="farm-scene-grass-tuft farm-scene-grass-tuft--2" />
        <span className="farm-scene-grass-tuft farm-scene-grass-tuft--3" />
      </div>
    </div>
  )
}
