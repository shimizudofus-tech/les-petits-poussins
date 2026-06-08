import { useGame } from '../context/GameContext'

export default function Toast() {
  const { toast } = useGame()
  if (!toast) return null

  return (
    <div className="toast" style={{ background: toast.color }}>
      {toast.message}
    </div>
  )
}
