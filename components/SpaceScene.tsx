import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import WarpStars from './WarpStars';
import { NearbyPlanet, DistantSun } from './Planets';
import Cockpit from './Cockpit';

interface SpaceSceneProps {
  speed: number;
}

const SpaceScene: React.FC<SpaceSceneProps> = ({ speed }) => {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 2]} fov={65} />
          
          <ambientLight intensity={0.2} />
          
          {/* 3D Cockpit Interior */}
          <Cockpit />

          {/* Exterior Environment */}
          <group>
             <WarpStars speed={speed} />
             <NearbyPlanet />
             <DistantSun />
          </group>
          
          {/* Controls - Restricted movement to simulate sitting in a chair */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            maxPolarAngle={Math.PI / 1.7} 
            minPolarAngle={Math.PI / 2.3}
            maxAzimuthAngle={Math.PI / 5}
            minAzimuthAngle={-Math.PI / 5}
            rotateSpeed={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SpaceScene;