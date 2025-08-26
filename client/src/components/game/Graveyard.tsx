import { useState } from "react";
import { useSpaceGame } from "../../lib/stores/useSpaceGame";
import { useAudio } from "../../lib/stores/useAudio";

export default function Graveyard() {
  const { collectedDebris, addScore, setPhase } = useSpaceGame();
  const { playSuccess } = useAudio();
  
  const [debrisRemaining, setDebrisRemaining] = useState(collectedDebris);
  const [selectedGrave, setSelectedGrave] = useState<number | null>(null);

  const [graves, setGraves] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      occupied: false,
      debrisCount: 0
    }))
  );

  const handleGraveClick = (graveIndex: number) => {
    if (debrisRemaining > 0) {
      setSelectedGrave(graveIndex);
      setDebrisRemaining(prev => prev - 1);
      addScore(150); // 150 points for disposal
      playSuccess();
      
      // Update grave with debris
      setGraves(prev => prev.map((grave, i) => 
        i === graveIndex ? { ...grave, occupied: true, debrisCount: grave.debrisCount + 1 } : grave
      ));
      
      // Animation feedback
      setTimeout(() => setSelectedGrave(null), 500);
      
      // If all debris disposed, show completion
      if (debrisRemaining === 1) {
        setTimeout(() => {
          setPhase("start");
        }, 1000);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      {/* Space background with stars */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 200 }, (_, i) => (
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

      <div className="relative z-10 text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-400 mb-4">
          Space Graveyard
        </h2>
        <p className="text-xl text-white mb-2">
          Debris Remaining: <span className="text-yellow-400 font-bold">{debrisRemaining}</span>
        </p>
        <p className="text-gray-300">Click on any grave to dispose of debris (+150 points each)</p>
      </div>

      {/* Space Graveyard */}
      <div className="relative z-10 flex gap-6 mb-8">
        {graves.map((grave, index) => (
          <div
            key={grave.id}
            onClick={() => handleGraveClick(index)}
            className={`relative cursor-pointer transform transition-all duration-300 hover:scale-110 ${
              selectedGrave === index ? 'animate-bounce' : ''
            } ${debrisRemaining > 0 ? 'hover:brightness-125' : 'opacity-50 cursor-not-allowed'}`}
          >
            {/* Space grave mound with cosmic effect */}
            <div className="w-20 h-14 bg-gradient-to-b from-purple-600 via-gray-700 to-gray-900 rounded-t-full mb-2 border border-purple-400/30">
              {/* Cosmic particles effect */}
              <div className="w-full h-full rounded-t-full bg-gradient-to-b from-cyan-400/20 to-transparent animate-pulse"></div>
            </div>
            
            {/* Space gravestone */}
            <div className="w-14 h-20 bg-gradient-to-b from-gray-300 via-gray-500 to-gray-800 rounded-t-lg mx-auto relative border border-gray-400">
              {/* Space debris symbol */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-cyan-400 text-sm">🛰️</div>
              
              {/* Grave number */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold bg-gray-800/80 px-1 rounded">
                {index + 1}
              </div>
              
              {/* Debris count indicator */}
              {grave.debrisCount > 0 && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs font-bold">
                  {grave.debrisCount}
                </div>
              )}
            </div>
            
            {/* Disposal effect */}
            {selectedGrave === index && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 text-green-400 font-bold animate-pulse text-lg">
                +150
              </div>
            )}
            
            {/* Cosmic glow for occupied graves */}
            {grave.occupied && (
              <div className="absolute inset-0 bg-purple-400/10 rounded-full blur-sm animate-pulse"></div>
            )}
          </div>
        ))}
      </div>

      {/* Ground/surface */}
      <div className="relative z-10 w-full max-w-2xl h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-lg"></div>

      {debrisRemaining === 0 && (
        <div className="relative z-10 mt-8 text-center">
          <div className="bg-green-800/30 backdrop-blur-sm rounded-xl p-6 mb-6 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-green-400 mb-2">All Debris Disposed!</h3>
            <p className="text-white mb-2">You earned <span className="text-yellow-400 font-bold">{collectedDebris * 150}</span> points!</p>
            <p className="text-gray-300 text-sm">The space is now safer thanks to your efforts!</p>
          </div>
          <button
            onClick={() => setPhase("start")}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-bold rounded-xl hover:from-green-500 hover:to-green-600 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Return to Main Menu
          </button>
        </div>
      )}
    </div>
  );
}
