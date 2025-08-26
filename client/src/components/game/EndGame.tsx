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

  // Calculate star rating based on score
  const getStarRating = (score: number) => {
    if (score >= 1000) return 3;
    if (score >= 750) return 2.5;
    if (score >= 500) return 2;
    return 1;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-6xl text-yellow-400 drop-shadow-lg animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
          ⭐
        </span>
      );
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-6xl text-yellow-400 drop-shadow-lg animate-pulse" style={{ animationDelay: `${fullStars * 0.2}s` }}>
          🌟
        </span>
      );
    }
    
    // Add empty stars to make total of 3
    const totalStars = hasHalfStar ? fullStars + 1 : fullStars;
    for (let i = totalStars; i < 3; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-6xl text-gray-500 drop-shadow-lg opacity-50">
          ⭐
        </span>
      );
    }
    
    return stars;
  };

  const getPerformanceMessage = (rating: number) => {
    if (rating >= 3) return "🏆 LEGENDARY SPACE CLEANER! 🏆";
    if (rating >= 2.5) return "🥈 EXCELLENT DEBRIS HUNTER! 🥈";
    if (rating >= 2) return "🥉 GOOD SPACE MISSION! 🥉";
    return "Keep practicing, Space Cadet!";
  };

  const starRating = getStarRating(score);
  const performanceMessage = getPerformanceMessage(starRating);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6">
          Mission Complete!
        </h2>
        
        {/* Star Rating Display */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            {renderStars(starRating)}
          </div>
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-2">
            {performanceMessage}
          </p>
          <p className="text-lg text-gray-300">
            You earned <span className="text-yellow-400 font-bold">{starRating}</span> out of 3 stars!
          </p>
        </div>
        
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
              <span className="text-white">Final Score:</span>
              <span className="text-yellow-400">{score}</span>
            </div>
            
            {/* Score breakdown */}
            <div className="border-t border-gray-600 pt-3 text-sm text-gray-300">
              <p>Score Targets:</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className={score >= 500 ? 'text-green-400' : 'text-gray-500'}>
                  ⭐⭐ 500+ points
                </div>
                <div className={score >= 750 ? 'text-green-400' : 'text-gray-500'}>
                  ⭐⭐🌟 750+ points
                </div>
                <div className={`col-span-2 ${score >= 1000 ? 'text-green-400' : 'text-gray-500'}`}>
                  ⭐⭐⭐ 1000+ points
                </div>
              </div>
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
