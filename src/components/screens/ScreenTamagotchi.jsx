import { useState } from 'react'

import AnimalIcon from '../AnimalIcon'

import FarmScene from '../farm/FarmScene'

import MobileScreenLayout from '../layout/MobileScreenLayout'

import { SCREENS, useGame } from '../../context/GameContext'

import { isImageIcon, resolveStageIcon } from '../../utils/animalIcon'



function getStageLabel(stage) {

  if (stage === 'egg') return 'Œuf'

  if (stage === 'baby') return 'Bébé 🌱'

  return 'Adulte ✨'

}



const actionBtnClass =

  'mx-auto flex h-11 w-[92%] max-w-full items-center justify-center gap-2 rounded-xl border-2 text-sm font-extrabold text-white transition-all active:translate-y-[4px] active:shadow-none'



const secondaryBtnClass =

  'mx-auto flex h-9 w-[92%] max-w-full items-center justify-center gap-1.5 rounded-xl border-2 border-[#8d6e3a] bg-white/85 text-xs font-extrabold text-[#5d3a00] shadow-[0_3px_0_#c8902a] transition-all active:translate-y-[3px] active:shadow-none'



export default function ScreenTamagotchi() {

  const { gameState, feedAnimal, switchScreen } = useGame()

  const [isFeeding, setIsFeeding] = useState(false)



  const animal = gameState.collection[gameState.currentAnimalKey]

  const stageInfo = animal.stages[animal.currentStage]
  const isFullyGrown = animal.currentStage === 'adult' || animal.completed

  const spriteSrc = resolveStageIcon(

    gameState.currentAnimalKey,

    animal.currentStage,

    stageInfo.icon,

  )



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



  const footer = (

    <div className="flex flex-col gap-2 px-[var(--screen-padding)] pb-2 pt-1">

      <button

        type="button"

        onClick={handleFeed}

        className={`${actionBtnClass} border-[#b71c1c] bg-gradient-to-b from-[#ff8a65] to-[#f4511e] shadow-[0_4px_0_#b71c1c]`}

      >

        🍎 Nourrir (1⭐)

      </button>

      <button

        type="button"

        onClick={() => switchScreen(SCREENS.LEVEL_SELECT)}

        className={`${actionBtnClass} border-[#4a148c] bg-gradient-to-b from-[#7c4dff] to-[#6610f2] shadow-[0_4px_0_#4a148c]`}

      >

        🎮 Jouer &amp; Apprendre

      </button>

      <button

        type="button"

        onClick={() => switchScreen(SCREENS.FARM_EXPLORE)}

        className={secondaryBtnClass}

      >

        🌾 Explorer la ferme

      </button>

    </div>

  )



  return (

    <MobileScreenLayout

      className="screen-tamagotchi font-sans"

      title="MA FERME"

      titleIcon="🐔"

      scrollable={false}

      footer={footer}

      mainClassName="relative flex min-h-0 flex-1 flex-col overflow-hidden"

    >

      <div className="pointer-events-none absolute inset-0 z-0">

        <FarmScene

          farmUpgrades={gameState.farmUpgrades}

          collection={gameState.collection}

          variant="compact"

        />

      </div>



      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-[var(--screen-padding)] py-2">

        <div className="farm-hero relative flex min-h-0 flex-1 flex-col">

          <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center py-1">

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

        </div>



        <div className="farm-info-card shrink-0 text-center">

          <h2 className="text-base font-extrabold text-[#5d3a00]">{stageInfo?.name || 'Poussin'}</h2>

          <p className="text-xs font-bold text-[#8d6e3a]">

            Âge : {animal?.age ?? 0} · Stade : {getStageLabel(animal.currentStage)}

          </p>

          {isFullyGrown && (
            <p className="farm-adult-hint mt-1.5 text-[0.72rem] font-extrabold leading-snug text-[#2e7d32]">
              Adulte ✨ — Tu peux choisir un autre animal dans la Collection
            </p>
          )}

          <div className="mt-2 flex items-center gap-2 rounded-full border border-[#8d6e3a]/60 bg-white/70 px-2 py-1">

            <span className="shrink-0 text-xs font-bold text-[#5d3a00]">🍽️ Faim</span>

            <progress className="hunger-bar" value={gameState.hunger} max={100} />

          </div>

        </div>

      </div>

    </MobileScreenLayout>

  )

}


