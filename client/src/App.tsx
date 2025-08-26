import { useEffect } from "react";
import { useAudio } from "./lib/stores/useAudio";
import { useSpaceGame } from "./lib/stores/useSpaceGame";
import StartScreen from "./components/game/StartScreen";
import ToolSelection from "./components/game/ToolSelection";
import PlanetSelection from "./components/game/PlanetSelection";
import MazeGame from "./components/game/MazeGame";
import DebrisCollection from "./components/game/DebrisCollection";
import EndGame from "./components/game/EndGame";
import Graveyard from "./components/game/Graveyard";
import RecyclingCenter from "./components/game/RecyclingCenter";
import "@fontsource/inter";

function App() {
  const { gamePhase } = useSpaceGame();
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  // Initialize audio
  useEffect(() => {
    const backgroundMusic = new Audio('/sounds/background.mp3');
    const hitSound = new Audio('/sounds/hit.mp3');
    const successSound = new Audio('/sounds/success.mp3');
    
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    
    setBackgroundMusic(backgroundMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  const renderCurrentPhase = () => {
    switch (gamePhase) {
      case 'start':
        return <StartScreen />;
      case 'tool-selection':
        return <ToolSelection />;
      case 'planet-selection':
        return <PlanetSelection />;
      case 'maze-game':
        return <MazeGame />;
      case 'debris-collection':
        return <DebrisCollection />;
      case 'end-game':
        return <EndGame />;
      case 'graveyard':
        return <Graveyard />;
      case 'recycling':
        return <RecyclingCenter />;
      default:
        return <StartScreen />;
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-black">
      {renderCurrentPhase()}
    </div>
  );
}

export default App;
