import React, { useState, useEffect, useRef } from 'react';
import { Send, Zap, Activity, Shield, Navigation, AlertTriangle, Radio } from 'lucide-react';
import { ChatMessage, MessageRole, SystemState, ShipSystemStatus } from '../types';
import { sendMessageToShipComputer } from '../services/geminiService';

interface DashboardProps {
  systemState: SystemState;
  setSystemState: React.Dispatch<React.SetStateAction<SystemState>>;
}

const Dashboard: React.FC<DashboardProps> = ({ systemState, setSystemState }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: MessageRole.MODEL,
      text: "System initialized. VinaSpace-1 Command Interface ready. Waiting for input...",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: MessageRole.USER,
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToShipComputer(userMsg.text, messages);
      const aiMsg: ChatMessage = {
        role: MessageRole.MODEL,
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleWarp = () => {
    setSystemState(prev => ({
      ...prev,
      warpSpeed: prev.warpSpeed > 0 ? 0 : 5 // Toggle between idle and Warp 5
    }));
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 md:p-8 text-cyan-400 font-mono">
      
      {/* Top HUD: Status Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 p-4 rounded-br-3xl shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <h1 className="text-2xl font-bold tracking-widest text-cyan-300 mb-2">VINASPACE-1</h1>
            <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center text-green-400">
                    <Activity size={14} className="mr-1 animate-pulse" />
                    <span>HULL: 100%</span>
                </div>
                <div className="flex items-center text-blue-400">
                    <Shield size={14} className="mr-1" />
                    <span>SHIELDS: ONLINE</span>
                </div>
                 <div className="flex items-center text-yellow-400">
                    <Navigation size={14} className="mr-1" />
                    <span>POS: 42.11.90</span>
                </div>
            </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 p-2 px-4 rounded-bl-3xl flex flex-col items-end">
            <div className="text-xs text-cyan-600 mb-1">CURRENT VELOCITY</div>
            <div className="text-3xl font-bold text-white tabular-nums">
                {systemState.warpSpeed > 0 ? `WARP ${systemState.warpSpeed.toFixed(1)}` : 'IMPULSE'}
            </div>
        </div>
      </div>

      {/* Center Viewport is clear (for the 3D scene) */}
      <div className="flex-grow"></div>

      {/* Bottom HUD: Controls & Chat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto items-end">
        
        {/* Left Panel: Systems */}
        <div className="hidden md:block bg-black/70 backdrop-blur-md border border-cyan-500/30 p-4 rounded-tr-3xl h-64 overflow-y-auto">
            <h2 className="text-sm font-bold border-b border-cyan-500/30 pb-2 mb-3 flex items-center">
                <Radio size={16} className="mr-2" /> SYSTEM LOGS
            </h2>
            <div className="space-y-2 text-xs opacity-80">
                <div className="flex justify-between">
                    <span>> LIFE SUPPORT</span>
                    <span className="text-green-400">NOMINAL</span>
                </div>
                 <div className="flex justify-between">
                    <span>> GRAVITY GEN</span>
                    <span className="text-green-400">98%</span>
                </div>
                 <div className="flex justify-between">
                    <span>> REACTOR CORE</span>
                    <span className="text-yellow-400">STABLE</span>
                </div>
                <div className="mt-4 pt-2 border-t border-cyan-500/20">
                    <p className="text-cyan-700">> Scanning sector...</p>
                    <p className="text-cyan-700">> No hostiles detected.</p>
                    <p className="text-cyan-700">> Communications array active.</p>
                </div>
            </div>
            
            <div className="mt-6">
                <button 
                    onClick={toggleWarp}
                    className={`w-full py-2 px-4 border ${systemState.warpSpeed > 0 ? 'bg-orange-500/20 border-orange-500 text-orange-300' : 'bg-cyan-500/10 border-cyan-500 text-cyan-300'} rounded hover:bg-cyan-500/20 transition-all uppercase text-xs font-bold tracking-wider flex items-center justify-center`}
                >
                    <Zap size={14} className="mr-2" />
                    {systemState.warpSpeed > 0 ? 'DISENGAGE WARP' : 'ENGAGE WARP DRIVE'}
                </button>
            </div>
        </div>

        {/* Center Panel: Chat Terminal */}
        <div className="col-span-1 md:col-span-2 bg-black/80 backdrop-blur-md border border-cyan-500/50 rounded-t-xl overflow-hidden shadow-[0_-5px_20px_rgba(6,182,212,0.15)] flex flex-col h-72">
             <div className="bg-cyan-900/20 p-2 border-b border-cyan-500/30 flex justify-between items-center">
                <span className="text-xs font-bold flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    AI CORE INTERFACE
                </span>
                <span className="text-[10px] text-cyan-600">V.2.5.0-FLASH</span>
             </div>
             
             {/* Messages Area */}
             <div 
                ref={chatContainerRef}
                className="flex-grow overflow-y-auto p-4 space-y-3 font-mono text-sm"
             >
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-2 rounded ${msg.role === MessageRole.USER ? 'bg-cyan-900/40 text-cyan-100 border-l-2 border-cyan-500' : 'bg-gray-900/60 text-orange-100 border-l-2 border-orange-500'}`}>
                            <div className="text-[10px] opacity-50 mb-1 uppercase">{msg.role === MessageRole.USER ? 'CMD_OFFICER' : 'SHIP_AI'}</div>
                            <div>{msg.text}</div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="bg-gray-900/60 text-orange-100 border-l-2 border-orange-500 p-2 rounded animate-pulse">
                            Processing...
                         </div>
                    </div>
                )}
             </div>

             {/* Input Area */}
             <div className="p-3 bg-black/40 border-t border-cyan-500/30 flex items-center">
                <span className="text-cyan-500 mr-2">{'>'}</span>
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter command or query..."
                    className="flex-grow bg-transparent border-none outline-none text-cyan-100 placeholder-cyan-700 font-mono"
                    autoFocus
                />
                <button 
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="text-cyan-500 hover:text-cyan-300 disabled:opacity-50 p-1"
                >
                    <Send size={18} />
                </button>
             </div>
        </div>

      </div>

        {/* Decorative HUD Elements (Overlay lines) */}
        <div className="absolute inset-0 pointer-events-none border-[20px] border-gray-900/80 rounded-[3rem] opacity-50 mix-blend-multiply"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-cyan-500/20 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
        </div>
    </div>
  );
};

export default Dashboard;