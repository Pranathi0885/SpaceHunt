import { useState } from "react";
import { useSpaceGame, Planet, Difficulty } from "../../lib/stores/useSpaceGame";
import { useAudio } from "../../lib/stores/useAudio";

export default function PlanetSelection() {
  const { selectedTool, setPhase, setPlanet, setDifficulty } = useSpaceGame();
  const { playSuccess } = useAudio();
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);
  const [selectedPlanetId, setSelectedPlanetId] = useState<Planet | null>(null);

  const planets: { id: Planet; name: string; tool: string; color: string; size: string }[] = [
    { id: "mars", name: "Mars", tool: "Space Net", color: "bg-red-500", size: "w-20 h-20" },
    { id: "jupiter", name: "Jupiter", tool: "Magnetic Collector", color: "bg-orange-400", size: "w-32 h-32" },
    { id: "saturn", name: "Saturn", tool: "Robotic Hand", color: "bg-yellow-400", size: "w-28 h-28" },
    { id: "uranus", name: "Uranus", tool: "Laser Collector", color: "bg-cyan-400", size: "w-24 h-24" }
  ];

  const getToolForPlanet = (planetId: Planet) => {
    const toolMap = {
      "mars": "net",
      "jupiter": "magnetic-collector", 
      "saturn": "robotic-hand",
      "uranus": "laser"
    };
    return toolMap[planetId];
  };

  const handlePlanetSelect = (planet: Planet) => {
    const planetTool = getToolForPlanet(planet);
    if (planetTool === selectedTool) {
      setSelectedPlanetId(planet);
      setShowDifficultySelect(true);
    }
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    if (selectedPlanetId) {
      playSuccess();
      setPlanet(selectedPlanetId);
      setDifficulty(difficulty);
      setPhase("maze-game");
    }
  };

  if (showDifficultySelect) {
    const difficulties: { id: Difficulty; name: string; description: string; color: string }[] = [
      { id: "easy", name: "Easy", description: "Small maze, perfect for beginners", color: "from-green-600 to-green-700" },
      { id: "medium", name: "Medium", description: "Moderate challenge with balanced gameplay", color: "from-yellow-600 to-yellow-700" },
      { id: "hard", name: "Hard", description: "Large maze for experienced players", color: "from-red-600 to-red-700" }
    ];

    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Select Difficulty Level
          </h2>
          <p className="text-lg text-gray-300">
            Destination: <span className="text-cyan-400 font-bold capitalize">{selectedPlanetId}</span>
          </p>
          <p className="text-sm text-gray-400 mt-2">Choose your maze difficulty for tool retrieval</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-8">
          {difficulties.map((difficulty) => (
            <div
              key={difficulty.id}
              onClick={() => handleDifficultySelect(difficulty.id)}
              className={`bg-gradient-to-br ${difficulty.color} backdrop-blur-sm rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-600 hover:border-white`}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{difficulty.name}</h3>
                <p className="text-gray-200 text-sm">{difficulty.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowDifficultySelect(false)}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Back to Planets
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Choose Your Destination
        </h2>
        <p className="text-lg text-gray-300">
          Selected Tool: <span className="text-cyan-400 font-bold capitalize">{selectedTool?.replace('-', ' ')}</span>
        </p>
        <p className="text-sm text-gray-400 mt-2">Travel to the planet where your tool is hidden</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl w-full mb-8">
        {planets.map((planet) => {
          const isCorrectPlanet = getToolForPlanet(planet.id) === selectedTool;
          
          return (
            <div
              key={planet.id}
              onClick={() => handlePlanetSelect(planet.id)}
              className={`relative flex flex-col items-center p-6 rounded-xl transition-all duration-300 ${
                isCorrectPlanet 
                  ? 'cursor-pointer hover:scale-105 bg-gradient-to-br from-green-800/30 to-green-900/30 border-2 border-green-400'
                  : 'opacity-50 cursor-not-allowed bg-gray-800/30 border border-gray-600'
              }`}
            >
              {/* Planet */}
              <div className={`${planet.color} ${planet.size} rounded-full mb-4 shadow-2xl relative`}>
                {planet.id === "saturn" && (
                  <div className="absolute inset-0 border-4 border-yellow-300 rounded-full transform rotate-12 scale-150"></div>
                )}
                {planet.id === "jupiter" && (
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-300 to-orange-600 rounded-full">
                    <div className="absolute top-1/3 left-0 right-0 h-2 bg-orange-700/50"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-orange-800/50"></div>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{planet.name}</h3>
              <p className="text-sm text-gray-300 text-center">Tool: {planet.tool}</p>
              
              {isCorrectPlanet && (
                <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors text-sm font-bold">
                  Start Mission
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setPhase("tool-selection")}
        className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        ← Back to Tool Selection
      </button>
    </div>
  );
}
