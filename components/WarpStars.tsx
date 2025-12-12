import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WarpStarsProps {
  speed: number;
}

const WarpStars: React.FC<WarpStarsProps> = ({ speed }) => {
  const count = 5000;
  const mesh = useRef<THREE.Points>(null);

  // Generate random star positions
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speedFactor = 0.01 + Math.random() / 200;
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      temp.push({ t, factor, speed: speedFactor, x, y, z, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  const initialPositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        pos[i * 3] = particles[i].x;
        pos[i * 3 + 1] = particles[i].y;
        pos[i * 3 + 2] = particles[i].z;
    }
    return pos;
  }, [count, particles]);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    // We manually update positions in the geometry attribute for the warp effect
    // This is a simple implementation; for high perf in huge scenes, a shader is better,
    // but points are sufficient here.
    
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    
    // Effective speed multiplier
    const warpFactor = speed > 0 ? speed * 2 : 0.1;

    for (let i = 0; i < count; i++) {
        let z = positions[i * 3 + 2];
        
        // Move stars towards camera (positive Z in this setup, or negative depending on cam)
        // Let's assume camera looks down -Z. Stars move +Z to pass us.
        z += (particles[i].speed * 100 * warpFactor * delta) + (0.1 * warpFactor);

        // Reset if too close/behind
        if (z > 100) {
            z = -200;
            // Randomize X/Y slightly on respawn for variety
             positions[i * 3] = (Math.random() - 0.5) * 200;
             positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        }

        positions[i * 3 + 2] = z;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    
    // Slight rotation for "drift"
    mesh.current.rotation.z += 0.001 * delta;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={initialPositions.length / 3}
          array={initialPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#ffffff"
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8}
      />
    </points>
  );
};

export default WarpStars;