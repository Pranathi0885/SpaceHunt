import { useState } from "react";
import { useSpaceGame } from "../../lib/stores/useSpaceGame";
import { useAudio } from "../../lib/stores/useAudio";

type RecyclingOption = "metal-rods" | "storage-containers" | "spacecraft-parts" | "station-components";

export default function RecyclingCenter() {
  const { collectedDebris, addScore, setPhase } = useSpaceGame();
  const { playSuccess, playRecycle } = useAudio();
  
  const [selectedOption, setSelectedOption] = useState<RecyclingOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const recyclingOptions = [
    {
      id: "metal-rods" as RecyclingOption,
      name: "Metal Rods",
      description: "Transform debris into useful metal rods",
      icon: "🔧",
      resultIcon: "🏗️"
    },
    {
      id: "storage-containers" as RecyclingOption,
      name: "Storage Containers",
      description: "Create storage containers for space missions",
      icon: "📦",
      resultIcon: "🗃️"
    },
    {
      id: "spacecraft-parts" as RecyclingOption,
      name: "New Spacecraft Parts", 
      description: "Manufacture new spacecraft components",
      icon: "🛰️",
      resultIcon: "🚀"
    },
    {
      id: "station-components" as RecyclingOption,
      name: "Space Station Components",
      description: "Build components for space stations",
      icon: "🏭",
      resultIcon: "🛸"
    }
  ];

  const handleOptionSelect = async (option: RecyclingOption) => {
    setSelectedOption(option);
    setIsProcessing(true);
    
    // Add recycling points
    const totalPoints = collectedDebris * 250;
    addScore(totalPoints);
    playSuccess();
    playRecycle(); // Add recycling process sound
    
    // Processing animation
    setTimeout(() => {
      setIsProcessing(false);
      setShowResult(true);
    }, 2000);
  };

  const getThankYouMessage = (option: RecyclingOption) => {
    const messages = {
      "metal-rods": "Thank you for recycling me into a metal rod!",
      "storage-containers": "Thank you for recycling me into a storage container!",
      "spacecraft-parts": "Thank you for recycling me into a new spacecraft part!",
      "station-components": "Thank you for recycling me into a space station component!"
    };
    return messages[option];
  };

  const handleComplete = () => {
    setPhase("start");
  };

  if (showResult && selectedOption) {
    const option = recyclingOptions.find(opt => opt.id === selectedOption)!;
    
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-green-400 mb-8">Recycling Complete!</h2>
          
          <div className="bg-green-800/30 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto mb-8">
            <div className="text-6xl mb-4">{option.resultIcon}</div>
            <h3 className="text-2xl font-bold text-white mb-4">{option.name} Created!</h3>
            <p className="text-green-300 text-lg mb-4">
              {getThankYouMessage(selectedOption)}
            </p>
            <p className="text-yellow-400 font-bold text-xl">
              +{collectedDebris * 250} Points Earned!
            </p>
          </div>
          
          <button
            onClick={handleComplete}
            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white text-lg font-bold rounded-xl hover:from-cyan-500 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Return to Main Menu
          </button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-blue-400 mb-8">Processing Debris...</h2>
          
          <div className="relative">
            {/* Spinning recycling animation */}
            <div className="w-32 h-32 border-8 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">♻️</span>
            </div>
          </div>
          
          <p className="text-white text-xl">
            Transforming {collectedDebris} pieces of debris...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4">
          Recycling Center
        </h2>
        <p className="text-xl text-white mb-2">
          Debris to Process: <span className="text-yellow-400 font-bold">{collectedDebris}</span>
        </p>
        <p className="text-gray-300">Choose what you want to recycle your debris into (+250 points each)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mb-8">
        {recyclingOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            className="bg-gradient-to-br from-green-800/30 to-blue-800/30 backdrop-blur-sm rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30 border border-green-700 hover:border-green-400"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">{option.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{option.name}</h3>
              <p className="text-gray-300 text-sm mb-4">{option.description}</p>
              <div className="text-yellow-400 font-bold">
                +{collectedDebris * 250} points
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setPhase("end-game")}
        className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        ← Back to Results
      </button>
    </div>
  );
}
