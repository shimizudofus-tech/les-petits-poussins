import { SCREENS, useGame } from '../context/GameContext'
import { PARENT_RETURN_SESSION_KEY } from '../utils/parentContentStats'

export default function ParentSettingsButton() {
  const { gameState, switchScreen } = useGame()

  if (gameState.currentScreen === SCREENS.PARENT) {
    return null
  }

  const openParentScreen = () => {
    sessionStorage.setItem(PARENT_RETURN_SESSION_KEY, gameState.currentScreen)
    switchScreen(SCREENS.PARENT)
  }

  return (
    <button
      type="button"
      onClick={openParentScreen}
      className="parent-gear-btn shrink-0"
      aria-label="Espace parent"
      title="Espace parent"
    >
      ⚙️
    </button>
  )
}
