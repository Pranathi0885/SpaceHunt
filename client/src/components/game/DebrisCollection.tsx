import { useEffect, useRef, useState, useCallback } from "react";
import { useSpaceGame } from "../../lib/stores/useSpaceGame";
import { useAudio } from "../../lib/stores/useAudio";
import { calculateEllipticalPosition } from "../../lib/orbitalMechanics";

interface GameObject {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  type: 'debris' | 'satellite';
  orbitRadius: number;
  orbitSpeed: number;
  angle: number;
  centerX: number;
  centerY: number;
  debrisType?: string;
}

export default function DebrisCollection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gameObjectsRef = useRef<GameObject[]>([]);
  
  const { 
    selectedTool, 
    timeRemaining, 
    setTimeRemaining, 
    incrementDebris, 
    incrementSatellites, 
    setPhase 
  } = useSpaceGame();
  
  const { playHit, playSuccess } = useAudio();
  
  const [playerPos, setPlayerPos] = useState({ x: 400, y: 300 });
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [showSatelliteMessage, setShowSatelliteMessage] = useState(false);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;

  // Debris types
  const debrisTypes = ['nut', 'screw', 'bolt', 'switch', 'glass', 'metal'];

  // Initialize game objects
  const initializeGameObjects = useCallback(() => {
    const objects: GameObject[] = [];
    
    // Create satellites
    for (let i = 0; i < 3; i++) {
      const centerX = Math.random() * CANVAS_WIDTH;
      const centerY = Math.random() * CANVAS_HEIGHT;
      const orbitRadius = 80 + Math.random() * 60;
      
      objects.push({
        id: `satellite-${i}`,
        x: centerX + orbitRadius,
        y: centerY,
        vx: 0,
        vy: 0,
        width: 40,
        height: 20,
        type: 'satellite',
        orbitRadius,
        orbitSpeed: 0.01 + Math.random() * 0.01,
        angle: Math.random() * Math.PI * 2,
        centerX,
        centerY
      });
    }
    
    // Create initial debris
    for (let i = 0; i < 8; i++) {
      const centerX = Math.random() * CANVAS_WIDTH;
      const centerY = Math.random() * CANVAS_HEIGHT;
      const orbitRadius = 60 + Math.random() * 100;
      
      objects.push({
        id: `debris-${i}`,
        x: centerX + orbitRadius,
        y: centerY,
        vx: 0,
        vy: 0,
        width: 12 + Math.random() * 8,
        height: 12 + Math.random() * 8,
        type: 'debris',
        orbitRadius,
        orbitSpeed: 0.008 + Math.random() * 0.012,
        angle: Math.random() * Math.PI * 2,
        centerX,
        centerY,
        debrisType: debrisTypes[Math.floor(Math.random() * debrisTypes.length)]
      });
    }
    
    gameObjectsRef.current = objects;
  }, []);

  // Spawn new debris continuously
  const spawnDebris = useCallback(() => {
    const centerX = Math.random() * CANVAS_WIDTH;
    const centerY = Math.random() * CANVAS_HEIGHT;
    const orbitRadius = 60 + Math.random() * 100;
    
    const newDebris: GameObject = {
      id: `debris-${Date.now()}-${Math.random()}`,
      x: centerX + orbitRadius,
      y: centerY,
      vx: 0,
      vy: 0,
      width: 12 + Math.random() * 8,
      height: 12 + Math.random() * 8,
      type: 'debris',
      orbitRadius,
      orbitSpeed: 0.008 + Math.random() * 0.012,
      angle: Math.random() * Math.PI * 2,
      centerX,
      centerY,
      debrisType: debrisTypes[Math.floor(Math.random() * debrisTypes.length)]
    };
    
    gameObjectsRef.current.push(newDebris);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set([...prev, e.key]));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set([...prev]);
        newKeys.delete(e.key);
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Update player position based on keys
  useEffect(() => {
    const updatePlayer = () => {
      setPlayerPos(prev => {
        let newX = prev.x;
        let newY = prev.y;
        const speed = 3;

        if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) newX -= speed;
        if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) newX += speed;
        if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) newY -= speed;
        if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) newY += speed;

        // Keep player within bounds
        newX = Math.max(20, Math.min(CANVAS_WIDTH - 20, newX));
        newY = Math.max(20, Math.min(CANVAS_HEIGHT - 20, newY));

        return { x: newX, y: newY };
      });
    };

    const interval = setInterval(updatePlayer, 16); // ~60fps
    return () => clearInterval(interval);
  }, [keys]);

  // Collision detection
  const checkCollision = (obj1: { x: number; y: number; width: number; height: number }, 
                         obj2: { x: number; y: number; width: number; height: number }) => {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  };

  // Game timer
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setPhase("end-game");
    }
  }, [timeRemaining, setTimeRemaining, setPhase]);

  // Initialize game
  useEffect(() => {
    initializeGameObjects();
  }, [initializeGameObjects]);

  // Spawn debris periodically
  useEffect(() => {
    const spawnInterval = setInterval(spawnDebris, 3000);
    return () => clearInterval(spawnInterval);
  }, [spawnDebris]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#000014';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 100; i++) {
        const x = (i * 37) % CANVAS_WIDTH;
        const y = (i * 67) % CANVAS_HEIGHT;
        ctx.fillRect(x, y, 1, 1);
      }

      // Update and draw game objects
      gameObjectsRef.current.forEach((obj, index) => {
        // Update orbital position
        obj.angle += obj.orbitSpeed;
        const pos = calculateEllipticalPosition(
          obj.centerX, 
          obj.centerY, 
          obj.orbitRadius, 
          obj.orbitRadius * 0.7, 
          obj.angle
        );
        obj.x = pos.x;
        obj.y = pos.y;

        // Draw object
        if (obj.type === 'satellite') {
          // Draw satellite
          ctx.fillStyle = '#silver';
          ctx.fillRect(obj.x - obj.width/2, obj.y - obj.height/2, obj.width, obj.height);
          
          // Solar panels
          ctx.fillStyle = '#4169E1';
          ctx.fillRect(obj.x - obj.width/2 - 10, obj.y - obj.height/2, 8, obj.height);
          ctx.fillRect(obj.x + obj.width/2 + 2, obj.y - obj.height/2, 8, obj.height);
          
          // Antenna
          ctx.strokeStyle = '#silver';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(obj.x, obj.y - obj.height/2);
          ctx.lineTo(obj.x, obj.y - obj.height/2 - 15);
          ctx.stroke();
        } else {
          // Draw debris based on type
          ctx.fillStyle = getDebrisColor(obj.debrisType!);
          const size = Math.min(obj.width, obj.height);
          
          switch (obj.debrisType) {
            case 'nut':
              // Hexagonal nut
              drawHexagon(ctx, obj.x, obj.y, size/2);
              break;
            case 'screw':
              // Screw shape
              ctx.fillRect(obj.x - size/4, obj.y - size/2, size/2, size);
              ctx.fillRect(obj.x - size/2, obj.y - size/3, size, size/6);
              break;
            case 'bolt':
              // Bolt shape
              ctx.fillRect(obj.x - size/3, obj.y - size/2, size/1.5, size);
              ctx.fillRect(obj.x - size/2, obj.y - size/2, size, size/4);
              break;
            default:
              // Default square debris
              ctx.fillRect(obj.x - size/2, obj.y - size/2, size, size);
          }
        }

        // Check collision with player tool
        const playerBounds = { x: playerPos.x - 15, y: playerPos.y - 15, width: 30, height: 30 };
        const objBounds = { x: obj.x - obj.width/2, y: obj.y - obj.height/2, width: obj.width, height: obj.height };
        
        if (checkCollision(playerBounds, objBounds)) {
          if (obj.type === 'debris') {
            // Magnetic collector behavior
            if (selectedTool === 'magnetic-collector') {
              incrementDebris();
              playSuccess();
              gameObjectsRef.current.splice(index, 1);
            } else {
              // Other tools
              incrementDebris();
              playSuccess();
              gameObjectsRef.current.splice(index, 1);
            }
          } else if (obj.type === 'satellite') {
            // Handle satellite collision
            if (selectedTool === 'magnetic-collector') {
              // Magnetic collector repels satellites - no collision
              return;
            } else {
              incrementSatellites();
              playHit();
              setShowSatelliteMessage(true);
              setTimeout(() => setShowSatelliteMessage(false), 1000);
            }
          }
        }
      });

      // Draw player tool
      drawPlayerTool(ctx, playerPos.x, playerPos.y, selectedTool!);

      // Draw UI
      drawUI(ctx);

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [playerPos, selectedTool, incrementDebris, incrementSatellites, playSuccess, playHit]);

  const getDebrisColor = (type: string) => {
    const colors = {
      nut: '#C0C0C0',
      screw: '#B8860B', 
      bolt: '#708090',
      switch: '#FF4500',
      glass: '#87CEEB',
      metal: '#778899'
    };
    return colors[type as keyof typeof colors] || '#696969';
  };

  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const hx = x + radius * Math.cos(angle);
      const hy = y + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawPlayerTool = (ctx: CanvasRenderingContext2D, x: number, y: number, tool: string) => {
    ctx.save();
    
    switch (tool) {
      case 'magnetic-collector':
        // Horseshoe magnet
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(x - 15, y - 10, 8, 20);
        ctx.fillRect(x + 7, y - 10, 8, 20);
        ctx.fillRect(x - 15, y - 10, 30, 8);
        break;
      case 'net':
        // Net pattern
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        for (let i = -15; i <= 15; i += 5) {
          ctx.beginPath();
          ctx.moveTo(x + i, y - 15);
          ctx.lineTo(x + i, y + 15);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x - 15, y + i);
          ctx.lineTo(x + 15, y + i);
          ctx.stroke();
        }
        break;
      case 'robotic-hand':
        // Robot hand
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(x - 10, y - 5, 20, 10);
        // Fingers
        for (let i = 0; i < 4; i++) {
          ctx.fillRect(x - 8 + i * 4, y - 15, 2, 10);
        }
        break;
      case 'laser':
        // Laser beam
        ctx.fillStyle = '#00FFFF';
        ctx.fillRect(x - 3, y - 20, 6, 40);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x - 1, y - 20, 2, 40);
        break;
    }
    
    ctx.restore();
  };

  const drawUI = (ctx: CanvasRenderingContext2D) => {
    // Timer
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Arial';
    ctx.fillText(`Time: ${timeRemaining}s`, 20, 40);
    
    // Tool indicator
    ctx.font = '16px Arial';
    ctx.fillText(`Tool: ${selectedTool?.replace('-', ' ')}`, 20, 70);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-white mb-2">Debris Collection Mission</h2>
        <div className="text-lg text-gray-300">
          Time: <span className="text-red-400 font-bold">{timeRemaining}s</span> | 
          Tool: <span className="text-cyan-400 capitalize">{selectedTool?.replace('-', ' ')}</span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 border-gray-400 bg-black"
        />
        
        {showSatelliteMessage && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-4 rounded-lg">
            <p>Oops I'm a satellite :( !! Please collect the debris cause it'll harm me :)</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-300 text-sm">Use WASD or Arrow Keys to move your tool</p>
        <p className="text-gray-400 text-xs">Collect debris, avoid satellites!</p>
      </div>
    </div>
  );
}
