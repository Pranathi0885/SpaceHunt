export default function GameInstructions() {
  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto text-white">
      <h3 className="text-xl font-bold mb-4 text-cyan-400">How to Play:</h3>
      <ul className="space-y-2 text-left text-sm">
        <li>• Choose a collection tool for your debris hunting mission</li>
        <li>• Travel to the planet where your chosen tool is hidden</li>
        <li>• Navigate through a maze to retrieve your tool</li>
        <li>• Collect space debris while avoiding satellites (55 seconds)</li>
        <li>• Dispose debris in space graveyard (150 pts) or recycle (250 pts)</li>
        <li>• Magnetic collectors attract debris and repel satellites!</li>
      </ul>
    </div>
  );
}
