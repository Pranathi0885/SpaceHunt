import { useSpaceGame } from "../../lib/stores/useSpaceGame";
import { useAudio } from "../../lib/stores/useAudio";
import GameInstructions from "./GameInstructions";

export default function StartScreen() {
  const { setPhase } = useSpaceGame();
  const { backgroundMusic, isMuted, toggleMute } = useAudio();

  const handleStartGame = () => {
    if (backgroundMusic && !isMuted) {
      backgroundMusic.play().catch(console.log);
    }
    setPhase("tool-selection");
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Earth in background */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <div className="w-96 h-96 rounded-full bg-gradient-to-br from-blue-400 via-green-400 to-blue-600 shadow-2xl">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-transparent via-green-300/30 to-transparent">
            {/* Continents */}
            <div className="absolute top-8 left-12 w-16 h-12 bg-green-600/60 rounded-lg"></div>
            <div className="absolute top-20 right-16 w-20 h-8 bg-green-600/60 rounded-lg"></div>
            <div className="absolute bottom-16 left-20 w-12 h-16 bg-green-600/60 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Rocket */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="relative">
          {/* Rocket body */}
          <div className="w-8 h-24 bg-gradient-to-t from-gray-300 to-white rounded-t-full border-2 border-gray-400">
            {/* Window */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full border border-gray-600"></div>
            {/* Details */}
            <div className="absolute top-12 left-1 w-6 h-1 bg-red-500"></div>
            <div className="absolute top-16 left-1 w-6 h-1 bg-blue-500"></div>
          </div>
          {/* Rocket fins */}
          <div className="absolute bottom-0 -left-2 w-0 h-0 border-l-4 border-r-0 border-b-8 border-l-transparent border-b-gray-400"></div>
          <div className="absolute bottom-0 -right-2 w-0 h-0 border-r-4 border-l-0 border-b-8 border-r-transparent border-b-gray-400"></div>
          {/* Fire */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-orange-400 to-red-600 rounded-b-lg animate-pulse"></div>
        </div>
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-8">
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse">
          SPACE HUNT MISSION
        </h1>
        
        <p className="text-xl md:text-2xl text-white font-medium max-w-2xl mx-auto leading-relaxed">
          An Epic Orbital Adventure Awaits!
        </p>

        <div className="space-y-6">
          <button
            onClick={handleStartGame}
            className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xl font-bold rounded-full hover:from-cyan-400 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50"
          >
            START MISSION
          </button>

          <div className="flex justify-center">
            <button
              onClick={toggleMute}
              className="px-6 py-2 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 transition-all duration-300"
            >
              {isMuted ? "🔇 Unmute" : "🔊 Mute"}
            </button>
          </div>
        </div>

        <GameInstructions />
      </div>
    </div>
  );
}
