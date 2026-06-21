import Toast from './Toast'
import Modal from './Modal'
import ScreenTamagotchi from './screens/ScreenTamagotchi'
import ScreenLevelSelect from './screens/ScreenLevelSelect'
import ScreenMaternelleSection from './screens/ScreenMaternelleSection'
import ScreenMinigameCP from './screens/ScreenMinigameCP'
import ScreenMinigameCe1 from './screens/ScreenMinigameCe1'
import ScreenMinigameCe2 from './screens/ScreenMinigameCe2'
import ScreenMinigameGrade from './screens/ScreenMinigameGrade'
import ScreenTracing from './screens/ScreenTracing'
import ScreenProfiles from './screens/ScreenProfiles'
import ScreenUpgrade from './screens/ScreenUpgrade'
import ScreenCollection from './screens/ScreenCollection'
import ScreenFarmExplore from './screens/ScreenFarmExplore'
import ScreenParent from './screens/ScreenParent'
import ScreenBadges from './screens/ScreenBadges'
import Feedback from './Feedback'
import EvolvingBackground from './EvolvingBackground'
import { computeFarmLevel } from '../data/farmUpgrades'
import { isValidScreen, resolveScreen, SCREENS } from '../constants/screens'
import { useGame } from '../context/GameContext'
import { useEffect, useRef } from 'react'
import { setSceneMusic } from '../utils/softAudio'

// Écrans d'exercices → musique coupée (concentration).
const EXERCISE_SCREENS = new Set([
  SCREENS.MINIGAME_CP, SCREENS.MINIGAME_CE1, SCREENS.MINIGAME_CE2,
  SCREENS.MINIGAME_CM1, SCREENS.MINIGAME_CM2, SCREENS.MATERNELLE_SECTION, SCREENS.TRACING,
])
function sceneForScreen(screen) {
  if (EXERCISE_SCREENS.has(screen)) return null
  if (screen === SCREENS.FARM_EXPLORE) return 'farm'
  return 'home'
}

function ScreenFallback() {
  const { switchScreen } = useGame()

  return (
    <div className="screen-fallback flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-extrabold text-[#5d3a00]">Écran indisponible</p>
      <button
        type="button"
        onClick={() => switchScreen(SCREENS.TAMAGOTCHI)}
        className="farm-explore-back w-full max-w-[280px]"
      >
        Retour à la ferme
      </button>
    </div>
  )
}

export default function GameContainer() {
  const { gameState, profiles, switchScreen, showToast } = useGame()
  const screen = resolveScreen(gameState.currentScreen)
  const screenKnown = isValidScreen(gameState.currentScreen)

  // Au lancement : si plusieurs enfants, on demande qui joue.
  const launchPickedRef = useRef(false)
  useEffect(() => {
    if (launchPickedRef.current) return
    launchPickedRef.current = true
    if ((profiles?.length ?? 0) > 1) switchScreen(SCREENS.PROFILES)
  }, [profiles, switchScreen])

  // Récap fin de session : étoiles gagnées en quittant un exercice.
  const prevScreenRef = useRef(screen)
  const entryStarsRef = useRef(gameState.stars)
  useEffect(() => {
    const prev = prevScreenRef.current
    const wasExercise = EXERCISE_SCREENS.has(prev)
    const nowExercise = EXERCISE_SCREENS.has(screen)
    if (!wasExercise && nowExercise) entryStarsRef.current = gameState.stars
    if (wasExercise && !nowExercise) {
      const gained = gameState.stars - entryStarsRef.current
      if (gained > 0) showToast(`🎉 Bravo ! +${gained} ⭐ gagnées`, '#7c4dff')
    }
    prevScreenRef.current = screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen])

  const animal = gameState.collection?.[gameState.currentAnimalKey]
  const stage = animal?.currentStage ?? 'egg'
  const farmLevel = computeFarmLevel(gameState.farmUpgrades)

  // Musique d'ambiance selon l'écran (accueil / ferme / silence en exercice).
  useEffect(() => {
    setSceneMusic(sceneForScreen(screen))
  }, [screen])

  // Minuteur parental : blocage quand la limite de temps du jour est atteinte.
  const limitSec = (gameState.timeLimitMin || 0) * 60
  const locked = limitSec > 0 && (gameState.screenTimeToday || 0) >= limitSec && screen !== SCREENS.PARENT

  return (
    <div className={`game-container phone-frame${gameState.dyslexiaFont ? ' font-dys' : ''}`}>
      <div className="game-shell phone-frame">
        <EvolvingBackground stage={stage} farmLevel={farmLevel} />

        <div className="game-shell-content relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="game-screen-slot">
            {!screenKnown ? (
              <ScreenFallback />
            ) : (
              <>
                {screen === SCREENS.TAMAGOTCHI && <ScreenTamagotchi />}
                {screen === SCREENS.LEVEL_SELECT && <ScreenLevelSelect />}
                {screen === SCREENS.MATERNELLE_SECTION && <ScreenMaternelleSection />}
                {screen === SCREENS.MINIGAME_CP && <ScreenMinigameCP />}
                {screen === SCREENS.MINIGAME_CE1 && <ScreenMinigameCe1 />}
                {screen === SCREENS.MINIGAME_CE2 && <ScreenMinigameCe2 />}
                {screen === SCREENS.MINIGAME_CM1 && <ScreenMinigameGrade level="cm1" levelLabel="CM1" title="✏️ CM1 — École" />}
                {screen === SCREENS.MINIGAME_CM2 && <ScreenMinigameGrade level="cm2" levelLabel="CM2" title="✏️ CM2 — École" />}
                {screen === SCREENS.TRACING && <ScreenTracing />}
                {screen === SCREENS.PROFILES && <ScreenProfiles />}
                {screen === SCREENS.UPGRADE && <ScreenUpgrade />}
                {screen === SCREENS.COLLECTION && <ScreenCollection />}
                {screen === SCREENS.FARM_EXPLORE && <ScreenFarmExplore />}
                {screen === SCREENS.PARENT && <ScreenParent />}
                {screen === SCREENS.BADGES && <ScreenBadges />}
              </>
            )}
          </div>
        </div>
      </div>

      {locked ? (
        <div className="time-lock-overlay">
          <div className="time-lock-card">
            <div className="text-5xl">⏸️</div>
            <h2 className="text-xl font-black text-[#5d3a00]">C'est l'heure de la pause !</h2>
            <p className="text-sm font-bold text-[#6d4c41]">Tu as bien joué aujourd'hui. À bientôt 👋</p>
            <button type="button" className="kid-btn kid-btn--ghost" onClick={() => switchScreen(SCREENS.PARENT)}>
              Espace parent
            </button>
          </div>
        </div>
      ) : null}

      <Toast />
      <Modal />
      <Feedback />
    </div>
  )
}
