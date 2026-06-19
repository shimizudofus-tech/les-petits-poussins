import Toast from './Toast'
import Modal from './Modal'
import ScreenTamagotchi from './screens/ScreenTamagotchi'
import ScreenLevelSelect from './screens/ScreenLevelSelect'
import ScreenMaternelleSection from './screens/ScreenMaternelleSection'
import ScreenMinigameCP from './screens/ScreenMinigameCP'
import ScreenMinigameCe1 from './screens/ScreenMinigameCe1'
import ScreenMinigameCe2 from './screens/ScreenMinigameCe2'
import ScreenUpgrade from './screens/ScreenUpgrade'
import ScreenCollection from './screens/ScreenCollection'
import ScreenFarmExplore from './screens/ScreenFarmExplore'
import ScreenParent from './screens/ScreenParent'
import ScreenBadges from './screens/ScreenBadges'
import Feedback from './Feedback'
import EvolvingBackground from './EvolvingBackground'
import { computeFarmLevel } from '../data/farmUpgrades'
import { isValidScreen, resolveScreen, SCREENS } from '../constants/screens'
import { useGame } from '../context/GameContext'
import { useEffect } from 'react'
import { setSceneMusic } from '../utils/softAudio'

// Écrans d'exercices → musique coupée (concentration).
const EXERCISE_SCREENS = new Set([
  SCREENS.MINIGAME_CP, SCREENS.MINIGAME_CE1, SCREENS.MINIGAME_CE2, SCREENS.MATERNELLE_SECTION,
])
function sceneForScreen(screen) {
  if (EXERCISE_SCREENS.has(screen)) return null
  if (screen === SCREENS.FARM_EXPLORE) return 'farm'
  return 'home'
}

function ScreenFallback() {
  const { switchScreen } = useGame()

  return (
    <div className="screen-fallback flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-extrabold text-[#5d3a00]">Écran indisponible</p>
      <button
        type="button"
        onClick={() => switchScreen(SCREENS.TAMAGOTCHI)}
        className="farm-explore-back w-full max-w-[280px]"
      >
        Retour à la ferme
      </button>
    </div>
  )
}

export default function GameContainer() {
  const { gameState } = useGame()
  const screen = resolveScreen(gameState.currentScreen)
  const screenKnown = isValidScreen(gameState.currentScreen)

  const animal = gameState.collection?.[gameState.currentAnimalKey]
  const stage = animal?.currentStage ?? 'egg'
  const farmLevel = computeFarmLevel(gameState.farmUpgrades)

  // Musique d'ambiance selon l'écran (accueil / ferme / silence en exercice).
  useEffect(() => {
    setSceneMusic(sceneForScreen(screen))
  }, [screen])

  return (
    <div className="game-container phone-frame">
      <div className="game-shell phone-frame">
        <EvolvingBackground stage={stage} farmLevel={farmLevel} />

        <div className="game-shell-content relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="game-screen-slot">
            {!screenKnown ? (
              <ScreenFallback />
            ) : (
              <>
                {screen === SCREENS.TAMAGOTCHI && <ScreenTamagotchi />}
                {screen === SCREENS.LEVEL_SELECT && <ScreenLevelSelect />}
                {screen === SCREENS.MATERNELLE_SECTION && <ScreenMaternelleSection />}
                {screen === SCREENS.MINIGAME_CP && <ScreenMinigameCP />}
                {screen === SCREENS.MINIGAME_CE1 && <ScreenMinigameCe1 />}
                {screen === SCREENS.MINIGAME_CE2 && <ScreenMinigameCe2 />}
                {screen === SCREENS.UPGRADE && <ScreenUpgrade />}
                {screen === SCREENS.COLLECTION && <ScreenCollection />}
                {screen === SCREENS.FARM_EXPLORE && <ScreenFarmExplore />}
                {screen === SCREENS.PARENT && <ScreenParent />}
                {screen === SCREENS.BADGES && <ScreenBadges />}
              </>
            )}
          </div>
        </div>
      </div>

      <Toast />
      <Modal />
      <Feedback />
    </div>
  )
}
