import { useState } from "react";
import { useSpaceGame } from "../../lib/stores/useSpaceGame";
import { useAudio } from "../../lib/stores/useAudio";

export default function Graveyard() {
  const { collectedDebris, addScore, setPhase } = useSpaceGame();
  const { playSuccess } = useAudio();
  
  const [debrisRemaining, setDebrisRemaining] = useState(collectedDebris);
  const [selectedGrave, setSelectedGrave] = useState<number | null>(null);

  const graves = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    occupied: false
  }));

  const handleGraveClick = (graveIndex: number) => {
    if (debrisRemaining > 0) {
      setSelectedGrave(graveIndex);
      setDebrisRemaining(prev => prev - 1);
      addScore(150); // 150 points for disposal
      playSuccess();
      
      // Animation feedback
      setTimeout(() => setSelectedGrave(null), 500);
      
      // If all debris disposed, show completion
      if (debrisRemaining === 1) {
        setTimeout(() => {
          alert(`All debris disposed! You earned ${collectedDebris * 150} points!`);
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

      {/* Graveyard */}
      <div className="relative z-10 flex gap-8 mb-8">
        {graves.map((grave, index) => (
          <div
            key={grave.id}
            onClick={() => handleGraveClick(index)}
            className={`relative cursor-pointer transform transition-all duration-300 hover:scale-110 ${
              selectedGrave === index ? 'animate-bounce' : ''
            } ${debrisRemaining > 0 ? 'hover:brightness-125' : 'opacity-50 cursor-not-allowed'}`}
          >
            {/* Grave mound */}
            <div className="w-16 h-12 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-full mb-2"></div>
            
            {/* Gravestone */}
            <div className="w-12 h-16 bg-gradient-to-b from-gray-400 to-gray-600 rounded-t-lg mx-auto relative">
              {/* Cross on gravestone */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-xs">✝</div>
              
              {/* Grave number */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold">
                {index + 1}
              </div>
            </div>
            
            {/* Disposal effect */}
            {selectedGrave === index && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 text-green-400 font-bold animate-pulse">
                +150
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ground/surface */}
      <div className="relative z-10 w-full max-w-2xl h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-lg"></div>

      {debrisRemaining === 0 && (
        <div className="relative z-10 mt-8 text-center">
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
