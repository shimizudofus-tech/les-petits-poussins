import MobileScreenLayout from '../layout/MobileScreenLayout'
import { computeFarmLevel } from '../../data/farmUpgrades'
import { SCREENS, useGame } from '../../context/GameContext'
import {
  getExerciseContentStats,
  getExpectedAudioFiles,
  getUsedImageKeys,
  PARENT_RETURN_SESSION_KEY,
} from '../../utils/parentContentStats'

const CONTENT_LABELS = [
  { key: 'dictee', label: 'Dictée CP' },
  { key: 'lecture', label: 'Lecture CP' },
  { key: 'maths', label: 'Maths CP' },
  { key: 'colors', label: 'Couleurs Maternelle' },
  { key: 'shapes', label: 'Formes Maternelle' },
  { key: 'counting', label: 'Compter Maternelle' },
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
  const audioFiles = getExpectedAudioFiles()
  const imageKeys = getUsedImageKeys()

  const currentAnimal = gameState.collection[gameState.currentAnimalKey]
  const unlockedCount = Object.values(gameState.collection).filter((animal) => animal.unlocked).length
  const totalAnimals = Object.keys(gameState.collection).length
  const farmLevel = computeFarmLevel(gameState.farmUpgrades)

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
        <h2 className="parent-card-title">Contenu pédagogique</h2>
        <ul className="parent-stat-list">
          {CONTENT_LABELS.map(({ key, label }) => (
            <li key={key} className="parent-stat-row">
              <span>{label}</span>
              <strong>{stats[key]}</strong>
            </li>
          ))}
        </ul>
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
