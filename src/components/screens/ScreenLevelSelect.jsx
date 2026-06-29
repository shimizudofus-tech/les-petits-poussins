import MobileScreenLayout from '../layout/MobileScreenLayout'
import AppIcon from '../AppIcon'
import MissionsCard from '../MissionsCard'
import { SCREENS, useGame } from '../../context/GameContext'

const MATERNELLE_LEVELS = [
  {
    key: 'petite',
    icon: 'hatch',
    title: 'Petite Section',
    subtitle: 'Petits · 3–4 ans',
    badge: 'Toucher & reconnaître',
    tint: 'linear-gradient(135deg, #f3e5f5, #e1bee7)',
  },
  {
    key: 'moyenne',
    icon: 'chick',
    title: 'Moyenne Section',
    subtitle: 'Moyens · 4–5 ans',
    badge: 'Associer & comparer',
    tint: 'linear-gradient(135deg, #e8f5e9, #c5e1a5)',
  },
  {
    key: 'grande',
    icon: 'hen',
    title: 'Grande Section',
    subtitle: 'Grands · 5–6 ans',
    badge: 'Préparer le CP',
    tint: 'linear-gradient(135deg, #fff3e0, #ffcc80)',
  },
]

export default function ScreenLevelSelect() {
  const { gameState, switchScreen, setGameState } = useGame()

  // Tous les exercices (maternelle + primaire) sont gratuits.
  const goPrimaire = (screen) => switchScreen(screen)

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
        className="close-btn mx-auto flex w-[90%] max-w-full cursor-pointer items-center justify-center gap-1.5 rounded-[18px] border-none px-6 py-3 font-sans text-sm font-extrabold text-white transition-transform duration-100 active:translate-y-[3px]"
      >
        <AppIcon name="house" size={20} /> Retour à la ferme
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
        <MissionsCard />

        <div
          role="button"
          tabIndex={0}
          onClick={() => switchScreen(SCREENS.LESSON)}
          onKeyDown={(e) => e.key === 'Enter' && switchScreen(SCREENS.LESSON)}
          className="kid-card lesson-card"
        >
          <div className="kid-card__icon" style={{ background: 'linear-gradient(135deg, #fff8e1, #ffca28)' }}>
            📘
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-black text-[#3e2700]">Leçon du jour</div>
            <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">5 exercices guidés</div>
            <span className="kid-card__badge">+10 ⭐ à la fin</span>
          </div>
        </div>

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
              <AppIcon name={icon} size={40} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black text-[#3e2700]">{title}</div>
              <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">{subtitle}</div>
              <span className="kid-card__badge">{badge}</span>
            </div>
          </div>
        ))}

        <div
          role="button"
          tabIndex={0}
          onClick={() => switchScreen(SCREENS.TRACING)}
          onKeyDown={(e) => e.key === 'Enter' && switchScreen(SCREENS.TRACING)}
          className="kid-card"
        >
          <div className="kid-card__icon" style={{ background: 'linear-gradient(135deg, #f3e5f5, #ce93d8)' }}>
            <AppIcon name="pencil" size={40} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-black text-[#3e2700]">J'écris</div>
            <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">Lettres &amp; chiffres</div>
            <span className="kid-card__badge">Tracé au doigt</span>
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => switchScreen(SCREENS.MINIGAMES)}
          onKeyDown={(e) => e.key === 'Enter' && switchScreen(SCREENS.MINIGAMES)}
          className="kid-card"
        >
          <div className="kid-card__icon" style={{ background: 'linear-gradient(135deg, #e8eaf6, #9fa8da)' }}>
            <AppIcon name="dice" size={40} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-black text-[#3e2700]">Mini-jeux</div>
            <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">Mémoire, réflexes…</div>
            <span className="kid-card__badge">Gagne des étoiles</span>
          </div>
        </div>

        <p className="screen-section-label mt-1">Primaire</p>

        <div
          role="button"
          tabIndex={0}
          onClick={() => goPrimaire(SCREENS.MINIGAME_CP)}
          onKeyDown={(e) => e.key === 'Enter' && goPrimaire(SCREENS.MINIGAME_CP)}
          className="kid-card"
        >
          <div className="kid-card__icon" style={{ background: 'linear-gradient(135deg, #e3f2fd, #90caf9)' }}>
            <AppIcon name="cp" size={40} />
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
          className="kid-card"
        >
          <div className="kid-card__icon" style={{ background: 'linear-gradient(135deg, #ede7f6, #b39ddb)' }}>
            <AppIcon name="ce1" size={40} />
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
          className="kid-card"
        >
          <div className="kid-card__icon" style={{ background: 'linear-gradient(135deg, #e0f2f1, #80cbc4)' }}>
            <AppIcon name="ce2" size={40} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-black text-[#3e2700]">CE2</div>
            <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">8 à 9 ans</div>
            <span className="kid-card__badge">Multiplications, divisions &amp; dictée</span>
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => goPrimaire(SCREENS.MINIGAME_CM1)}
          onKeyDown={(e) => e.key === 'Enter' && goPrimaire(SCREENS.MINIGAME_CM1)}
          className="kid-card"
        >
          <div className="kid-card__icon" style={{ background: 'linear-gradient(135deg, #fff3e0, #ffb74d)' }}>
            <AppIcon name="cm1" size={40} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-black text-[#3e2700]">CM1</div>
            <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">9 à 10 ans</div>
            <span className="kid-card__badge">Fractions, grands nombres &amp; dictée</span>
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => goPrimaire(SCREENS.MINIGAME_CM2)}
          onKeyDown={(e) => e.key === 'Enter' && goPrimaire(SCREENS.MINIGAME_CM2)}
          className="kid-card"
        >
          <div className="kid-card__icon" style={{ background: 'linear-gradient(135deg, #fce4ec, #f06292)' }}>
            <AppIcon name="cm2" size={40} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-black text-[#3e2700]">CM2</div>
            <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">10 à 11 ans</div>
            <span className="kid-card__badge">Décimaux, pourcentages &amp; dictée</span>
          </div>
        </div>
      </div>
    </MobileScreenLayout>
  )
}
