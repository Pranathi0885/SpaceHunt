import { useSpaceGame } from "../../lib/stores/useSpaceGame";

export default function EndGame() {
  const { 
    score, 
    collectedDebris, 
    collectedSatellites, 
    setPhase, 
    resetGame 
  } = useSpaceGame();

  const handleDisposal = () => {
    setPhase("graveyard");
  };

  const handleRecycling = () => {
    setPhase("recycling");
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6">
          Mission Complete!
        </h2>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">Mission Statistics</h3>
          
          <div className="space-y-3 text-lg">
            <div className="flex justify-between text-white">
              <span>Debris Collected:</span>
              <span className="text-green-400 font-bold">{collectedDebris}</span>
            </div>
            
            <div className="flex justify-between text-white">
              <span>Satellites Hit:</span>
              <span className="text-red-400 font-bold">{collectedSatellites}</span>
            </div>
            
            <div className="border-t border-gray-600 pt-3 flex justify-between text-xl font-bold">
              <span className="text-white">Current Score:</span>
              <span className="text-yellow-400">{score}</span>
            </div>
          </div>
        </div>
      </div>

      {collectedDebris > 0 && (
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">
            What would you like to do with your collected debris?
          </h3>
          
          <div className="flex gap-8 justify-center">
            <button
              onClick={handleDisposal}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-lg font-bold rounded-xl hover:from-red-500 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              🪦 Dispose/Bury
              <div className="text-sm font-normal mt-1">+150 points per debris</div>
            </button>
            
            <button
              onClick={handleRecycling}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-bold rounded-xl hover:from-green-500 hover:to-green-600 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              ♻️ Recycle
              <div className="text-sm font-normal mt-1">+250 points per debris</div>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handlePlayAgain}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-lg font-bold rounded-xl hover:from-purple-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-xl"
      >
        🚀 Play Again
      </button>
    </div>
  );
}
