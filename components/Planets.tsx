import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, DoubleSide } from 'three';

export const NearbyPlanet: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.03 * delta;
    }
    if (ringRef.current) {
        ringRef.current.rotation.z -= 0.01 * delta;
    }
  });

  return (
    <group position={[30, 8, -70]}>
      {/* Main Planet Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[14, 64, 64]} />
        <meshStandardMaterial 
          color="#2563eb" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Atmosphere Glow (Transparent outer shell) */}
      <mesh>
        <sphereGeometry args={[15.5, 64, 64]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Rings */}
      <mesh ref={ringRef} rotation={[1.4, 0, 0]}>
        <ringGeometry args={[18, 28, 64]} />
        <meshStandardMaterial 
            color="#a855f7" 
            side={DoubleSide} 
            transparent 
            opacity={0.7}
            emissive="#7e22ce"
            emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Light reflecting off planet */}
      <pointLight intensity={1} distance={100} color="#3b82f6" />
    </group>
  );
};

export const DistantSun: React.FC = () => {
    return (
        <mesh position={[-120, 30, -200]}>
            <sphereGeometry args={[8, 32, 32]} />
            <meshBasicMaterial color="#fdba74" />
            <pointLight intensity={1.5} distance={1000} decay={1} color="#ffedd5" />
             {/* Sun Halo */}
             <mesh>
                <sphereGeometry args={[12, 32, 32]} />
                 <meshBasicMaterial color="#fb923c" transparent opacity={0.3} />
             </mesh>
        </mesh>
    )
}