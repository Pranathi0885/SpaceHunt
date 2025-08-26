import { useSpaceGame, Tool } from "../../lib/stores/useSpaceGame";
import { useAudio } from "../../lib/stores/useAudio";

export default function ToolSelection() {
  const { setPhase, setTool } = useSpaceGame();
  const { playSuccess } = useAudio();

  const tools: { id: Tool; name: string; description: string; icon: string }[] = [
    {
      id: "magnetic-collector",
      name: "Magnetic Collector",
      description: "Attracts metallic debris and repels satellites",
      icon: "🧲"
    },
    {
      id: "net",
      name: "Space Net",
      description: "Captures debris of all sizes effectively",
      icon: "🕸️"
    },
    {
      id: "robotic-hand",
      name: "Robotic Hand",
      description: "Precise control for selective debris collection",
      icon: "🤖"
    },
    {
      id: "laser",
      name: "Laser Collector",
      description: "High-tech beam for instant debris capture",
      icon: "⚡"
    }
  ];

  const handleToolSelect = (tool: Tool) => {
    playSuccess();
    setTool(tool);
    setPhase("planet-selection");
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
          Choose Your Tool
        </h2>
        <p className="text-xl text-white">Select a debris collection tool for your mission</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => handleToolSelect(tool.id)}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/30 border border-gray-700 hover:border-cyan-400"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">{tool.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{tool.name}</h3>
              <p className="text-gray-300">{tool.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setPhase("start")}
        className="mt-8 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}
