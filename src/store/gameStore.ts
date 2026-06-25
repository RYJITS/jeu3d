import { create } from 'zustand';
import { generatePromoCode, savePromoCodeToFirebase } from '../utils/promoCodes';

export type GameStatus = 'menu' | 'playing' | 'gameover';

export interface HighScore {
    name: string;
    score: number;
    level: number;
    date: string;
}


interface GameState {
    status: GameStatus;
    score: number;
    level: number;
    obstaclesDodged: number;
    speed: number;
    baseSpeed: number;
    playerName: string;
    highScores: HighScore[];
    chargeProgress: number;
    maxCharge: number;
    ammo: number;
    maxAmmo: number;
    isCharged: boolean;
    playCount: number;
    isMuted: boolean;
    generatedPromoCode: string | null;
    generatedPromoCredits: number | null;
    setPlayerName: (name: string) => void;
    setStatus: (status: GameStatus) => void;
    incrementScore: (amount: number) => void;
    incrementObstaclesDodged: () => void;
    decrementAmmo: () => boolean;
    resetGame: () => void;
    saveScore: () => void;
    toggleMuted: () => void;
}

// Helper to load scores
const loadHighScores = (): HighScore[] => {
    try {
        const stored = localStorage.getItem('neonRushHighScores');
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error("Could not load high scores", e);
    }
    return [];
};

export const useGameStore = create<GameState>((set, get) => ({
    status: 'menu',
    score: 0,
    level: 1,
    obstaclesDodged: 0,
    speed: 20,
    baseSpeed: 20,
    playerName: localStorage.getItem('neonRushPlayerName') || '',
    highScores: loadHighScores(),
    chargeProgress: 0,
    maxCharge: 10,
    ammo: 0,
    maxAmmo: 5,
    isCharged: false,
    playCount: 0,
    isMuted: false,
    generatedPromoCode: null,
    generatedPromoCredits: null,

    setPlayerName: (name: string) => {
        localStorage.setItem('neonRushPlayerName', name);
        set({ playerName: name });
    },

    setStatus: (status) => {
        const { score, playerName, level } = get();
        if (status === 'gameover' && score > 0) {
            let credits = null;
            if (score >= 50000) credits = 500;
            else if (score >= 20000) credits = 250;
            else if (score >= 10000) credits = 100;

            if (credits) {
                const code = generatePromoCode(credits);
                set({ generatedPromoCode: code, generatedPromoCredits: credits, status });
                // Asynchronously save to Firebase without blocking the UI
                savePromoCodeToFirebase(code, credits, playerName, score, level);
                return;
            }
        }
        set({ status });
    },

    incrementScore: (amount) => set((state) => ({
        score: state.score + amount
    })),

    incrementObstaclesDodged: () => set((state) => {
        const newDodged = state.obstaclesDodged + 1;
        // Level up every 10 obstacles
        const newLevel = Math.floor(newDodged / 10) + 1;

        // Recharge ammo if not fully charged
        let newChargeProgress = state.chargeProgress;
        let newAmmo = state.ammo;
        let newIsCharged = state.isCharged;

        if (!state.isCharged) {
            newChargeProgress = Math.min(state.chargeProgress + 1, state.maxCharge);
            if (newChargeProgress === state.maxCharge) {
                newIsCharged = true;
                newAmmo = state.maxAmmo;
            }
        }

        // Flatten speed curve after level 20 to prevent excessive speeds (Bug 2)
        let newSpeed = state.baseSpeed;
        if (newLevel <= 20) {
            newSpeed = state.baseSpeed + (newLevel - 1) * 4; // Increases by 4 up to level 20 (Speed ~96 max)
        } else {
            // Very slow progression after level 20
            newSpeed = state.baseSpeed + (19 * 4) + (newLevel - 20) * 1.5;
        }

        return {
            obstaclesDodged: newDodged,
            level: newLevel,
            speed: newSpeed,
            chargeProgress: newChargeProgress,
            ammo: newAmmo,
            isCharged: newIsCharged
        };
    }),

    decrementAmmo: () => {
        const { ammo, isCharged } = get();
        if (isCharged && ammo > 0) {
            const nextAmmo = ammo - 1;
            set({
                ammo: nextAmmo,
                isCharged: nextAmmo > 0, // stays charged until 0
                chargeProgress: nextAmmo > 0 ? get().maxCharge : 0 // reset charge when lost
            });
            return true;
        }
        return false;
    },

    saveScore: () => {
        const { score, level, playerName, highScores } = get();
        if (score <= 0) return;

        const newScore: HighScore = {
            name: playerName || 'Anonymous',
            score: Math.floor(score),
            level,
            date: new Date().toISOString()
        };

        const updatedScores = [...highScores, newScore]
            .sort((a, b) => b.score - a.score)
            .slice(0, 50); // Keep top 50

        localStorage.setItem('neonRushHighScores', JSON.stringify(updatedScores));
        set({ highScores: updatedScores });
    },

    resetGame: () => set((state) => ({
        status: 'playing',
        score: 0,
        level: 1,
        obstaclesDodged: 0,
        speed: state.baseSpeed,
        chargeProgress: 0,
        ammo: 0,
        isCharged: false,
        generatedPromoCode: null,
        generatedPromoCredits: null,
        playCount: state.playCount + 1
    })),

    toggleMuted: () => set((state) => ({ isMuted: !state.isMuted }))
}));
