import { useGame } from '../context/GameContext'
import { translate } from './strings'

// Hook de traduction : const t = useT(); t('home.feed')
export function useT() {
  const { gameState } = useGame()
  const lang = gameState.audioSettings?.lang === 'en' ? 'en' : 'fr'
  return (key) => translate(lang, key)
}

export function useLang() {
  const { gameState } = useGame()
  return gameState.audioSettings?.lang === 'en' ? 'en' : 'fr'
}
