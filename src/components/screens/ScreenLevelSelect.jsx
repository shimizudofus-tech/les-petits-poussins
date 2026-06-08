import MobileScreenLayout from '../layout/MobileScreenLayout'
import { SCREENS, useGame } from '../../context/GameContext'

export default function ScreenLevelSelect() {
  const { switchScreen } = useGame()

  const footer = (
    <div className="px-4 pb-3 pt-1">
      <button
        type="button"
        onClick={() => switchScreen(SCREENS.TAMAGOTCHI)}
        className="close-btn mx-auto block w-[90%] max-w-full cursor-pointer rounded-[18px] border-none px-6 py-3 font-sans text-sm font-extrabold text-white transition-transform duration-100 active:translate-y-[3px]"
      >
        🏡 Retour à la ferme
      </button>
    </div>
  )

  return (
    <MobileScreenLayout
      className="screen-level-select bg-gradient-to-b from-[#e3f2fd] to-[#fff8e7]"
      title="Choisis ton niveau"
      titleIcon="🎒"
      footer={footer}
      mainClassName="px-4 py-3"
    >
      <div className="flex w-full max-w-full flex-col gap-3">
        <div
          role="button"
          tabIndex={0}
          onClick={() => switchScreen(SCREENS.MINIGAME_MATERNELLE)}
          onKeyDown={(e) => e.key === 'Enter' && switchScreen(SCREENS.MINIGAME_MATERNELLE)}
          className="level-card maternelle flex w-full max-w-full cursor-pointer items-center gap-3 rounded-[20px] border-[3px] border-[#ce93d8] bg-gradient-to-br from-[#e8f5e9] to-[#f3e5f5] p-3 transition-[transform,box-shadow] duration-150 active:scale-[0.97]"
        >
          <div className="shrink-0 text-4xl">🌈</div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-black text-[#3e2700]">Maternelle</div>
            <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">
              PS · MS · GS — 3 à 6 ans
            </div>
            <div className="mt-1 inline-block rounded-[10px] bg-white/60 px-2 py-0.5 text-[0.68rem] font-extrabold text-[#5d3a00]">
              Couleurs &amp; Formes
            </div>
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => switchScreen(SCREENS.MINIGAME_CP)}
          onKeyDown={(e) => e.key === 'Enter' && switchScreen(SCREENS.MINIGAME_CP)}
          className="level-card cp flex w-full max-w-full cursor-pointer items-center gap-3 rounded-[20px] border-[3px] border-[#64b5f6] bg-gradient-to-br from-[#fff8e7] to-[#e3f2fd] p-3 transition-[transform,box-shadow] duration-150 active:scale-[0.97]"
        >
          <div className="shrink-0 text-4xl">✏️</div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-black text-[#3e2700]">CP</div>
            <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">6 à 7 ans</div>
            <div className="mt-1 inline-block rounded-[10px] bg-white/60 px-2 py-0.5 text-[0.68rem] font-extrabold text-[#5d3a00]">
              Maths &amp; Dictée
            </div>
          </div>
        </div>
      </div>
    </MobileScreenLayout>
  )
}
