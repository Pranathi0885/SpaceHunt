import { useEffect, useState } from "react";
import { useSpaceGame } from "../../lib/stores/useSpaceGame";
import { useAudio } from "../../lib/stores/useAudio";

export default function SpaceTravel() {
  const { selectedPlanet, selectedTool, setPhase } = useSpaceGame();
  const { playSpaceShoot } = useAudio();
  const [progress, setProgress] = useState(0);
  const [showRocket, setShowRocket] = useState(true);

  const planetData = {
    mars: { name: "Mars", color: "bg-red-500", emoji: "🔴" },
    jupiter: { name: "Jupiter", color: "bg-orange-400", emoji: "🟠" },
    saturn: { name: "Saturn", color: "bg-yellow-400", emoji: "🟡" },
    uranus: { name: "Uranus", color: "bg-cyan-400", emoji: "🔵" }
  };

  const currentPlanet = selectedPlanet ? planetData[selectedPlanet] : planetData.mars;

  useEffect(() => {
    // Travel animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setPhase("maze-game");
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Play space travel sound
    playSpaceShoot();

    return () => clearInterval(interval);
  }, [setPhase, playSpaceShoot]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-black">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 200 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Moving stars effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={`moving-${i}`}
            className="absolute w-1 h-8 bg-gradient-to-b from-white to-transparent animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: "-10px",
              animation: `moveDown 0.5s linear infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* CSS for moving stars */}
      <style>{`
        @keyframes moveDown {
          from { transform: translateY(-10px); }
          to { transform: translateY(100vh); }
        }
      `}</style>

      <div className="relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-8 animate-pulse">
          🚀 SPACE TRAVEL 🚀
        </h2>

        <div className="mb-8">
          <p className="text-xl text-white mb-2">
            Traveling to <span className="text-cyan-400 font-bold capitalize">{currentPlanet.name}</span>
          </p>
          <p className="text-lg text-gray-300">
            Tool Mission: <span className="text-yellow-400 capitalize">{selectedTool?.replace('-', ' ')}</span>
          </p>
        </div>

        {/* Travel Animation */}
        <div className="relative w-96 h-48 mx-auto mb-8 bg-black/30 rounded-xl border border-purple-400/30 overflow-hidden">
          {/* Rocket */}
          {showRocket && (
            <div 
              className="absolute transition-all duration-100 ease-linear"
              style={{ 
                left: `${progress * 0.8}%`, 
                top: "50%", 
                transform: "translateY(-50%)" 
              }}
            >
              <div className="relative">
                {/* Rocket body */}
                <div className="w-12 h-8 bg-gradient-to-r from-gray-300 to-white rounded-r-full border border-gray-400 relative">
                  {/* Window */}
                  <div className="absolute top-1 left-2 w-3 h-3 bg-cyan-400 rounded-full border border-gray-600"></div>
                  {/* Player inside */}
                  <div className="absolute top-1 left-6 w-2 h-2 bg-orange-400 rounded-full"></div>
                </div>
                {/* Rocket flames */}
                <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-6 h-4 bg-gradient-to-l from-orange-400 via-red-500 to-yellow-400 rounded-l-full animate-pulse"></div>
              </div>
            </div>
          )}

          {/* Destination Planet */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className={`w-16 h-16 ${currentPlanet.color} rounded-full animate-pulse shadow-2xl`}>
              {selectedPlanet === "saturn" && (
                <div className="absolute inset-0 border-2 border-yellow-300 rounded-full transform rotate-12 scale-125"></div>
              )}
              <div className="absolute inset-0 flex items-center justify-center text-2xl">
                {currentPlanet.emoji}
              </div>
            </div>
          </div>

          {/* Progress trail */}
          <div className="absolute bottom-4 left-4 right-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Progress Info */}
        <div className="text-center">
          <p className="text-2xl font-bold text-white mb-2">
            {progress < 100 ? `${Math.round(progress)}% Complete` : "Arriving at destination!"}
          </p>
          <p className="text-gray-300 text-sm">
            {progress < 50 ? "Accelerating through space..." : 
             progress < 90 ? "Approaching target planet..." : 
             "Preparing for landing..."}
          </p>
        </div>
      </div>
    </div>
  );
}