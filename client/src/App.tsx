import { useEffect } from "react";
import { useAudio } from "./lib/stores/useAudio";
import { useSpaceGame } from "./lib/stores/useSpaceGame";
import StartScreen from "./components/game/StartScreen";
import ToolSelection from "./components/game/ToolSelection";
import PlanetSelection from "./components/game/PlanetSelection";
import SpaceTravel from "./components/game/SpaceTravel";
import MazeGame from "./components/game/MazeGame";
import DebrisCollection from "./components/game/DebrisCollection";
import EndGame from "./components/game/EndGame";
import Graveyard from "./components/game/Graveyard";
import RecyclingCenter from "./components/game/RecyclingCenter";
import "@fontsource/inter";

function App() {
  const { gamePhase } = useSpaceGame();
  const { 
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound,
    setSpaceShootSound,
    setMazeSound,
    setGraveyardSound,
    setRecycleSound,
    setWarningSound,
    setExplosionSound
  } = useAudio();

  // Create synthetic space sounds using Web Audio API
  const createSpaceSound = (frequency: number, duration: number, type: 'sine' | 'sawtooth' | 'square' = 'sine') => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    const audio = new Audio();
    audio.play = () => {
      const newOscillator = audioCtx.createOscillator();
      const newGainNode = audioCtx.createGain();
      
      newOscillator.connect(newGainNode);
      newGainNode.connect(audioCtx.destination);
      
      newOscillator.frequency.value = frequency;
      newOscillator.type = type;
      
      newGainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      newGainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      
      newOscillator.start();
      newOscillator.stop(audioCtx.currentTime + duration);
      
      return Promise.resolve();
    };
    
    return audio;
  };

  // Initialize audio
  useEffect(() => {
    const backgroundMusic = new Audio('/sounds/background.mp3');
    const hitSound = new Audio('/sounds/hit.mp3');
    const successSound = new Audio('/sounds/success.mp3');
    
    // Create space-themed synthetic sounds
    const spaceShootSound = createSpaceSound(800, 0.2, 'square');
    const mazeSound = createSpaceSound(400, 0.1, 'sine');
    const graveyardSound = createSpaceSound(200, 0.8, 'sine');
    const recycleSound = createSpaceSound(600, 0.5, 'sawtooth');
    const warningSound = createSpaceSound(300, 0.6, 'sawtooth');
    const explosionSound = createSpaceSound(150, 1.0, 'square');
    
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    
    setBackgroundMusic(backgroundMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);
    setSpaceShootSound(spaceShootSound);
    setMazeSound(mazeSound);
    setGraveyardSound(graveyardSound);
    setRecycleSound(recycleSound);
    setWarningSound(warningSound);
    setExplosionSound(explosionSound);
  }, [setBackgroundMusic, setHitSound, setSuccessSound, setSpaceShootSound, setMazeSound, setGraveyardSound, setRecycleSound, setWarningSound, setExplosionSound]);

  const renderCurrentPhase = () => {
    switch (gamePhase) {
      case 'start':
        return <StartScreen />;
      case 'tool-selection':
        return <ToolSelection />;
      case 'planet-selection':
        return <PlanetSelection />;
      case 'space-travel':
        return <SpaceTravel />;
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
