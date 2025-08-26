import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  spaceShootSound: HTMLAudioElement | null;
  mazeSound: HTMLAudioElement | null;
  graveyardSound: HTMLAudioElement | null;
  recycleSound: HTMLAudioElement | null;
  warningSound: HTMLAudioElement | null;
  explosionSound: HTMLAudioElement | null;
  isMuted: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  setSpaceShootSound: (sound: HTMLAudioElement) => void;
  setMazeSound: (sound: HTMLAudioElement) => void;
  setGraveyardSound: (sound: HTMLAudioElement) => void;
  setRecycleSound: (sound: HTMLAudioElement) => void;
  setWarningSound: (sound: HTMLAudioElement) => void;
  setExplosionSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playSpaceShoot: () => void;
  playMazeMove: () => void;
  playGraveyard: () => void;
  playRecycle: () => void;
  playWarning: () => void;
  playExplosion: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  spaceShootSound: null,
  mazeSound: null,
  graveyardSound: null,
  recycleSound: null,
  warningSound: null,
  explosionSound: null,
  isMuted: true, // Start muted by default
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setSpaceShootSound: (sound) => set({ spaceShootSound: sound }),
  setMazeSound: (sound) => set({ mazeSound: sound }),
  setGraveyardSound: (sound) => set({ graveyardSound: sound }),
  setRecycleSound: (sound) => set({ recycleSound: sound }),
  setWarningSound: (sound) => set({ warningSound: sound }),
  setExplosionSound: (sound) => set({ explosionSound: sound }),
  
  toggleMute: () => {
    const { isMuted } = get();
    const newMutedState = !isMuted;
    
    // Just update the muted state
    set({ isMuted: newMutedState });
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      successSound.currentTime = 0;
      successSound.volume = 0.4;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },
  
  playSpaceShoot: () => {
    const { spaceShootSound, isMuted } = get();
    if (spaceShootSound && !isMuted) {
      const soundClone = spaceShootSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Space shoot sound play prevented:", error);
      });
    }
  },
  
  playMazeMove: () => {
    const { mazeSound, isMuted } = get();
    if (mazeSound && !isMuted) {
      const soundClone = mazeSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.2;
      soundClone.play().catch(error => {
        console.log("Maze sound play prevented:", error);
      });
    }
  },
  
  playGraveyard: () => {
    const { graveyardSound, isMuted } = get();
    if (graveyardSound && !isMuted) {
      graveyardSound.currentTime = 0;
      graveyardSound.volume = 0.3;
      graveyardSound.play().catch(error => {
        console.log("Graveyard sound play prevented:", error);
      });
    }
  },
  
  playRecycle: () => {
    const { recycleSound, isMuted } = get();
    if (recycleSound && !isMuted) {
      recycleSound.currentTime = 0;
      recycleSound.volume = 0.4;
      recycleSound.play().catch(error => {
        console.log("Recycle sound play prevented:", error);
      });
    }
  },
  
  playWarning: () => {
    const { warningSound, isMuted } = get();
    if (warningSound && !isMuted) {
      const soundClone = warningSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.5;
      soundClone.play().catch(error => {
        console.log("Warning sound play prevented:", error);
      });
    }
  },
  
  playExplosion: () => {
    const { explosionSound, isMuted } = get();
    if (explosionSound && !isMuted) {
      const soundClone = explosionSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.4;
      soundClone.play().catch(error => {
        console.log("Explosion sound play prevented:", error);
      });
    }
  }
}));
