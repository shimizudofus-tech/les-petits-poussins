import { SCREENS, useGame } from '../context/GameContext'

const NAV_ITEMS = [
  { screen: SCREENS.TAMAGOTCHI, icon: '🏠', label: 'Ferme' },
  { screen: SCREENS.UPGRADE, icon: '✨', label: 'Améliorer' },
  { screen: SCREENS.COLLECTION, icon: '📖', label: 'Collection' },
]

export default function BottomNav() {
  const { gameState, switchScreen } = useGame()

  return (
    <nav className="bottom-nav flex w-full max-w-full shrink-0 items-stretch justify-around border-t-[3px] border-[#c8902a] bg-gradient-to-b from-[#fff8e7] to-[#ffefc0] px-1 py-1.5">
      {NAV_ITEMS.map(({ screen, icon, label }) => (
        <button
          key={screen}
          type="button"
          onClick={() => switchScreen(screen)}
          className={`bottom-nav-btn flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 transition-transform duration-100 ${
            gameState.currentScreen === screen ? 'active' : ''
          }`}
        >
          <span className="text-xl leading-none">{icon}</span>
          <span className="max-w-full truncate text-[0.62rem] font-extrabold text-[#5d3a00]">
            {label}
          </span>
        </button>
      ))}
    </nav>
  )
}
