import MobileScreenLayout from '../layout/MobileScreenLayout'
import { BADGES } from '../../data/badges'
import { SCREENS, useGame } from '../../context/GameContext'
import { getBadgeProgress } from '../../utils/achievements'

export default function ScreenBadges() {
  const { gameState, switchScreen } = useGame()
  const achievements = gameState.achievements
  const unlocked = achievements?.badges ?? {}

  return (
    <MobileScreenLayout
      className="screen-badges"
      title="Mes badges"
      titleIcon="🏅"
      scrollable
      mainClassName="px-[var(--screen-padding)] py-3"
    >
      <p className="badges-intro mb-3 text-center text-[0.78rem] font-bold text-[#8d6e3a]">
        Réussis des exercices pour débloquer des badges et gagner des étoiles bonus !
      </p>

      <div className="badges-grid">
        {BADGES.map((badge) => {
          const isUnlocked = Boolean(unlocked[badge.id])
          const progress = getBadgeProgress(achievements, badge.id)

          return (
            <article
              key={badge.id}
              className={`badge-card ${isUnlocked ? 'badge-card--unlocked' : 'badge-card--locked'}`}
            >
              <div className="badge-card-icon" aria-hidden="true">
                {isUnlocked ? badge.icon : '🔒'}
              </div>
              <h3 className="badge-card-name">{badge.name}</h3>
              <p className="badge-card-desc">{badge.description}</p>
              {!isUnlocked && progress ? (
                <p className="badge-card-progress">
                  {progress.current} / {progress.target}
                </p>
              ) : null}
              {isUnlocked ? (
                <p className="badge-card-reward">+{badge.rewardStars ?? 0}⭐</p>
              ) : null}
            </article>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => switchScreen(SCREENS.TAMAGOTCHI)}
        className="badges-back-btn mt-4 w-full"
      >
        ← Retour à la ferme
      </button>
    </MobileScreenLayout>
  )
}
