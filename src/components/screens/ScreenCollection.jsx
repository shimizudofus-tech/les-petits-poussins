import AnimalIcon from '../AnimalIcon'
import MobileScreenLayout from '../layout/MobileScreenLayout'
import { CHICKEN_STAGE_ICONS } from '../../data/chickenAssets'
import { useGame } from '../../context/GameContext'
import { isImageIcon, resolveStageIcon } from '../../utils/animalIcon'

function getStageLabel(stage) {
  if (stage === 'adult') return 'Adulte ✨'
  if (stage === 'baby') return 'Bébé 🌱'
  return 'Œuf'
}

function getCollectionImageSrc(animalKey, animal) {
  if (!animal.unlocked) {
    if (animalKey === 'chicken') return CHICKEN_STAGE_ICONS.egg
    const eggIcon = animal.stages.egg.icon
    return isImageIcon(eggIcon) ? eggIcon : CHICKEN_STAGE_ICONS.egg
  }
  const stage = animal.currentStage
  return resolveStageIcon(animalKey, stage, animal.stages[stage].icon)
}

export default function ScreenCollection() {
  const { gameState, selectAnimal, showToast } = useGame()
  const animals = Object.entries(gameState.collection)
  const unlockedCount = animals.filter(([, animal]) => animal.unlocked).length
  const totalCount = animals.length

  const handleLockedClick = () => {
    showToast('🔒 Verrouillé !', '#9e9e9e')
  }

  return (
    <MobileScreenLayout
      className="screen-collection"
      title="MA COLLECTION"
      titleIcon="📖"
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
              const isAdult = animal.currentStage === 'adult' || animal.completed

              return (
                <div
                  key={key}
                  className={`collection-item text-center transition-transform duration-200 ${
                    animal.unlocked ? 'unlocked' : ''
                  }`}
                >
                  {isAdult && animal.unlocked && (
                    <span className="collection-badge">Adulte</span>
                  )}

                  {animal.unlocked ? (
                    isImageIcon(src) ? (
                      <img
                        src={src}
                        alt={animal.name}
                        draggable={false}
                        className="collection-sprite mx-auto"
                      />
                    ) : (
                      <AnimalIcon
                        icon={src}
                        alt={animal.name}
                        className="collection-sprite mx-auto block text-[3.75rem] leading-none"
                      />
                    )
                  ) : (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={handleLockedClick}
                      onKeyDown={(e) => e.key === 'Enter' && handleLockedClick()}
                      className="cursor-pointer"
                    >
                      {isImageIcon(src) ? (
                        <img
                          src={src}
                          alt="Verrouillé"
                          draggable={false}
                          className="collection-sprite mx-auto"
                        />
                      ) : (
                        <AnimalIcon
                          icon={src}
                          alt="Verrouillé"
                          className="collection-sprite mx-auto block text-[3.75rem] leading-none"
                        />
                      )}
                    </div>
                  )}

                  <span className="collection-label mt-2 block text-[0.72rem] font-extrabold text-[#5d3a00]">
                    {animal.unlocked ? animal.name : '???'}
                  </span>

                  {animal.unlocked && (
                    <>
                      <span className="collection-stage">{getStageLabel(animal.currentStage)}</span>
                      {isCurrent ? (
                        <span className="collection-current">Dans la ferme</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => selectAnimal(key)}
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

        <p className="collection-progress" aria-live="polite">
          {unlockedCount} / {totalCount} animaux découverts
        </p>
      </div>
    </MobileScreenLayout>
  )
}
