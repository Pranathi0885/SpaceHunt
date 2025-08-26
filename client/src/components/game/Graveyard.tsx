import { useState } from "react";
import { useSpaceGame } from "../../lib/stores/useSpaceGame";
import { useAudio } from "../../lib/stores/useAudio";

export default function Graveyard() {
  const { collectedDebris, addScore, setPhase } = useSpaceGame();
  const { playSuccess, playGraveyard } = useAudio();
  
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
      playGraveyard(); // Add graveyard disposal sound
      
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
      {/* Enhanced space background with nebula and stars */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Nebula background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-black animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-900/20 via-transparent to-purple-800/30 animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        
        {/* Enhanced star field */}
        {Array.from({ length: 300 }, (_, i) => {
          const size = Math.random() > 0.8 ? 'w-2 h-2' : 'w-1 h-1';
          const brightness = Math.random() > 0.9 ? 'bg-cyan-300' : Math.random() > 0.7 ? 'bg-blue-200' : 'bg-white';
          return (
            <div
              key={i}
              className={`absolute ${size} ${brightness} rounded-full animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${1 + Math.random() * 3}s`
              }}
            />
          );
        })}
        
        {/* Distant galaxies */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`galaxy-${i}`}
            className="absolute w-12 h-12 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 rounded-full blur-lg animate-pulse"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center mb-8">
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-red-400 mb-4 animate-pulse">
            🌌 COSMIC GRAVEYARD 🌌
          </h2>
          {/* Atmospheric glow behind title */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg blur-xl -z-10"></div>
        </div>
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

      {/* Enhanced space graveyard surface */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Main ground surface with crater texture */}
        <div className="h-8 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg relative overflow-hidden">
          {/* Surface texture and craters */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-600/50 to-transparent"></div>
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute w-3 h-1 bg-gray-900 rounded-full"
              style={{
                left: `${(i * 8 + Math.random() * 5)}%`,
                top: `${Math.random() * 60}%`
              }}
            />
          ))}
          
          {/* Cosmic dust particles */}
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`dust-${i}`}
              className="absolute w-1 h-1 bg-purple-300/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        {/* Underground glow effect */}
        <div className="h-2 bg-gradient-to-r from-purple-900/30 via-cyan-900/40 to-purple-900/30 rounded-b-lg blur-sm"></div>
      </div>

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
