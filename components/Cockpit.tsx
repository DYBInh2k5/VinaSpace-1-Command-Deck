import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere, Dodecahedron, Cone, Torus } from '@react-three/drei';
import * as THREE from 'three';

const Cockpit: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const holoRef = useRef<THREE.Mesh>(null);
  const schematicRef = useRef<THREE.Group>(null);
  const diagnosticRef = useRef<THREE.Group>(null);

  // Gentle hover effect for the cockpit to simulate ship idle movement
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
    
    // Animate Central Navigation Hologram
    if (holoRef.current) {
      holoRef.current.rotation.y += state.clock.getDelta() * 0.5;
    }

    // Animate Ship Schematics (Left)
    if (schematicRef.current) {
        schematicRef.current.rotation.y -= state.clock.getDelta() * 0.4;
        schematicRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.05;
    }

    // Animate System Diagnostics (Right)
    if (diagnosticRef.current) {
        diagnosticRef.current.rotation.x += state.clock.getDelta() * 0.3;
        diagnosticRef.current.rotation.y += state.clock.getDelta() * 0.2;
    }
  });

  const hullColor = "#111827"; // Dark Gray/Black
  const panelColor = "#1f2937"; // Gray-800
  const emissiveCyan = "#06b6d4";
  const emissiveOrange = "#f97316";

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* --- Main Dashboard Console (Bottom) --- */}
      <Box args={[9, 1.5, 3]} position={[0, -2.0, -2.5]} rotation={[-0.2, 0, 0]}>
        <meshStandardMaterial color={panelColor} roughness={0.6} metalness={0.6} />
      </Box>

      {/* --- Dashboard Instrumentation --- */}
      
      {/* Left Holographic Display: Ship Schematics */}
      <group position={[-2.8, -1.3, -2.2]} rotation={[-0.4, 0.3, 0]}>
          {/* Base Panel */}
          <Box args={[2, 0.1, 1]} position={[0, -0.1, 0]}>
             <meshStandardMaterial color={panelColor} />
          </Box>
          <Box args={[1.8, 0.05, 0.8]} position={[0, -0.05, 0]}>
             <meshBasicMaterial color={emissiveCyan} transparent opacity={0.1} />
          </Box>
          {/* Hologram */}
          <group ref={schematicRef} position={[0, 0.4, 0]}>
              {/* Ship Body */}
              <Cone args={[0.2, 0.8, 4]} rotation={[Math.PI / 2, 0, 0]}>
                  <meshBasicMaterial color={emissiveCyan} wireframe />
              </Cone>
              {/* Ship Wings */}
              <Box args={[0.8, 0.02, 0.3]} position={[0, 0, -0.1]}>
                   <meshBasicMaterial color={emissiveCyan} wireframe />
              </Box>
              {/* Engine Glow */}
              <Sphere args={[0.05]} position={[0, 0, 0.4]}>
                  <meshBasicMaterial color="white" />
              </Sphere>
          </group>
          {/* Scanning Line */}
          <Box args={[1.5, 0.02, 0.02]} position={[0, 0.1, 0.4]}>
               <meshBasicMaterial color={emissiveCyan} transparent opacity={0.5} />
          </Box>
      </group>


      {/* Center Radar Hologram Base (Existing) */}
      <Cylinder args={[0.8, 0.8, 0.2, 32]} position={[0, -1.4, -2.1]} rotation={[0.2, 0, 0]}>
        <meshStandardMaterial color="#0f172a" emissive={emissiveCyan} emissiveIntensity={0.5} />
      </Cylinder>
      {/* Center Hologram Beam */}
      <Cylinder args={[0.7, 0.2, 0.1, 32]} position={[0, -1.25, -2.1]} rotation={[0.2, 0, 0]}>
          <meshBasicMaterial color={emissiveCyan} transparent opacity={0.3} />
      </Cylinder>


      {/* Right Holographic Display: System Diagnostics */}
      <group position={[2.8, -1.3, -2.2]} rotation={[-0.4, -0.3, 0]}>
          {/* Base Panel */}
          <Box args={[2, 0.1, 1]} position={[0, -0.1, 0]}>
             <meshStandardMaterial color={panelColor} />
          </Box>
           <Box args={[1.8, 0.05, 0.8]} position={[0, -0.05, 0]}>
             <meshBasicMaterial color={emissiveOrange} transparent opacity={0.1} />
          </Box>
          {/* Hologram */}
          <group position={[0, 0.4, 0]}>
              <group ref={diagnosticRef}>
                  <Torus args={[0.25, 0.02, 8, 24]}>
                       <meshBasicMaterial color={emissiveOrange} wireframe />
                  </Torus>
                   <Torus args={[0.35, 0.01, 8, 24]} rotation={[Math.PI / 2, 0, 0]}>
                       <meshBasicMaterial color={emissiveOrange} wireframe transparent opacity={0.5} />
                  </Torus>
              </group>
              <Sphere args={[0.12]} >
                  <meshBasicMaterial color={emissiveOrange} transparent opacity={0.8} />
              </Sphere>
          </group>
      </group>


      {/* Toggle Switches Row */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Box key={i} args={[0.1, 0.1, 0.1]} position={[-1 + i * 0.3, -1.3, -1.8]} rotation={[-0.2, 0, 0]}>
             <meshStandardMaterial color="white" emissive={i % 2 === 0 ? "green" : "red"} emissiveIntensity={1} />
        </Box>
      ))}

      {/* --- Hull Structure / Window Frames --- */}
      
      {/* Roof Panel */}
      <Box args={[10, 0.5, 4]} position={[0, 3.2, -1]} rotation={[0.1, 0, 0]}>
        <meshStandardMaterial color={hullColor} roughness={0.7} />
      </Box>

      {/* Left Pillar */}
      <Box args={[0.8, 7, 1]} position={[-5, 0, -2]} rotation={[0, 0, 0.15]}>
         <meshStandardMaterial color={hullColor} />
      </Box>
      
      {/* Right Pillar */}
      <Box args={[0.8, 7, 1]} position={[5, 0, -2]} rotation={[0, 0, -0.15]}>
         <meshStandardMaterial color={hullColor} />
      </Box>
      
      {/* Floor */}
      <Box args={[10, 0.5, 6]} position={[0, -3.5, 0]}>
          <meshStandardMaterial color="#0f172a" />
      </Box>

      {/* --- Seats --- */}
      
      {/* Left Seat (Pilot) */}
      <group position={[-2.5, -3.2, 1]}>
         <Box args={[2.2, 0.5, 2.2]} position={[0, 0.25, 0]}>
            <meshStandardMaterial color="#374151" />
         </Box>
         <Box args={[2, 3.5, 0.5]} position={[0, 2, 1]} rotation={[-0.1, 0, 0]}>
            <meshStandardMaterial color="#1f2937" />
         </Box>
      </group>

      {/* Right Seat (Co-Pilot) */}
       <group position={[2.5, -3.2, 1]}>
         <Box args={[2.2, 0.5, 2.2]} position={[0, 0.25, 0]}>
            <meshStandardMaterial color="#374151" />
         </Box>
         <Box args={[2, 3.5, 0.5]} position={[0, 2, 1]} rotation={[-0.1, 0, 0]}>
            <meshStandardMaterial color="#1f2937" />
         </Box>
      </group>

      {/* --- Center Navigation Console (New) --- */}
      <group position={[0, -2.8, 1]}>
        {/* Console Base */}
        <Box args={[1.5, 0.8, 2]} position={[0, 0, 0]}>
           <meshStandardMaterial color={panelColor} roughness={0.5} />
        </Box>
        
        {/* Slanted Control Surface */}
        <Box args={[1.3, 0.1, 1.8]} position={[0, 0.45, 0]} rotation={[0.1, 0, 0]}>
            <meshStandardMaterial color="#2d3748" />
        </Box>

        {/* Holographic Projector Base */}
        <Cylinder args={[0.3, 0.3, 0.1, 16]} position={[0, 0.5, 0.2]}>
             <meshStandardMaterial color="#1e293b" />
        </Cylinder>

        {/* Holographic Star Map (Animated) */}
        <mesh ref={holoRef} position={[0, 1.2, 0.2]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshBasicMaterial color={emissiveCyan} wireframe transparent opacity={0.3} />
        </mesh>
         {/* Inner Core of Map */}
        <mesh position={[0, 1.2, 0.2]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshBasicMaterial color={emissiveOrange} />
        </mesh>

        {/* Buttons on Console */}
        <Box args={[0.2, 0.05, 0.2]} position={[-0.4, 0.5, -0.4]} rotation={[0.1, 0, 0]}>
             <meshStandardMaterial color="red" emissive="#ef4444" emissiveIntensity={0.8} />
        </Box>
        <Box args={[0.2, 0.05, 0.2]} position={[0, 0.5, -0.4]} rotation={[0.1, 0, 0]}>
             <meshStandardMaterial color="yellow" emissive="#eab308" emissiveIntensity={0.8} />
        </Box>
        <Box args={[0.2, 0.05, 0.2]} position={[0.4, 0.5, -0.4]} rotation={[0.1, 0, 0]}>
             <meshStandardMaterial color="blue" emissive="#3b82f6" emissiveIntensity={0.8} />
        </Box>
         <Box args={[0.3, 0.02, 0.8]} position={[0.4, 0.51, 0.4]} rotation={[0.1, 0, 0]}>
             <meshBasicMaterial color={emissiveCyan} transparent opacity={0.2} />
        </Box>
      </group>

      {/* Ambient Interior Light */}
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#06b6d4" distance={8} decay={2} />
      <pointLight position={[0, -1, -1]} intensity={0.8} color="#06b6d4" distance={3} decay={2} />
    </group>
  );
};

export default Cockpit;