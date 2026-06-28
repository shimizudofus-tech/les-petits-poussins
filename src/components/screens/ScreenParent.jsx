import MobileScreenLayout from '../layout/MobileScreenLayout'
import { SCREENS, useGame } from '../../context/GameContext'
import { playWord } from '../../utils/audioManager'
import { startBackgroundMusic, stopBackgroundMusic } from '../../utils/music'
import { getAchievementSummary } from '../../utils/achievements'
import { getWeeklyReport } from '../../utils/weeklyReport'
import { PARENT_RETURN_SESSION_KEY } from '../../utils/parentContentStats'

function getReturnScreen() {
  const saved = sessionStorage.getItem(PARENT_RETURN_SESSION_KEY)
  if (saved && Object.values(SCREENS).includes(saved)) return saved
  return SCREENS.TAMAGOTCHI
}

export default function ScreenParent() {
  const { gameState, setGameState, switchScreen, resetProgress, updateAudioSettings, showToast, setPremium, subscribe, profiles, activeProfileId, toggleDyslexiaFont, setTimeLimit, resetScreenTime } = useGame()
  const screenMin = Math.floor((gameState.screenTimeToday || 0) / 60)
  const timeLimit = gameState.timeLimitMin || 0
  const premium = gameState.premium ?? false
  const audioSettings = gameState.audioSettings ?? {}
  const achievementSummary = getAchievementSummary(gameState.achievements)
  const week = getWeeklyReport(gameState.activityLog)

  return (
    <MobileScreenLayout
      className="screen-parent"
      title="Espace Parent"
      titleIcon="⚙️"
      scrollable
      mainClassName="px-[var(--screen-padding)] py-3"
    >
      <button type="button" onClick={() => switchScreen(getReturnScreen())} className="parent-back-btn mb-3 w-full">
        ← Retour
      </button>

      {/* ── Temps d'écran ── */}
      <details className="parent-card parent-section" open>
        <summary className="parent-card-title">⏱️ Temps d'écran</summary>
        <ul className="parent-stat-list">
          <li className="parent-stat-row">
            <span>Aujourd'hui</span>
            <strong>{screenMin} min</strong>
          </li>
          <li className="parent-stat-row">
            <span>Limite / jour</span>
            <strong>{timeLimit > 0 ? `${timeLimit} min` : 'aucune'}</strong>
          </li>
        </ul>
        <div className="mt-2 flex flex-wrap gap-2">
          {[0, 15, 30, 45, 60].map((m) => (
            <button key={m} type="button" onClick={() => setTimeLimit(m)} className={`parent-toggle-btn ${timeLimit === m ? 'is-on' : ''}`}>
              {m === 0 ? 'Aucune' : `${m} min`}
            </button>
          ))}
        </div>
        <button type="button" className="parent-audio-test-btn mt-3 w-full" onClick={resetScreenTime}>
          Réinitialiser le temps du jour
        </button>
      </details>

      {/* ── Profils ── */}
      <details className="parent-card parent-section">
        <summary className="parent-card-title">👧 Profils enfants</summary>
        <ul className="parent-stat-list">
          <li className="parent-stat-row">
            <span>Profil actif</span>
            <strong>
              {(() => {
                const a = (profiles ?? []).find((p) => p.id === activeProfileId)
                return a ? `${a.avatar} ${a.name}` : '—'
              })()}
            </strong>
          </li>
        </ul>
        <button type="button" className="parent-audio-test-btn mt-3 w-full" onClick={() => switchScreen(SCREENS.PROFILES)}>
          Gérer les profils
        </button>
      </details>

      {/* ── Progression ── */}
      <details className="parent-card parent-section">
        <summary className="parent-card-title">📊 Progression</summary>
        <ul className="parent-stat-list">
          <li className="parent-stat-row">
            <span>Étoiles</span>
            <strong>{gameState.stars}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Exercices réussis</span>
            <strong>{achievementSummary.totalSuccess}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Meilleur streak</span>
            <strong>{achievementSummary.bestStreak}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Badges</span>
            <strong>{achievementSummary.badgesUnlocked} / {achievementSummary.badgesTotal}</strong>
          </li>
        </ul>
        <button type="button" onClick={() => switchScreen(SCREENS.BADGES)} className="parent-audio-test-btn mt-3 w-full">
          Voir les badges
        </button>
      </details>

      {/* ── Rapport de la semaine ── */}
      <details className="parent-card parent-section" open>
        <summary className="parent-card-title">📅 Cette semaine</summary>
        <div className="week-stats">
          <div className="week-stat">
            <span className="week-stat__num">{week.totalSuccess}</span>
            <span className="week-stat__lbl">réussis</span>
          </div>
          <div className="week-stat">
            <span className="week-stat__num">{week.accuracy}%</span>
            <span className="week-stat__lbl">de réussite</span>
          </div>
          <div className="week-stat">
            <span className="week-stat__num">{week.activeDays}/7</span>
            <span className="week-stat__lbl">jours actifs</span>
          </div>
        </div>
        <div className="week-chart" aria-hidden="true">
          {week.days.map((d) => {
            const h = week.maxSuccess > 0 ? Math.round((d.success / week.maxSuccess) * 100) : 0
            return (
              <div key={d.key} className="week-bar-col">
                <div className="week-bar-track">
                  <div className="week-bar-fill" style={{ height: `${Math.max(h, d.success > 0 ? 12 : 0)}%` }} />
                </div>
                <span className="week-bar-label">{d.label}</span>
              </div>
            )
          })}
        </div>
        <p className="parent-card-hint mt-1">
          {week.totalAttempts === 0
            ? "Pas encore d'activité cette semaine."
            : `${week.totalSuccess} exercices réussis sur ${week.totalAttempts} essais.`}
        </p>
      </details>

      {/* ── Audio ── */}
      <details className="parent-card parent-section">
        <summary className="parent-card-title">🔊 Son</summary>
        <ul className="parent-setting-list">
          <li className="parent-setting-row">
            <span>Musique</span>
            <button type="button" className={`parent-toggle-btn ${audioSettings.musicEnabled ? 'is-on' : ''}`}
              onClick={() => { const next = !audioSettings.musicEnabled; updateAudioSettings({ musicEnabled: next }); if (next) startBackgroundMusic() }}>
              {audioSettings.musicEnabled ? 'ON' : 'OFF'}
            </button>
          </li>
          <li className="parent-setting-row">
            <span>Voix</span>
            <button type="button" className={`parent-toggle-btn ${audioSettings.voiceEnabled ? 'is-on' : ''}`}
              onClick={() => updateAudioSettings({ voiceEnabled: !audioSettings.voiceEnabled })}>
              {audioSettings.voiceEnabled ? 'ON' : 'OFF'}
            </button>
          </li>
        </ul>
      </details>

      {/* ── Réglages ── */}
      <details className="parent-card parent-section">
        <summary className="parent-card-title">🔧 Réglages</summary>
        <ul className="parent-setting-list">
          <li className="parent-setting-row">
            <span>Police lecture facile</span>
            <button type="button" className={`parent-toggle-btn ${gameState.dyslexiaFont ? 'is-on' : ''}`} onClick={toggleDyslexiaFont}>
              {gameState.dyslexiaFont ? 'ON' : 'OFF'}
            </button>
          </li>
        </ul>
        <button type="button" className="parent-audio-test-btn mt-3 w-full"
          onClick={() => { setGameState((prev) => ({ ...prev, stars: (prev.stars || 0) + 1000 })); showToast('+1000 ⭐ ajoutées !', '#43a047') }}>
          ⭐ +1000 étoiles
        </button>
        <button type="button" className="parent-audio-test-btn mt-2 w-full"
          onClick={() => { setGameState((prev) => ({ ...prev, tutorialDone: false })); switchScreen(SCREENS.TAMAGOTCHI) }}>
          🎓 Revoir le tutoriel
        </button>
        <button type="button" onClick={() => {
          if (window.confirm('Réinitialiser toute la progression ?\n\nCette action est irréversible.')) resetProgress()
        }} className="parent-danger-btn mt-3 w-full">
          Réinitialiser la progression
        </button>
      </details>
    </MobileScreenLayout>
  )
}
