import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Player } from './Player';
import { Environment } from './Environment';
import { Obstacles } from './Obstacles';
import { Projectiles } from './Projectiles';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { getLevelColor } from '../utils/colors';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';

export function Scene() {
    const { status, setStatus, level } = useGameStore();
    const sceneRef = useRef<THREE.Group>(null);
    const levelColor = getLevelColor(level);

    useFrame(() => {
        if (status !== 'playing' || !sceneRef.current) return;

        // Prevent instant-death bug on restart:
        // Give React a fraction of a second (score < 20) to unmount old obstacles
        if (useGameStore.getState().score < 20) return;

        // Calculate the distance moved this frame to expand collision boxes
        // This prevents "ghosting" where obstacles skip over the player entirely at high speeds
        // Delta time isn't directly available in useFrame without args, so we get speed instead
        const currentSpeed = useGameStore.getState().speed;

        const playerMesh = sceneRef.current.children.find(c => c.name === 'player') as THREE.Mesh;

        // Fallback if structure is wrong
        if (!playerMesh) return;

        // For simpler collision detection since we split logic, we can find obstacles in the scene
        const playerBox = new THREE.Box3().setFromObject(playerMesh);
        playerBox.expandByScalar(-0.2); // Shrink once

        // Instead of iterating all objects, let's just cheat and check meshes that are obstacles
        sceneRef.current.traverse((child) => {
            if (child.name === 'obstacle' && child instanceof THREE.Mesh) {
                // Ensure matrixWorld is computed right away for newly spawned obstacles
                // Otherwise they sit at 0,0,0 for a frame, instantly killing the player
                child.updateWorldMatrix(true, false);

                const obsBox = new THREE.Box3().setFromObject(child);
                // Reduce collision box slightly to make it more forgiving
                obsBox.expandByScalar(-0.1);

                // Continuous collision detection: 
                // Expand the obstacle's Z-axis bounds by an estimate of how far it moved this frame.
                // Assuming ~60 FPS, delta is ~0.016s
                const estimatedMoveDistance = currentSpeed * 0.016;
                obsBox.min.z -= estimatedMoveDistance; // Stretch the box backwards towards where it came from

                if (playerBox.intersectsBox(obsBox)) {
                    if (useGameStore.getState().isCharged) {
                        // Invincible collision: consume 1 ammo and destroy the obstacle locally
                        useGameStore.getState().decrementAmmo();
                        child.position.setY(-100);
                        child.updateMatrixWorld(true);
                    } else {
                        useGameStore.getState().saveScore();
                        setStatus('gameover');
                    }
                }
            }
        });
    });

    return (
        <>
            <color attach="background" args={['#050510']} />

            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 10, -5]} intensity={1} color={levelColor} />
            <pointLight position={[0, 2, 0]} intensity={2} color="#00f3ff" />

            <group ref={sceneRef}>
                <Environment />
                <Obstacles />
                <Player />
                <Projectiles />
            </group>

            {/* Neon Glow Effect */}
            <EffectComposer>
                <Bloom
                    luminanceThreshold={0.2}
                    mipmapBlur
                    intensity={1.5}
                />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </>
    );
}
