import { useGame } from '../context/GameContext'

export default function Modal() {
  const { modal, hideModal } = useGame()
  if (!modal) return null

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-icon">{modal.icon}</div>
        <div className="modal-title">{modal.title}</div>
        <div className="modal-body">{modal.body}</div>
        <div className="modal-buttons">
          {modal.buttons.map((btn) => (
            <button
              key={btn.label}
              type="button"
              className={`modal-btn ${btn.type || 'primary'}`}
              onClick={() => {
                hideModal()
                btn.onClick?.()
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
