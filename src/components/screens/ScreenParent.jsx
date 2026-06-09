import MobileScreenLayout from '../layout/MobileScreenLayout'
import { computeFarmLevel } from '../../data/farmUpgrades'
import { SCREENS, useGame } from '../../context/GameContext'
import {
  getExerciseContentStats,
  getExpectedAudioFiles,
  getMaternelleMoyenneStats,
  getMaternellePetiteStats,
  getUsedImageKeys,
  PARENT_RETURN_SESSION_KEY,
} from '../../utils/parentContentStats'
import { CORRECTS_TO_UNLOCK, MAX_MATERNELLE_DIFFICULTY } from '../../utils/maternelleProgress'

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

function getReturnScreen() {
  const saved = sessionStorage.getItem(PARENT_RETURN_SESSION_KEY)
  if (saved && Object.values(SCREENS).includes(saved)) {
    return saved
  }
  return SCREENS.TAMAGOTCHI
}

export default function ScreenParent() {
  const { gameState, switchScreen, resetProgress } = useGame()
  const stats = getExerciseContentStats()
  const petiteStats = getMaternellePetiteStats()
  const moyenneStats = getMaternelleMoyenneStats()
  const audioFiles = getExpectedAudioFiles()
  const imageKeys = getUsedImageKeys()

  const currentAnimal = gameState.collection[gameState.currentAnimalKey]
  const unlockedCount = Object.values(gameState.collection).filter((animal) => animal.unlocked).length
  const totalAnimals = Object.keys(gameState.collection).length
  const farmLevel = computeFarmLevel(gameState.farmUpgrades)
  const petiteProgress = gameState.learningProgress?.maternelle?.petite ?? {}
  const moyenneProgress = gameState.learningProgress?.maternelle?.moyenne ?? {}

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
        <p className="parent-card-hint mt-2">Grande Section : à venir</p>
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
        <p className="parent-card-hint mt-2">Grande Section : à venir</p>
      </section>

      <section className="parent-card">
        <h2 className="parent-card-title">Fichiers audio attendus</h2>
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
