
import React from 'react';
import { RiskItem } from '../types';

interface RiskMatrixProps {
  risks: RiskItem[];
}

const RiskMatrix: React.FC<RiskMatrixProps> = ({ risks }) => {
  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Risk Matrix Analysis
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 font-mono text-xs uppercase">
              <th className="px-6 py-3 font-medium">Potential Risk</th>
              <th className="px-6 py-3 font-medium">Likelihood</th>
              <th className="px-6 py-3 font-medium">Impact</th>
              <th className="px-6 py-3 font-medium">Mitigation Strategy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {risks.map((item, idx) => (
              <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-200">{item.risk}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityColor(item.likelihood)}`}>
                    {item.likelihood.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityColor(item.impact)}`}>
                    {item.impact.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-400 leading-relaxed italic">
                  {item.mitigation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskMatrix;
