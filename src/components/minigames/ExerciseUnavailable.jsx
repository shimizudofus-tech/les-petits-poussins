import { SCREENS, useGame } from '../../context/GameContext'

export default function ExerciseUnavailable() {
  const { switchScreen } = useGame()

  return (
    <div className="exercise-unavailable">
      <p className="exercise-unavailable-text">Aucun exercice disponible pour le moment.</p>
      <button
        type="button"
        onClick={() => switchScreen(SCREENS.LEVEL_SELECT)}
        className="exercise-unavailable-btn"
      >
        Retour
      </button>
    </div>
  )
}
