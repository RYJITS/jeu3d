import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';
import { laserManager } from '../utils/laserManager';

const LANE_WIDTH = 2;
const SPAWN_Z = -80;
const DESPAWN_Z = 10;


interface ObstacleData {
    id: number;
    x: number;
    z: number;
    width: number;
    shape: 'box' | 'cylinder' | 'cone';
    color: string;
    isSkyia: boolean;
}

const OBSTACLE_COLORS = ['#ff00ff', '#00ffff', '#ffff00', '#ff0055', '#00ffaa'];
const OBSTACLE_SHAPES: ('box' | 'cylinder' | 'cone')[] = ['box', 'cylinder', 'cone'];

// Skyia.net themed colors
const SKYIA_COLOR = '#1a0033';
const SKYIA_EMISSIVE = '#b500ff';


export function Obstacles() {
    const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
    const { status, speed, incrementScore, incrementObstaclesDodged, playCount } = useGameStore();
    const nextSpawnZ = useRef(SPAWN_Z);
    const obstacleIdCounter = useRef(0);

    // Reset obstacles completely when a new game starts (playCount increments)
    useEffect(() => {
        setObstacles([]);
        nextSpawnZ.current = SPAWN_Z;
    }, [playCount]);

    // Pre-create geometries to save memory
    const geometries = useMemo(() => ({
        box: new THREE.BoxGeometry(1, 1, 1),
        cylinder: new THREE.CylinderGeometry(0.6, 0.6, 1, 16),
        cone: new THREE.ConeGeometry(0.7, 1.2, 16)
    }), []);

    // Pre-create materials for each color (normal obstacles)
    const materials = useMemo(() => {
        const mats: Record<string, THREE.MeshStandardMaterial> = {};
        OBSTACLE_COLORS.forEach(c => {
            mats[c] = new THREE.MeshStandardMaterial({
                color: c,
                emissive: c,
                emissiveIntensity: 1.5,
                toneMapped: false,
            });
        });
        return mats;
    }, []);

    // Skyia.net themed material
    const skyiaMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: SKYIA_COLOR,
        emissive: SKYIA_EMISSIVE,
        emissiveIntensity: 2,
        toneMapped: false,
    }), []);

    useFrame((_, delta) => {
        if (status !== 'playing') {
            return;
        }

        const moveDistance = speed * delta;

        // 1. Calculate collisions BEFORE the React state updater to avoid StrictMode double-invocation bugs
        const hitObstacleIds = new Set<number>();
        for (const obs of obstacles) {
            const simulatedZ = obs.z + moveDistance;
            if (simulatedZ <= DESPAWN_Z) {
                if (laserManager.checkCollision({ ...obs, z: simulatedZ })) {
                    hitObstacleIds.add(obs.id);
                }
            }
        }

        // 2. Move obstacles purely
        setObstacles(prev => {
            const updated = prev.map(obs => {
                const newZ = obs.z + moveDistance;

                // If it passes the player (z > 0) and hasn't been scored yet
                if (newZ > 0 && obs.z <= 0) {
                    incrementObstaclesDodged();
                }

                return { ...obs, z: newZ };
            }).filter(obs => {
                if (obs.z > DESPAWN_Z) return false;
                if (hitObstacleIds.has(obs.id)) return false; // Destroyed!
                return true;
            });

            return updated;
        });

        // Spawn new obstacles
        if (obstacles.length === 0 || obstacles[obstacles.length - 1].z > nextSpawnZ.current) {
            const lane = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
            const x = lane * LANE_WIDTH;

            // ~60% of obstacles are Skyia-themed (3 out of 5)
            const isSkyia = Math.random() < 0.6;

            let shape: 'box' | 'cylinder' | 'cone';
            let color: string;
            let width: number;

            if (isSkyia) {
                // Skyia obstacles are always boxes so the text is readable
                shape = 'box';
                width = 1.5;
                color = SKYIA_COLOR;
            } else {
                const isWide = Math.random() > 0.8;
                shape = OBSTACLE_SHAPES[Math.floor(Math.random() * OBSTACLE_SHAPES.length)];
                color = OBSTACLE_COLORS[Math.floor(Math.random() * OBSTACLE_COLORS.length)];
                width = isWide && shape === 'box' ? 3 : 1;
            }

            setObstacles(prev => [...prev, {
                id: obstacleIdCounter.current++,
                x,
                z: SPAWN_Z,
                width,
                shape,
                color,
                isSkyia
            }]);

            // Randomize distance to next spawn based on speed
            nextSpawnZ.current = SPAWN_Z + Math.random() * 20 + 20;
        }

        incrementScore(speed * delta);
    });

    return (
        <group>
            {obstacles.map(obs => (
                <group key={obs.id} position={[obs.x, 0.5, obs.z]}>
                    <mesh
                        scale={[obs.width, 1, 1]}
                        geometry={geometries[obs.shape]}
                        material={obs.isSkyia ? skyiaMaterial : materials[obs.color]}
                        userData={{ x: obs.x, z: obs.z, width: obs.width }}
                        name="obstacle"
                    />
                </group>
            ))}
        </group>
    );
}
