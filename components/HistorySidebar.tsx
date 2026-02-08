
import React from 'react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  history: HistoryItem[];
  onLoadResult: (item: HistoryItem) => void;
  onClearHistory: () => void;
  currentResultId?: string;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  history, 
  onLoadResult, 
  onClearHistory,
  currentResultId 
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Simulation Ledger
        </h2>
        <button 
          onClick={onClearHistory}
          className="text-[10px] font-bold text-zinc-700 hover:text-red-400 uppercase tracking-tighter transition-colors"
        >
          Clear Ledger
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onLoadResult(item)}
            className={`w-full text-left p-3 rounded-lg border transition-all group ${
              currentResultId === item.id 
                ? 'bg-indigo-500/10 border-indigo-500/30' 
                : 'bg-zinc-950/50 border-zinc-800/50 hover:border-zinc-700'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                item.selected_strategy === 'Hybrid' 
                  ? 'bg-indigo-500/20 text-indigo-300' 
                  : item.selected_strategy === 'A' 
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
              }`}>
                {item.selected_strategy === 'Hybrid' ? 'HYBRID' : `PATH ${item.selected_strategy}`}
              </span>
              <span className="text-[9px] font-mono text-zinc-600 group-hover:text-zinc-400">
                {item.created_at}
              </span>
            </div>
            <h4 className={`text-xs font-bold truncate ${currentResultId === item.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
              {item.scenario_title}
            </h4>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[8px] font-mono text-zinc-700 uppercase">{item.domain}</span>
              <span className="text-zinc-800 text-[8px]">•</span>
              <span className="text-[8px] font-mono text-zinc-700 uppercase">{item.thinking_depth} DEPTH</span>
            </div>
          </button>
        ))}
      </div>
      <p className="mt-4 text-[9px] text-zinc-700 text-center font-mono uppercase tracking-widest italic">
        Last 5 records maintained
      </p>
    </div>
  );
};

export default HistorySidebar;
