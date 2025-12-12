import React, { useState } from 'react';
import SpaceScene from './components/SpaceScene';
import Dashboard from './components/Dashboard';
import { SystemState, ShipSystemStatus } from './types';

const App: React.FC = () => {
  // State for the entire ship
  const [systemState, setSystemState] = useState<SystemState>({
    propulsion: ShipSystemStatus.ONLINE,
    lifeSupport: ShipSystemStatus.ONLINE,
    navigation: ShipSystemStatus.ONLINE,
    communications: ShipSystemStatus.ONLINE,
    warpSpeed: 0
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans selection:bg-cyan-500 selection:text-black">
      {/* 3D Background Layer */}
      <SpaceScene speed={systemState.warpSpeed} />

      {/* Vignette & CRT Effect Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_80%,rgba(0,0,0,1)_100%)]"></div>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* UI Layer */}
      <Dashboard systemState={systemState} setSystemState={setSystemState} />
    </div>
  );
};

export default App;