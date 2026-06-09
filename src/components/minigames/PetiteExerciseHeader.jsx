import { playWord } from '../../utils/audioManager'

export default function PetiteExerciseHeader({ instruction, parentHint, audioKey, audioLabel }) {
  const handleListen = () => {
    if (!audioKey) return
    playWord(audioKey)
  }

  return (
    <header className="petite-exercise-header">
      <div className="petite-exercise-instruction-row">
        <h2 className="petite-exercise-instruction">{instruction}</h2>
        {audioKey ? (
          <button
            type="button"
            className="petite-audio-btn"
            onClick={handleListen}
            aria-label={`Écouter : ${audioLabel ?? instruction}`}
          >
            🔊
          </button>
        ) : null}
      </div>
      {parentHint ? <p className="petite-exercise-parent-hint">{parentHint}</p> : null}
    </header>
  )
}
