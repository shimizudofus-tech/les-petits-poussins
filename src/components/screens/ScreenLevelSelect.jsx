import MobileScreenLayout from '../layout/MobileScreenLayout'
import { SCREENS, useGame } from '../../context/GameContext'

const MATERNELLE_LEVELS = [
  {
    key: 'petite',
    icon: '🐣',
    title: 'Petite Section',
    subtitle: 'Petits · 3–4 ans',
    badge: 'Toucher & reconnaître',
    tint: 'linear-gradient(135deg, #f3e5f5, #e1bee7)',
  },
  {
    key: 'moyenne',
    icon: '🐥',
    title: 'Moyenne Section',
    subtitle: 'Moyens · 4–5 ans',
    badge: 'Associer & comparer',
    tint: 'linear-gradient(135deg, #e8f5e9, #c5e1a5)',
  },
  {
    key: 'grande',
    icon: '🐔',
    title: 'Grande Section',
    subtitle: 'Grands · 5–6 ans',
    badge: 'Préparer le CP',
    tint: 'linear-gradient(135deg, #fff3e0, #ffcc80)',
  },
]

export default function ScreenLevelSelect() {
  const { gameState, switchScreen, setGameState, showPaywall } = useGame()
  const premium = gameState.premium ?? false

  const goPrimaire = (screen) => {
    if (premium) switchScreen(screen)
    else showPaywall('Les niveaux CP, CE1 et CE2 sont dans la version complète.')
  }

  const goMaternelle = (section) => {
    setGameState((prev) => ({
      ...prev,
      maternelleSection: section,
      currentSubject: {
        ...prev.currentSubject,
        [section]:
          prev.currentSubject?.[section] ??
          (section === 'grande'
            ? 'letters'
            : section === 'moyenne'
              ? 'colors'
              : 'coloring'),
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
      className="screen-level-select screen-veil"
      title="Choisis ton niveau"
      titleIcon="🎒"
      footer={footer}
      mainClassName="px-4 py-3"
    >
      <div className="flex w-full max-w-full flex-col gap-3">
        <p className="screen-section-label">Maternelle</p>

        {MATERNELLE_LEVELS.map(({ key, icon, title, subtitle, badge, tint }) => (
          <div
            key={key}
            role="button"
            tabIndex={0}
            onClick={() => goMaternelle(key)}
            onKeyDown={(e) => e.key === 'Enter' && goMaternelle(key)}
            className="kid-card"
          >
            <div className="kid-card__icon" style={{ background: tint }}>
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black text-[#3e2700]">{title}</div>
              <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">{subtitle}</div>
              <span className="kid-card__badge">{badge}</span>
            </div>
          </div>
        ))}

        <p className="screen-section-label mt-1">
          Primaire {!premium && <span className="text-[0.7rem] font-bold text-[#b8860b]">🔒 version complète</span>}
        </p>

        <div
          role="button"
          tabIndex={0}
          onClick={() => goPrimaire(SCREENS.MINIGAME_CP)}
          onKeyDown={(e) => e.key === 'Enter' && goPrimaire(SCREENS.MINIGAME_CP)}
          className={`kid-card${premium ? '' : ' kid-card--locked'}`}
        >
          <div className="kid-card__icon" style={{ background: 'linear-gradient(135deg, #e3f2fd, #90caf9)' }}>
            {premium ? '✏️' : '🔒'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-black text-[#3e2700]">CP</div>
            <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">6 à 7 ans</div>
            <span className="kid-card__badge">Maths &amp; Dictée</span>
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => goPrimaire(SCREENS.MINIGAME_CE1)}
          onKeyDown={(e) => e.key === 'Enter' && goPrimaire(SCREENS.MINIGAME_CE1)}
          className={`kid-card${premium ? '' : ' kid-card--locked'}`}
        >
          <div className="kid-card__icon" style={{ background: 'linear-gradient(135deg, #ede7f6, #b39ddb)' }}>
            {premium ? '📐' : '🔒'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-black text-[#3e2700]">CE1</div>
            <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">7 à 8 ans</div>
            <span className="kid-card__badge">Calcul, lecture &amp; dictée</span>
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => goPrimaire(SCREENS.MINIGAME_CE2)}
          onKeyDown={(e) => e.key === 'Enter' && goPrimaire(SCREENS.MINIGAME_CE2)}
          className={`kid-card${premium ? '' : ' kid-card--locked'}`}
        >
          <div className="kid-card__icon" style={{ background: 'linear-gradient(135deg, #e0f2f1, #80cbc4)' }}>
            {premium ? '🧮' : '🔒'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-black text-[#3e2700]">CE2</div>
            <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">8 à 9 ans</div>
            <span className="kid-card__badge">Multiplications, divisions &amp; dictée</span>
          </div>
        </div>
      </div>
    </MobileScreenLayout>
  )
}
