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
  getPuzzleContentStats,
} from '../../utils/parentContentStats'
import { CORRECTS_TO_UNLOCK, MAX_MATERNELLE_DIFFICULTY } from '../../utils/maternelleProgress'
import {
  CORRECTS_TO_UNLOCK_CP,
  CP_SUBJECTS,
  CP_SUBJECT_LABELS,
  MAX_CP_DIFFICULTY,
  formatCpTestHistoryEntry,
  getCpActivityProgress,
} from '../../utils/cpProgress'
import { playWord } from '../../utils/audioManager'
import { isMusicFileAvailable, startBackgroundMusic, stopBackgroundMusic } from '../../utils/music'
import { BADGE_BY_ID } from '../../data/badges'
import { getAchievementSummary } from '../../utils/achievements'
import { getHungryKeys, nextHungerInHours } from '../../utils/animalCare'
import {
  CE1_SUBJECTS,
  CE1_SUBJECT_LABELS,
  MAX_CE1_DIFFICULTY,
  CORRECTS_TO_UNLOCK_CE1,
  getCe1ActivityProgress,
  formatCe1TestHistoryEntry,
} from '../../utils/ce1Progress'
import {
  CE2_SUBJECTS,
  CE2_SUBJECT_LABELS,
  MAX_CE2_DIFFICULTY,
  CORRECTS_TO_UNLOCK_CE2,
  getCe2ActivityProgress,
  formatCe2TestHistoryEntry,
} from '../../utils/ce2Progress'

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
  const { gameState, switchScreen, resetProgress, updateAudioSettings, showToast, setPremium, subscribe } = useGame()
  const premium = gameState.premium ?? false
  const audioSettings = gameState.audioSettings ?? {}
  const achievementSummary = getAchievementSummary(gameState.achievements)
  const stats = getExerciseContentStats()
  const petiteStats = getMaternellePetiteStats()
  const moyenneStats = getMaternelleMoyenneStats()
  const grandeStats = getMaternelleGrandeStats()
  const audioFiles = getExpectedAudioFiles()
  const imageKeys = getUsedImageKeys()
  const puzzleStats = getPuzzleContentStats()

  const currentAnimal = gameState.collection[gameState.currentAnimalKey]
  const unlockedCount = Object.values(gameState.collection).filter((animal) => animal.unlocked).length
  const totalAnimals = Object.keys(gameState.collection).length
  const farmLevel = computeFarmLevel(gameState.farmUpgrades)
  const animalCare = gameState.animalCare ?? {}
  const hungryAnimals = getHungryKeys(gameState.collection, animalCare).length
  const nextHungerHours = nextHungerInHours(gameState.collection, animalCare)
  const lastMissionAt = gameState.feedRewardClaimedAt
    ? new Date(gameState.feedRewardClaimedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    : '—'
  const petiteProgress = gameState.learningProgress?.maternelle?.petite ?? {}
  const moyenneProgress = gameState.learningProgress?.maternelle?.moyenne ?? {}
  const grandeProgress = gameState.learningProgress?.maternelle?.grande ?? {}
  const cpTestHistory = (gameState.achievements?.tests?.history ?? [])
    .filter((test) => test.level === 'cp')
    .slice(-5)
    .reverse()
  const ce1TestHistory = (gameState.achievements?.tests?.history ?? [])
    .filter((test) => test.level === 'ce1')
    .slice(-5)
    .reverse()
  const ce2TestHistory = (gameState.achievements?.tests?.history ?? [])
    .filter((test) => test.level === 'ce2')
    .slice(-5)
    .reverse()

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
        <h2 className="parent-card-title">Version complète</h2>
        <ul className="parent-stat-list">
          <li className="parent-stat-row">
            <span>Statut</span>
            <strong>{premium ? '✅ Premium (1,99 €/mois)' : 'Gratuite (essai)'}</strong>
          </li>
        </ul>
        <p className="parent-card-hint mt-2">
          Gratuit : Maternelle, 2 animaux, Explorer en lecture seule. Premium : CP/CE1/CE2,
          tous les animaux et la ferme complète. (Paiement via Google Play à venir dans l'app Android.)
        </p>
        {!premium ? (
          <button type="button" className="parent-audio-test-btn mt-3 w-full" onClick={() => subscribe()}>
            S'abonner (1,99 €/mois)
          </button>
        ) : null}
        <button
          type="button"
          className={`parent-toggle-btn mt-3 ${premium ? 'is-on' : ''}`}
          onClick={() => setPremium(!premium)}
        >
          Premium TEST : {premium ? 'ON' : 'OFF'}
        </button>
        <p className="parent-card-hint mt-1">Bouton de test (à retirer en production) pour simuler l'abonnement.</p>
      </section>

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
        <h2 className="parent-card-title">Réussites et badges</h2>
        <ul className="parent-stat-list">
          <li className="parent-stat-row">
            <span>Exercices réussis</span>
            <strong>{achievementSummary.totalSuccess}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Tentatives</span>
            <strong>{achievementSummary.totalAttempts}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Meilleur streak</span>
            <strong>{achievementSummary.bestStreak}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Badges débloqués</span>
            <strong>
              {achievementSummary.badgesUnlocked} / {achievementSummary.badgesTotal}
            </strong>
          </li>
        </ul>

        {achievementSummary.recentBadges.length > 0 ? (
          <>
            <h3 className="parent-card-subtitle mt-3">Derniers badges</h3>
            <ul className="parent-stat-list">
              {achievementSummary.recentBadges.map((badgeId) => (
                <li key={badgeId} className="parent-stat-row">
                  <span>
                    {BADGE_BY_ID[badgeId]?.icon} {BADGE_BY_ID[badgeId]?.name ?? badgeId}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {achievementSummary.testHistory.length > 0 ? (
          <>
            <h3 className="parent-card-subtitle mt-3">Derniers tests</h3>
            <ul className="parent-stat-list">
              {achievementSummary.testHistory.map((test, index) => (
                <li key={`${test.finishedAt}-${index}`} className="parent-stat-row">
                  <span>
                    {test.section ? `${test.section} · ` : ''}
                    {test.subject}
                  </span>
                  <strong>
                    {test.score}/{test.length}
                  </strong>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <h3 className="parent-card-subtitle mt-3">Petite Section — réussites</h3>
        <ul className="parent-stat-list">
          {PETITE_LABELS.map(({ key, label }) => (
            <li key={`ach-petite-${key}`} className="parent-stat-row">
              <span>{label}</span>
              <strong>{achievementSummary.successStats.maternelle.petite[key]?.totalSuccess ?? 0}</strong>
            </li>
          ))}
        </ul>

        <h3 className="parent-card-subtitle mt-3">Moyenne Section — réussites</h3>
        <ul className="parent-stat-list">
          {MOYENNE_LABELS.map(({ key, label }) => (
            <li key={`ach-moyenne-${key}`} className="parent-stat-row">
              <span>{label}</span>
              <strong>{achievementSummary.successStats.maternelle.moyenne[key]?.totalSuccess ?? 0}</strong>
            </li>
          ))}
        </ul>

        <h3 className="parent-card-subtitle mt-3">Grande Section — réussites</h3>
        <ul className="parent-stat-list">
          {GRANDE_LABELS.map(({ key, label }) => (
            <li key={`ach-grande-${key}`} className="parent-stat-row">
              <span>{label}</span>
              <strong>{achievementSummary.successStats.maternelle.grande[key]?.totalSuccess ?? 0}</strong>
            </li>
          ))}
        </ul>

        <h3 className="parent-card-subtitle mt-3">CP — réussites</h3>
        <ul className="parent-stat-list">
          {CP_LABELS.map(({ key, label }) => (
            <li key={`ach-cp-${key}`} className="parent-stat-row">
              <span>{label}</span>
              <strong>{achievementSummary.successStats.cp[key]?.totalSuccess ?? 0}</strong>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => switchScreen(SCREENS.BADGES)}
          className="parent-audio-test-btn mt-3 w-full"
        >
          Voir les badges (enfant)
        </button>
      </section>

      <section className="parent-card">
        <h2 className="parent-card-title">Puzzles procéduraux</h2>
        <ul className="parent-stat-list">
          <li className="parent-stat-row">
            <span>Puzzles procéduraux — Petite</span>
            <strong>{puzzleStats.proceduralPetite}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Puzzles procéduraux — Moyenne</span>
            <strong>{puzzleStats.proceduralMoyenne}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Puzzles procéduraux — Grande</span>
            <strong>{puzzleStats.proceduralGrande}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Scènes procédurales uniques</span>
            <strong>{puzzleStats.proceduralScenes}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Puzzles legacy (fallback)</span>
            <strong>{puzzleStats.legacyAvailable}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Animaux</span>
            <strong>{puzzleStats.animals}</strong>
          </li>
        </ul>
        <p className="parent-tag-list">{puzzleStats.animalList.join(', ')}</p>
        <p className="parent-card-hint mt-2">
          Source : {puzzleStats.source} — Licence : {puzzleStats.license}
        </p>
        <p className="parent-card-hint">
          Rotation principale : procédural uniquement. Legacy (Poussin, Fleur, Maison) si catalogue vide.
        </p>
      </section>

      <section className="parent-card">
        <h2 className="parent-card-title">Progression CP</h2>
        <ul className="parent-stat-list">
          {CP_SUBJECTS.map((key) => {
            const prog = getCpActivityProgress(gameState.learningProgress, key)
            const atMax = prog.unlockedDifficulty >= MAX_CP_DIFFICULTY
            const label = CP_SUBJECT_LABELS[key] ?? key
            return (
              <li key={`cp-prog-${key}`} className="parent-stat-row">
                <span>{label}</span>
                <strong>
                  Niveau {prog.unlockedDifficulty}/{MAX_CP_DIFFICULTY}
                  {!atMax && ` · ${prog.correctAnswers}/${CORRECTS_TO_UNLOCK_CP}`}
                </strong>
              </li>
            )
          })}
        </ul>
        <p className="parent-card-hint mt-2">
          Prochain palier : {CORRECTS_TO_UNLOCK_CP} bonnes réponses pour monter de niveau (max niveau 3).
          Les erreurs ne font pas reculer.
        </p>

        {cpTestHistory.length > 0 ? (
          <>
            <h3 className="parent-card-subtitle mt-3">Derniers tests CP</h3>
            <ul className="parent-stat-list">
              {cpTestHistory.map((test, index) => (
                <li key={`cp-test-${test.finishedAt}-${index}`} className="parent-stat-row">
                  <span>{formatCpTestHistoryEntry(test)}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>

      <section className="parent-card">
        <h2 className="parent-card-title">Progression CE1</h2>
        <ul className="parent-stat-list">
          {CE1_SUBJECTS.map((key) => {
            const prog = getCe1ActivityProgress(gameState.learningProgress, key)
            const atMax = prog.unlockedDifficulty >= MAX_CE1_DIFFICULTY
            const label = CE1_SUBJECT_LABELS[key] ?? key
            return (
              <li key={`ce1-prog-${key}`} className="parent-stat-row">
                <span>{label}</span>
                <strong>
                  Niveau {prog.unlockedDifficulty}/{MAX_CE1_DIFFICULTY}
                  {!atMax && ` · ${prog.correctAnswers}/${CORRECTS_TO_UNLOCK_CE1}`}
                </strong>
              </li>
            )
          })}
        </ul>
        <p className="parent-card-hint mt-2">
          CE1 (7–8 ans) : additions/soustractions à 2 chiffres, tables ×2/×5/×10, lecture et dictée
          de mots plus longs. {CORRECTS_TO_UNLOCK_CE1} bonnes réponses pour monter de niveau (max 3).
        </p>

        {ce1TestHistory.length > 0 ? (
          <>
            <h3 className="parent-card-subtitle mt-3">Derniers tests CE1</h3>
            <ul className="parent-stat-list">
              {ce1TestHistory.map((test, index) => (
                <li key={`ce1-test-${test.finishedAt}-${index}`} className="parent-stat-row">
                  <span>{formatCe1TestHistoryEntry(test)}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>

      <section className="parent-card">
        <h2 className="parent-card-title">Progression CE2</h2>
        <ul className="parent-stat-list">
          {CE2_SUBJECTS.map((key) => {
            const prog = getCe2ActivityProgress(gameState.learningProgress, key)
            const atMax = prog.unlockedDifficulty >= MAX_CE2_DIFFICULTY
            const label = CE2_SUBJECT_LABELS[key] ?? key
            return (
              <li key={`ce2-prog-${key}`} className="parent-stat-row">
                <span>{label}</span>
                <strong>
                  Niveau {prog.unlockedDifficulty}/{MAX_CE2_DIFFICULTY}
                  {!atMax && ` · ${prog.correctAnswers}/${CORRECTS_TO_UNLOCK_CE2}`}
                </strong>
              </li>
            )
          })}
        </ul>
        <p className="parent-card-hint mt-2">
          CE2 (8–9 ans) : additions/soustractions à 3 chiffres, tables ×3 à ×9, divisions simples,
          lecture et dictée de mots difficiles. {CORRECTS_TO_UNLOCK_CE2} bonnes réponses pour monter (max 3).
        </p>

        {ce2TestHistory.length > 0 ? (
          <>
            <h3 className="parent-card-subtitle mt-3">Derniers tests CE2</h3>
            <ul className="parent-stat-list">
              {ce2TestHistory.map((test, index) => (
                <li key={`ce2-test-${test.finishedAt}-${index}`} className="parent-stat-row">
                  <span>{formatCe2TestHistoryEntry(test)}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
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
        <h2 className="parent-card-title">Animaux</h2>
        <ul className="parent-stat-list">
          <li className="parent-stat-row">
            <span>Animaux affamés</span>
            <strong>{hungryAnimals} / {unlockedCount}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Dernière mission nourrir</span>
            <strong>{lastMissionAt}</strong>
          </li>
          <li className="parent-stat-row">
            <span>Prochain cycle de faim</span>
            <strong>{hungryAnimals > 0 ? 'maintenant' : nextHungerHours != null ? `dans ${nextHungerHours} h` : '—'}</strong>
          </li>
        </ul>
        <p className="parent-card-hint mt-2">
          Les animaux débloqués ont faim toutes les 24 h. Dans « Explorer la ferme », touche un
          animal affamé pour le nourrir. Tout nourrir donne +{3} ⭐ (une fois par cycle).
        </p>
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
