import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import { getLevelColor } from '../utils/colors';
import * as THREE from 'three';

export function Environment() {
    const gridRef = useRef<THREE.GridHelper>(null);
    const skyiaTextRef = useRef<THREE.Group>(null);
    const { status, speed, level } = useGameStore();
    const gridColor = getLevelColor(level);

    useFrame((_, delta) => {
        if (status !== 'playing' || !gridRef.current) return;

        // Move grid towards player to simulate forward movement
        gridRef.current.position.z += speed * delta;

        // Reset grid position when a segment passes to create infinite effect
        if (gridRef.current.position.z >= 10) {
            gridRef.current.position.z = 0;
        }

        // Move SKYIA text in sync with the world
        if (skyiaTextRef.current) {
            skyiaTextRef.current.position.z += speed * delta;
            // Reset when it passes the player — loop every 40 units
            if (skyiaTextRef.current.position.z > 10) {
                skyiaTextRef.current.position.z = -70;
            }
        }
    });

    return (
        <group>
            {/* Moving Grid */}
            <gridHelper
                ref={gridRef}
                args={[100, 50, gridColor, gridColor]}
                position={[0, 0.01, 0]}
            />

            {/* Floor Base */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[100, 200]} />
                <meshStandardMaterial color="#050510" />
            </mesh>

            {/* Neon SKYIA.NET Text on the ground */}
            <group ref={skyiaTextRef} position={[0, 0.02, -40]}>
                <Text
                    position={[0, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={3}
                    color="#00f3ff"
                    anchorX="center"
                    anchorY="middle"
                    material-toneMapped={false}
                    letterSpacing={0.15}
                >
                    SKYIA.NET
                </Text>
                <Text
                    position={[0, 0, 2.5]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={0.6}
                    color="#b500ff"
                    anchorX="center"
                    anchorY="middle"
                    material-toneMapped={false}
                    letterSpacing={0.3}
                >
                    SIMULATION IA • PROTOCOLE EXTINCTION
                </Text>
            </group>

            {/* Horizon Fog */}
            <fog attach="fog" args={['#050510', 20, 80]} />
        </group>
    );
}
