import MobileScreenLayout from '../layout/MobileScreenLayout'
import { computeFarmLevel } from '../../data/farmUpgrades'
import { SCREENS, useGame } from '../../context/GameContext'
import {
  getExerciseContentStats,
  getExpectedAudioFiles,
  getMaternelleGrandeStats,
  getMaternelleMoyenneStats,
  getMaternellePetiteStats,
  getUsedImageKeys,
  PARENT_RETURN_SESSION_KEY,
} from '../../utils/parentContentStats'
import { CORRECTS_TO_UNLOCK, MAX_MATERNELLE_DIFFICULTY } from '../../utils/maternelleProgress'
import { playWord } from '../../utils/audioManager'
import { isMusicFileAvailable, startBackgroundMusic, stopBackgroundMusic } from '../../utils/music'

const CP_LABELS = [
  { key: 'dictee', label: 'Dictée CP' },
  { key: 'lecture', label: 'Lecture CP' },
  { key: 'maths', label: 'Maths CP' },
]

const PETITE_LABELS = [
  { key: 'coloring', label: 'Colorier' },
  { key: 'colors', label: 'Couleurs' },
  { key: 'shapes', label: 'Formes' },
  { key: 'counting', label: 'Compter' },
  { key: 'puzzles', label: 'Puzzle' },
]

const MOYENNE_LABELS = [
  { key: 'colors', label: 'Couleurs +' },
  { key: 'shapes', label: 'Formes +' },
  { key: 'counting', label: 'Compter' },
  { key: 'puzzles', label: 'Puzzle' },
  { key: 'patterns', label: 'Suites' },
]

const GRANDE_LABELS = [
  { key: 'letters', label: 'Lettres' },
  { key: 'sounds', label: 'Sons' },
  { key: 'counting', label: 'Compter 10' },
  { key: 'puzzles', label: 'Puzzle +' },
  { key: 'logic', label: 'Logique' },
]

function getReturnScreen() {
  const saved = sessionStorage.getItem(PARENT_RETURN_SESSION_KEY)
  if (saved && Object.values(SCREENS).includes(saved)) {
    return saved
  }
  return SCREENS.TAMAGOTCHI
}

export default function ScreenParent() {
  const { gameState, switchScreen, resetProgress, updateAudioSettings, showToast } = useGame()
  const audioSettings = gameState.audioSettings ?? {}
  const stats = getExerciseContentStats()
  const petiteStats = getMaternellePetiteStats()
  const moyenneStats = getMaternelleMoyenneStats()
  const grandeStats = getMaternelleGrandeStats()
  const audioFiles = getExpectedAudioFiles()
  const imageKeys = getUsedImageKeys()

  const currentAnimal = gameState.collection[gameState.currentAnimalKey]
  const unlockedCount = Object.values(gameState.collection).filter((animal) => animal.unlocked).length
  const totalAnimals = Object.keys(gameState.collection).length
  const farmLevel = computeFarmLevel(gameState.farmUpgrades)
  const petiteProgress = gameState.learningProgress?.maternelle?.petite ?? {}
  const moyenneProgress = gameState.learningProgress?.maternelle?.moyenne ?? {}
  const grandeProgress = gameState.learningProgress?.maternelle?.grande ?? {}

  const handleBack = () => {
    switchScreen(getReturnScreen())
  }

  const handleReset = () => {
    const confirmed = window.confirm(
      'Réinitialiser toute la progression ?\n\n' +
        'Cette action efface les étoiles, les animaux, la ferme et toute sauvegarde locale. ' +
        'Elle est irréversible.',
    )
    if (!confirmed) return
    resetProgress()
  }

  return (
    <MobileScreenLayout
      className="screen-parent"
      title="Espace Parent"
      titleIcon="⚙️"
      scrollable
      mainClassName="px-[var(--screen-padding)] py-3"
    >
      <button
        type="button"
        onClick={handleBack}
        className="parent-back-btn mb-3 w-full"
      >
        ← Retour
      </button>

      <section className="parent-card">
        <h2 className="parent-card-title">Réglages audio</h2>
        <ul className="parent-setting-list">
          <li className="parent-setting-row">
            <span>Musique</span>
            <button
              type="button"
              className={`parent-toggle-btn ${audioSettings.musicEnabled ? 'is-on' : ''}`}
              onClick={() => {
                const next = !audioSettings.musicEnabled
                updateAudioSettings({ musicEnabled: next })
                if (next) startBackgroundMusic()
              }}
            >
              {audioSettings.musicEnabled ? 'ON' : 'OFF'}
            </button>
          </li>
          <li className="parent-setting-row">
            <span>Volume musique</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round((audioSettings.musicVolume ?? 0.25) * 100)}
              disabled={!audioSettings.musicEnabled}
              className="parent-range"
              onChange={(e) =>
                updateAudioSettings({ musicVolume: Number(e.target.value) / 100 })
              }
            />
          </li>
          <li className="parent-setting-row">
            <span>Voix</span>
            <button
              type="button"
              className={`parent-toggle-btn ${audioSettings.voiceEnabled ? 'is-on' : ''}`}
              onClick={() => updateAudioSettings({ voiceEnabled: !audioSettings.voiceEnabled })}
            >
              {audioSettings.voiceEnabled ? 'ON' : 'OFF'}
            </button>
          </li>
          <li className="parent-setting-row">
            <span>Volume voix</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round((audioSettings.voiceVolume ?? 1) * 100)}
              disabled={!audioSettings.voiceEnabled}
              className="parent-range"
              onChange={(e) =>
                updateAudioSettings({ voiceVolume: Number(e.target.value) / 100 })
              }
            />
          </li>
        </ul>
        <div className="parent-audio-test-row">
          <button type="button" className="parent-audio-test-btn" onClick={() => playWord('rouge')}>
            Tester voix
          </button>
          <button
            type="button"
            className="parent-audio-test-btn"
            onClick={async () => {
              const available = await isMusicFileAvailable()
              if (!available) {
                showToast('Aucune musique trouvée. Ajoute public/audio/music/background.mp3', '#8d6e3a')
                return
              }
              const started = await startBackgroundMusic()
              if (!started) {
                showToast('Impossible de lancer la musique', '#ef5350')
              }
            }}
          >
            Tester musique
          </button>
          <button type="button" className="parent-audio-test-btn" onClick={() => stopBackgroundMusic()}>
            Stop musique
          </button>
        </div>
        <p className="parent-card-hint">
          Musique : public/audio/music/background.mp3 — activée par défaut, démarrage au premier tap.
        </p>
      </section>

      <section className="parent-card">
        <h2 className="parent-card-title">Contenu pédagogique — CP</h2>
        <ul className="parent-stat-list">
          {CP_LABELS.map(({ key, label }) => (
            <li key={key} className="parent-stat-row">
              <span>{label}</span>
              <strong>{stats[key]}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="parent-card">
        <h2 className="parent-card-title">Maternelle — Petite Section</h2>
        <ul className="parent-stat-list">
          {PETITE_LABELS.map(({ key, label }) => (
            <li key={key} className="parent-stat-row">
              <span>{label}</span>
              <strong>{petiteStats[key]}</strong>
            </li>
          ))}
        </ul>
        <h3 className="parent-card-subtitle mt-3">Progression enfant</h3>
        <ul className="parent-stat-list">
          {PETITE_LABELS.map(({ key, label }) => {
            const prog = petiteProgress[key] ?? { unlockedDifficulty: 1, correctAnswers: 0 }
            const atMax = prog.unlockedDifficulty >= MAX_MATERNELLE_DIFFICULTY
            return (
              <li key={`prog-${key}`} className="parent-stat-row">
                <span>{label}</span>
                <strong>
                  Diff. {prog.unlockedDifficulty}/{MAX_MATERNELLE_DIFFICULTY}
                  {!atMax && ` · ${prog.correctAnswers}/${CORRECTS_TO_UNLOCK}`}
                </strong>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="parent-card">
        <h2 className="parent-card-title">Maternelle — Moyenne Section</h2>
        <ul className="parent-stat-list">
          {MOYENNE_LABELS.map(({ key, label }) => (
            <li key={key} className="parent-stat-row">
              <span>{label}</span>
              <strong>{moyenneStats[key]}</strong>
            </li>
          ))}
        </ul>
        <h3 className="parent-card-subtitle mt-3">Progression enfant</h3>
        <ul className="parent-stat-list">
          {MOYENNE_LABELS.map(({ key, label }) => {
            const prog = moyenneProgress[key] ?? { unlockedDifficulty: 1, correctAnswers: 0 }
            const atMax = prog.unlockedDifficulty >= MAX_MATERNELLE_DIFFICULTY
            return (
              <li key={`moy-prog-${key}`} className="parent-stat-row">
                <span>{label}</span>
                <strong>
                  Diff. {prog.unlockedDifficulty}/{MAX_MATERNELLE_DIFFICULTY}
                  {!atMax && ` · ${prog.correctAnswers}/${CORRECTS_TO_UNLOCK}`}
                </strong>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="parent-card">
        <h2 className="parent-card-title">Maternelle — Grande Section</h2>
        <ul className="parent-stat-list">
          {GRANDE_LABELS.map(({ key, label }) => (
            <li key={key} className="parent-stat-row">
              <span>{label}</span>
              <strong>{grandeStats[key]}</strong>
            </li>
          ))}
        </ul>
        <h3 className="parent-card-subtitle mt-3">Progression enfant</h3>
        <ul className="parent-stat-list">
          {GRANDE_LABELS.map(({ key, label }) => {
            const prog = grandeProgress[key] ?? { unlockedDifficulty: 1, correctAnswers: 0 }
            const atMax = prog.unlockedDifficulty >= MAX_MATERNELLE_DIFFICULTY
            return (
              <li key={`grd-prog-${key}`} className="parent-stat-row">
                <span>{label}</span>
                <strong>
                  Diff. {prog.unlockedDifficulty}/{MAX_MATERNELLE_DIFFICULTY}
                  {!atMax && ` · ${prog.correctAnswers}/${CORRECTS_TO_UNLOCK}`}
                </strong>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="parent-card">
        <h2 className="parent-card-title">Fichiers audio attendus</h2>
        <p className="parent-card-hint">
          Audio : les MP3 maison peuvent être ajoutés dans public/audio/voix/. En attendant, le jeu
          utilise une voix automatique du navigateur.
        </p>
        <p className="parent-card-hint">{audioFiles.length} fichier(s) MP3 référencé(s)</p>
        <ul className="parent-detail-list">
          {audioFiles.map(({ audioKey, path }) => (
            <li key={audioKey} className="parent-detail-item">
              <span className="parent-detail-key">{audioKey}</span>
              <span className="parent-detail-path">→ {path}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="parent-card">
        <h2 className="parent-card-title">imageKey utilisés</h2>
        <p className="parent-card-hint">{imageKeys.length} clé(s) d&apos;image</p>
        <p className="parent-tag-list">{imageKeys.join(', ')}</p>
      </section>

      <section className="parent-card">
        <h2 className="parent-card-title">Progression locale</h2>
        <ul className="parent-stat-list">
          <li className="parent-stat-row">
            <span>Étoiles</span>
            <strong>{gameState.stars}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Animal actuel</span>
            <strong>{currentAnimal?.name ?? gameState.currentAnimalKey}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Niveau ferme</span>
            <strong>{farmLevel}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Animaux débloqués</span>
            <strong>
              {unlockedCount} / {totalAnimals}
            </strong>
          </li>
        </ul>

        <button type="button" onClick={handleReset} className="parent-danger-btn mt-3 w-full">
          Réinitialiser la progression
        </button>

        <div className="parent-future-actions mt-3">
          <button type="button" disabled className="parent-disabled-btn w-full">
            Exporter la progression
          </button>
          <button type="button" disabled className="parent-disabled-btn mt-2 w-full">
            Importer la progression
          </button>
          <p className="parent-coming-soon">À venir</p>
        </div>
      </section>
    </MobileScreenLayout>
  )
}
