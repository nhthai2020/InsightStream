import React from 'react';
import { Activity, BrainCircuit } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
          <BrainCircuit className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            InsightStream
          </h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            REAL-TIME INTELLIGENCE ENGINE
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-700">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono text-emerald-400">SYSTEM ONLINE</span>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          v2.5-FLASH-CONNECTED
        </div>
      </div>
    </header>
  );
};

export default Header;
