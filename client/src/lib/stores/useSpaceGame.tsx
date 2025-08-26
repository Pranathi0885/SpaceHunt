import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = 
  | "start" 
  | "tool-selection" 
  | "planet-selection" 
  | "space-travel"
  | "maze-game" 
  | "debris-collection" 
  | "end-game" 
  | "graveyard" 
  | "recycling";

export type Tool = "magnetic-collector" | "net" | "robotic-hand" | "laser";
export type Planet = "mars" | "jupiter" | "saturn" | "uranus";
export type Difficulty = "easy" | "medium" | "hard";

interface GameState {
  gamePhase: GamePhase;
  selectedTool: Tool | null;
  selectedPlanet: Planet | null;
  difficulty: Difficulty;
  score: number;
  collectedDebris: number;
  collectedSatellites: number;
  timeRemaining: number;
  toolRetrieved: boolean;
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  setTool: (tool: Tool) => void;
  setPlanet: (planet: Planet) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  addScore: (points: number) => void;
  incrementDebris: () => void;
  incrementSatellites: () => void;
  setTimeRemaining: (time: number) => void;
  setToolRetrieved: (retrieved: boolean) => void;
  resetGame: () => void;
}

export const useSpaceGame = create<GameState>()(
  subscribeWithSelector((set) => ({
    gamePhase: "start",
    selectedTool: null,
    selectedPlanet: null,
    difficulty: "medium",
    score: 0,
    collectedDebris: 0,
    collectedSatellites: 0,
    timeRemaining: 55,
    toolRetrieved: false,
    
    setPhase: (phase) => set({ gamePhase: phase }),
    setTool: (tool) => set({ selectedTool: tool }),
    setPlanet: (planet) => set({ selectedPlanet: planet }),
    setDifficulty: (difficulty) => set({ difficulty }),
    addScore: (points) => set((state) => ({ score: state.score + points })),
    incrementDebris: () => set((state) => ({ 
      collectedDebris: state.collectedDebris + 1,
      score: state.score + 10
    })),
    incrementSatellites: () => set((state) => ({ 
      collectedSatellites: state.collectedSatellites + 1,
      score: state.score - 20
    })),
    setTimeRemaining: (time) => set({ timeRemaining: time }),
    setToolRetrieved: (retrieved) => set({ toolRetrieved: retrieved }),
    resetGame: () => set({
      gamePhase: "start",
      selectedTool: null,
      selectedPlanet: null,
      difficulty: "medium",
      score: 0,
      collectedDebris: 0,
      collectedSatellites: 0,
      timeRemaining: 55,
      toolRetrieved: false
    })
  }))
);
