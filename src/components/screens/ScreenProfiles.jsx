import { useState } from 'react'
import ScreenTitle from './ScreenTitle'
import { SCREENS, useGame } from '../../context/GameContext'

export default function ScreenProfiles() {
  const { profiles, activeProfileId, switchProfile, addProfile, deleteProfile, switchScreen } = useGame()
  const [newName, setNewName] = useState('')

  const pick = (id) => {
    switchProfile(id)
    switchScreen(SCREENS.TAMAGOTCHI)
  }

  const handleAdd = () => {
    addProfile(newName)
    setNewName('')
    switchScreen(SCREENS.TAMAGOTCHI)
  }

  return (
    <main className="screen flex h-full min-h-0 w-full max-w-full flex-col overflow-y-auto px-4 pb-6">
      <ScreenTitle>👧👦 Qui joue ?</ScreenTitle>

      <div className="mx-auto mt-3 flex w-full max-w-[360px] flex-col gap-2.5">
        {profiles.map((p) => (
          <div key={p.id} className={`kid-card${p.id === activeProfileId ? ' ring-2 ring-[#ffb300]' : ''}`}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => pick(p.id)}
              onKeyDown={(e) => e.key === 'Enter' && pick(p.id)}
              className="flex flex-1 items-center gap-3"
              style={{ cursor: 'pointer' }}
            >
              <div className="kid-card__icon" style={{ background: 'linear-gradient(135deg, #fff8e1, #ffd54f)' }}>
                {p.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-black text-[#3e2700]">{p.name}</div>
                {p.id === activeProfileId ? (
                  <div className="text-[0.7rem] font-bold text-[#b8860b]">★ profil actuel</div>
                ) : (
                  <div className="text-[0.7rem] font-bold text-[#6d4c41]">appuie pour jouer</div>
                )}
              </div>
            </div>
            {profiles.length > 1 ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Supprimer ${p.name} et sa progression ?`)) deleteProfile(p.id)
                }}
                className="shrink-0 rounded-full px-2 py-1 text-sm"
                aria-label={`Supprimer ${p.name}`}
              >
                🗑️
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-4 flex w-full max-w-[360px] items-center gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Prénom du nouvel enfant"
          maxLength={14}
          className="flex-1 rounded-[14px] border-2 border-[#e8b84b] px-3 py-2 text-sm font-bold text-[#3e2700] outline-none"
        />
        <button type="button" onClick={handleAdd} className="col-btn col-btn--petite validate shrink-0">
          ➕ Ajouter
        </button>
      </div>

      <button
        type="button"
        onPointerUp={() => switchScreen(SCREENS.TAMAGOTCHI)}
        className="close-btn mx-auto mt-5 w-full max-w-[360px] shrink-0 cursor-pointer rounded-[18px] border-none px-6 py-3 font-sans text-[0.95rem] font-extrabold text-white"
      >
        ← Retour
      </button>
    </main>
  )
}
