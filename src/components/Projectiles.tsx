import { useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { laserManager, type Laser } from '../utils/laserManager';

export function Projectiles() {
    // We use a shallow copy to trigger React re-renders when lasers change visually
    const [displayLasers, setDisplayLasers] = useState<Laser[]>([]);
    const { status } = useGameStore();

    const geometry = useMemo(() => new THREE.CylinderGeometry(0.1, 0.1, 2), []);
    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#ffffff',
        emissiveIntensity: 3,
        toneMapped: false
    }), []);

    // Clear lasers on game over / menu
    useEffect(() => {
        if (status !== 'playing') {
            laserManager.clear();
            const resetTimer = window.setTimeout(() => {
                setDisplayLasers([]);
            }, 0);
            return () => window.clearTimeout(resetTimer);
        }
    }, [status]);

    useFrame((_, delta) => {
        if (status !== 'playing') return;

        // 1. Advance physics logic (done here, but could be anywhere in the loop)
        laserManager.update(delta);

        // 2. Sync visual state
        setDisplayLasers([...laserManager.lasers]);
    });

    return (
        <group>
            {displayLasers.map(laser => (
                <mesh
                    key={`laser-${laser.id}`}
                    name="laser"
                    position={[laser.x, 0.5, laser.z]}
                    rotation={[Math.PI / 2, 0, 0]}
                    geometry={geometry}
                    material={material}
                />
            ))}
        </group>
    );
}
