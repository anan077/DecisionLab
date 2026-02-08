
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase mono">DecisionLab AI</h1>
            <p className="text-xs text-zinc-400 font-medium">STRATEGIC SIMULATION ENGINE v3.0</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            ENGINE_ONLINE
          </span>
          <span className="text-zinc-700">|</span>
          <span>LATENCY: 240MS</span>
          <span className="text-zinc-700">|</span>
          <span>UTC: {new Date().toISOString().split('T')[1].slice(0, 8)}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
