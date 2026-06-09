import MobileScreenLayout from '../layout/MobileScreenLayout'
import { SCREENS, useGame } from '../../context/GameContext'

const MATERNELLE_LEVELS = [
  {
    key: 'petite',
    icon: '🐣',
    title: 'Petite Section',
    subtitle: 'Petits · 3–4 ans',
    badge: 'Toucher & reconnaître',
    gradient: 'from-[#e8f5e9] to-[#f3e5f5]',
    border: 'border-[#ce93d8]',
  },
  {
    key: 'moyenne',
    icon: '🐥',
    title: 'Moyenne Section',
    subtitle: 'Moyens · 4–5 ans',
    badge: 'Associer & comparer',
    gradient: 'from-[#fff8e7] to-[#e8f5e9]',
    border: 'border-[#aed581]',
  },
  {
    key: 'grande',
    icon: '🐔',
    title: 'Grande Section',
    subtitle: 'Grands · 5–6 ans',
    badge: 'Bientôt',
    gradient: 'from-[#fff3e0] to-[#e3f2fd]',
    border: 'border-[#ffb74d]',
  },
]

export default function ScreenLevelSelect() {
  const { switchScreen, setGameState } = useGame()

  const goMaternelle = (section) => {
    setGameState((prev) => ({
      ...prev,
      maternelleSection: section,
      currentSubject: {
        ...prev.currentSubject,
        [section]:
          prev.currentSubject?.[section] ??
          (section === 'moyenne' ? 'colors' : section === 'petite' ? 'coloring' : 'colors'),
      },
    }))
    switchScreen(SCREENS.MATERNELLE_SECTION)
  }

  const footer = (
    <div className="px-4 pb-3 pt-1">
      <button
        type="button"
        onClick={() => switchScreen(SCREENS.TAMAGOTCHI)}
        className="close-btn mx-auto block w-[90%] max-w-full cursor-pointer rounded-[18px] border-none px-6 py-3 font-sans text-sm font-extrabold text-white transition-transform duration-100 active:translate-y-[3px]"
      >
        🏡 Retour à la ferme
      </button>
    </div>
  )

  return (
    <MobileScreenLayout
      className="screen-level-select bg-gradient-to-b from-[#e3f2fd] to-[#fff8e7]"
      title="Choisis ton niveau"
      titleIcon="🎒"
      footer={footer}
      mainClassName="px-4 py-3"
    >
      <div className="flex w-full max-w-full flex-col gap-3">
        <p className="text-center text-[0.72rem] font-bold text-[#6d4c41]">Maternelle</p>

        {MATERNELLE_LEVELS.map(({ key, icon, title, subtitle, badge, gradient, border }) => (
          <div
            key={key}
            role="button"
            tabIndex={0}
            onClick={() => goMaternelle(key)}
            onKeyDown={(e) => e.key === 'Enter' && goMaternelle(key)}
            className={`level-card maternelle flex w-full max-w-full cursor-pointer items-center gap-3 rounded-[20px] border-[3px] ${border} bg-gradient-to-br ${gradient} p-3 transition-[transform,box-shadow] duration-150 active:scale-[0.97]`}
          >
            <div className="shrink-0 text-4xl">{icon}</div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black text-[#3e2700]">{title}</div>
              <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">{subtitle}</div>
              <div className="mt-1 inline-block rounded-[10px] bg-white/60 px-2 py-0.5 text-[0.68rem] font-extrabold text-[#5d3a00]">
                {badge}
              </div>
            </div>
          </div>
        ))}

        <p className="mt-1 text-center text-[0.72rem] font-bold text-[#6d4c41]">Primaire</p>

        <div
          role="button"
          tabIndex={0}
          onClick={() => switchScreen(SCREENS.MINIGAME_CP)}
          onKeyDown={(e) => e.key === 'Enter' && switchScreen(SCREENS.MINIGAME_CP)}
          className="level-card cp flex w-full max-w-full cursor-pointer items-center gap-3 rounded-[20px] border-[3px] border-[#64b5f6] bg-gradient-to-br from-[#fff8e7] to-[#e3f2fd] p-3 transition-[transform,box-shadow] duration-150 active:scale-[0.97]"
        >
          <div className="shrink-0 text-4xl">✏️</div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-black text-[#3e2700]">CP</div>
            <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">6 à 7 ans</div>
            <div className="mt-1 inline-block rounded-[10px] bg-white/60 px-2 py-0.5 text-[0.68rem] font-extrabold text-[#5d3a00]">
              Maths &amp; Dictée
            </div>
          </div>
        </div>
      </div>
    </MobileScreenLayout>
  )
}
