import GameContainer from './components/GameContainer'
import { GameProvider } from './context/GameContext'

export default function App() {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  )
}
