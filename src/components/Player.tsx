import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';

const LANE_WIDTH = 2;
const MAX_LANES = 1; // Lanes are -1, 0, 1

export function Player() {
    const meshRef = useRef<THREE.Mesh>(null);
    const [targetX, setTargetX] = useState(0);

    // Use selectors to prevent unnecessary re-renders when score/other props change
    const status = useGameStore(state => state.status);
    const isCharged = useGameStore(state => state.isCharged);

    // Handle controls
    useEffect(() => {
        const touchState = { startX: 0 };

        const handleKeyDown = (e: KeyboardEvent) => {
            const currentStatus = useGameStore.getState().status;
            if (currentStatus !== 'playing') return;

            if (e.key === 'ArrowLeft' || e.key === 'a') {
                e.preventDefault();
                setTargetX((prev) => {
                    return Math.max(prev - LANE_WIDTH, -LANE_WIDTH * MAX_LANES);
                });
            } else if (e.key === 'ArrowRight' || e.key === 'd') {
                e.preventDefault();
                setTargetX((prev) => {
                    return Math.min(prev + LANE_WIDTH, LANE_WIDTH * MAX_LANES);
                });
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (useGameStore.getState().status !== 'playing') return;
            const touch = e.touches[0];
            touchState.startX = touch.clientX;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (useGameStore.getState().status !== 'playing') return;
            e.preventDefault(); // Empêche le défilement (scroll) pdt le jeu

            const touch = e.touches[0];
            const currentX = touch.clientX;

            const diffX = currentX - touchState.startX;

            // Déplacement Horizontal Continu
            if (Math.abs(diffX) > 40) {
                if (diffX > 0) {
                    setTargetX(prev => {
                        return Math.min(prev + LANE_WIDTH, LANE_WIDTH * MAX_LANES);
                    });
                } else {
                    setTargetX(prev => {
                        return Math.max(prev - LANE_WIDTH, -LANE_WIDTH * MAX_LANES);
                    });
                }
                touchState.startX = currentX;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    // Reset player position when game resets
    useEffect(() => {
        if (status === 'menu' || status === 'playing') {
            if (meshRef.current) meshRef.current.position.set(0, 0.5, 0);
            setTargetX(0);
        }
    }, [status]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Smooth lane switching
        const lerpFactor = Math.min(10 * delta, 1);
        meshRef.current.position.x = THREE.MathUtils.lerp(
            meshRef.current.position.x,
            targetX,
            lerpFactor
        );

        // Bobbing/Hovering effect
        if (status === 'playing') {
            meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
            // Slight tilt when moving
            meshRef.current.rotation.z = THREE.MathUtils.lerp(
                meshRef.current.rotation.z,
                -(targetX - meshRef.current.position.x) * 0.2,
                lerpFactor
            );
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0.5, 0]} name="player">
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                color={isCharged ? "#ffff00" : "#00f3ff"}
                emissive={isCharged ? "#ffff00" : "#00f3ff"}
                emissiveIntensity={isCharged ? 3 : 2}
                toneMapped={false}
            />
        </mesh>
    );
}
