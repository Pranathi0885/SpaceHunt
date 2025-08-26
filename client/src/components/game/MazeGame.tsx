import { useEffect, useRef, useState } from "react";
import { useSpaceGame } from "../../lib/stores/useSpaceGame";
import { useAudio } from "../../lib/stores/useAudio";

interface MazeCell {
  x: number;
  y: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  visited: boolean;
}

export default function MazeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { selectedTool, selectedPlanet, difficulty, setPhase, setToolRetrieved } = useSpaceGame();
  const { playSuccess, playHit } = useAudio();
  
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [toolPos] = useState({ x: 0, y: 0 }); // Will be set based on maze size
  const [maze, setMaze] = useState<MazeCell[][]>([]);
  const [gameWon, setGameWon] = useState(false);

  // Maze configuration based on difficulty
  const getMazeConfig = () => {
    switch (difficulty) {
      case "easy": return { size: 8, cellSize: 40 };
      case "medium": return { size: 12, cellSize: 35 };
      case "hard": return { size: 16, cellSize: 30 };
      default: return { size: 12, cellSize: 35 };
    }
  };

  const { size: mazeSize, cellSize } = getMazeConfig();

  // Generate maze using recursive backtracking
  const generateMaze = (size: number): MazeCell[][] => {
    const maze: MazeCell[][] = [];
    
    // Initialize maze
    for (let y = 0; y < size; y++) {
      maze[y] = [];
      for (let x = 0; x < size; x++) {
        maze[y][x] = {
          x, y,
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false
        };
      }
    }

    // Recursive backtracking algorithm
    const stack: MazeCell[] = [];
    const current = maze[0][0];
    current.visited = true;
    stack.push(current);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = getUnvisitedNeighbors(current, maze, size);
      
      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        removeWall(current, next);
        next.visited = true;
        stack.push(next);
      } else {
        stack.pop();
      }
    }

    return maze;
  };

  const getUnvisitedNeighbors = (cell: MazeCell, maze: MazeCell[][], size: number): MazeCell[] => {
    const neighbors: MazeCell[] = [];
    const { x, y } = cell;

    if (y > 0 && !maze[y - 1][x].visited) neighbors.push(maze[y - 1][x]); // top
    if (x < size - 1 && !maze[y][x + 1].visited) neighbors.push(maze[y][x + 1]); // right
    if (y < size - 1 && !maze[y + 1][x].visited) neighbors.push(maze[y + 1][x]); // bottom
    if (x > 0 && !maze[y][x - 1].visited) neighbors.push(maze[y][x - 1]); // left

    return neighbors;
  };

  const removeWall = (current: MazeCell, next: MazeCell) => {
    const dx = current.x - next.x;
    const dy = current.y - next.y;

    if (dx === 1) { // current is right of next
      current.walls.left = false;
      next.walls.right = false;
    } else if (dx === -1) { // current is left of next
      current.walls.right = false;
      next.walls.left = false;
    } else if (dy === 1) { // current is below next
      current.walls.top = false;
      next.walls.bottom = false;
    } else if (dy === -1) { // current is above next
      current.walls.bottom = false;
      next.walls.top = false;
    }
  };

  // Initialize maze
  useEffect(() => {
    const newMaze = generateMaze(mazeSize);
    setMaze(newMaze);
    setPlayerPos({ x: 0, y: 0 });
    // Set tool position at bottom-right corner
    const toolPosition = { x: mazeSize - 1, y: mazeSize - 1 };
    // Update toolPos state would require useState setter
  }, [mazeSize]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameWon) return;

      let newX = playerPos.x;
      let newY = playerPos.y;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (!maze[playerPos.y]?.[playerPos.x]?.walls.top) newY--;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (!maze[playerPos.y]?.[playerPos.x]?.walls.bottom) newY++;
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (!maze[playerPos.y]?.[playerPos.x]?.walls.left) newX--;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (!maze[playerPos.y]?.[playerPos.x]?.walls.right) newX++;
          break;
      }

      if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize) {
        setPlayerPos({ x: newX, y: newY });
        
        // Check if player reached the tool
        if (newX === mazeSize - 1 && newY === mazeSize - 1) {
          setGameWon(true);
          playSuccess();
          setToolRetrieved(true);
        }
      } else {
        playHit(); // Wall collision sound
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playerPos, maze, mazeSize, gameWon, playSuccess, playHit, setToolRetrieved]);

  // Render maze
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || maze.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw maze walls
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;

    for (let y = 0; y < mazeSize; y++) {
      for (let x = 0; x < mazeSize; x++) {
        const cell = maze[y][x];
        const startX = x * cellSize;
        const startY = y * cellSize;

        if (cell.walls.top) {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX + cellSize, startY);
          ctx.stroke();
        }
        if (cell.walls.right) {
          ctx.beginPath();
          ctx.moveTo(startX + cellSize, startY);
          ctx.lineTo(startX + cellSize, startY + cellSize);
          ctx.stroke();
        }
        if (cell.walls.bottom) {
          ctx.beginPath();
          ctx.moveTo(startX + cellSize, startY + cellSize);
          ctx.lineTo(startX, startY + cellSize);
          ctx.stroke();
        }
        if (cell.walls.left) {
          ctx.beginPath();
          ctx.moveTo(startX, startY + cellSize);
          ctx.lineTo(startX, startY);
          ctx.stroke();
        }
      }
    }

    // Draw player
    ctx.fillStyle = "#00ffff";
    ctx.fillRect(
      playerPos.x * cellSize + cellSize / 4,
      playerPos.y * cellSize + cellSize / 4,
      cellSize / 2,
      cellSize / 2
    );

    // Draw tool at exit
    ctx.fillStyle = "#ffff00";
    ctx.fillRect(
      (mazeSize - 1) * cellSize + cellSize / 4,
      (mazeSize - 1) * cellSize + cellSize / 4,
      cellSize / 2,
      cellSize / 2
    );

  }, [maze, playerPos, mazeSize, cellSize]);

  const handleContinue = () => {
    setPhase("debris-collection");
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-white mb-2">Tool Retrieval Mission</h2>
        <p className="text-lg text-gray-300">
          Planet: <span className="text-cyan-400 capitalize">{selectedPlanet}</span> | 
          Tool: <span className="text-yellow-400 capitalize">{selectedTool?.replace('-', ' ')}</span>
        </p>
        <p className="text-sm text-gray-400">Navigate to the yellow square to retrieve your tool!</p>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={mazeSize * cellSize}
          height={mazeSize * cellSize}
          className="border-2 border-gray-400 bg-black"
        />
        
        {gameWon && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-green-600 text-white p-6 rounded-xl text-center">
              <h3 className="text-2xl font-bold mb-2">Tool Retrieved!</h3>
              <p className="mb-4">You successfully retrieved your {selectedTool?.replace('-', ' ')}!</p>
              <button
                onClick={handleContinue}
                className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
              >
                Continue to Space Mission
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-300 text-sm">Use WASD or Arrow Keys to move</p>
        <p className="text-gray-400 text-xs">Difficulty: {difficulty}</p>
      </div>
    </div>
  );
}
