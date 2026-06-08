import { resolveExerciseImage } from '../../utils/exerciseImage'

export default function ExerciseImageDisplay({ imageKey, className = '' }) {
  const resolved = resolveExerciseImage(imageKey)

  return (
    <span className={className} aria-hidden="true">
      {resolved.label}
    </span>
  )
}
