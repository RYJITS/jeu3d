import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function AudioPlayer() {
    const { status, isMuted } = useGameStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element on mount.
        // The file should be placed in the public/ folder.
        const audio = new Audio('/music.mp3');
        audio.loop = true;
        audio.volume = 0.4; // Default volume (0.0 to 1.0)
        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.src = '';
            audioRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!audioRef.current) return;

        audioRef.current.muted = isMuted;

        if (status === 'playing') {
            // Play when game starts. 
            // Browsers allow this since it happens after a user click (Start Game button).
            if (audioRef.current.paused) {
                audioRef.current.play().catch((e) => console.log("Audio play blocked by browser:", e));
            }
            audioRef.current.volume = 0.4;
        } else if (status === 'menu') {
            // Pause and reset when going back to menu
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        } else if (status === 'gameover') {
            // Optional: lower volume on game over
            audioRef.current.volume = 0.15;
        }
    }, [status, isMuted]);

    return null;
}
