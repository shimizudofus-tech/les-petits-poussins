import StatusBar from './StatusBar'
import BottomNav from './BottomNav'
import Toast from './Toast'
import Modal from './Modal'
import ScreenTamagotchi from './screens/ScreenTamagotchi'
import ScreenLevelSelect from './screens/ScreenLevelSelect'
import ScreenMaternelleSection from './screens/ScreenMaternelleSection'
import ScreenMinigameCP from './screens/ScreenMinigameCP'
import ScreenUpgrade from './screens/ScreenUpgrade'
import ScreenCollection from './screens/ScreenCollection'
import ScreenFarmExplore from './screens/ScreenFarmExplore'
import ScreenParent from './screens/ScreenParent'
import Feedback from './Feedback'
import { isValidScreen, resolveScreen, SCREENS } from '../constants/screens'
import { useGame } from '../context/GameContext'

const BOTTOM_NAV_SCREENS = new Set([
  SCREENS.TAMAGOTCHI,
  SCREENS.UPGRADE,
  SCREENS.COLLECTION,
])

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
  const showBottomNav = BOTTOM_NAV_SCREENS.has(screen)
  const screenKnown = isValidScreen(gameState.currentScreen)

  return (
    <div className="game-container phone-frame">
      <div className="game-shell phone-frame">
        <StatusBar />

        <div className="game-screen-slot">
          {!screenKnown ? (
            <ScreenFallback />
          ) : (
            <>
              {screen === SCREENS.TAMAGOTCHI && <ScreenTamagotchi />}
              {screen === SCREENS.LEVEL_SELECT && <ScreenLevelSelect />}
              {screen === SCREENS.MATERNELLE_SECTION && <ScreenMaternelleSection />}
              {screen === SCREENS.MINIGAME_CP && <ScreenMinigameCP />}
              {screen === SCREENS.UPGRADE && <ScreenUpgrade />}
              {screen === SCREENS.COLLECTION && <ScreenCollection />}
              {screen === SCREENS.FARM_EXPLORE && <ScreenFarmExplore />}
              {screen === SCREENS.PARENT && <ScreenParent />}
            </>
          )}
        </div>

        {showBottomNav && <BottomNav />}
      </div>

      <Toast />
      <Modal />
      <Feedback />
    </div>
  )
}
