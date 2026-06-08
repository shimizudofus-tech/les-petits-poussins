import { useState } from 'react'
import FarmScene from '../farm/FarmScene'
import MobileScreenLayout from '../layout/MobileScreenLayout'
import { getAnimalSound } from '../../data/animalSounds'
import { SCREENS, useGame } from '../../context/GameContext'

export default function ScreenFarmExplore() {
  const { gameState, switchScreen, showToast } = useGame()
  const [bubble, setBubble] = useState(null)

  const handleAnimalClick = (animalKey, animal) => {
    const text = getAnimalSound(animalKey, animal.currentStage)
    setBubble({ name: animal.name, text })
    showToast(`${animal.name} : ${text}`, '#66bb6a')
  }

  return (
    <MobileScreenLayout
      className="screen-farm-explore"
      title="EXPLORER LA FERME"
      titleIcon="🌾"
      scrollable={false}
      mainClassName="relative flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="farm-explore-scene flex min-h-0 flex-1 flex-col">
        <FarmScene
          farmUpgrades={gameState.farmUpgrades}
          collection={gameState.collection}
          variant="large"
          onAnimalClick={handleAnimalClick}
        />

        {bubble && (
          <div className="farm-explore-bubble" role="status" aria-live="polite">
            <strong>{bubble.name}</strong>
            <span>{bubble.text}</span>
          </div>
        )}
      </div>

      <div className="px-[var(--screen-padding)] pb-3 pt-2">
        <button
          type="button"
          onClick={() => switchScreen(SCREENS.TAMAGOTCHI)}
          className="farm-explore-back w-full"
        >
          ← Retour
        </button>
      </div>
    </MobileScreenLayout>
  )
}
