
import React, { useMemo } from 'react';
import { DecisionResult, Strategy } from '../types';
import RiskMatrix from './RiskMatrix';
import RadarChart from './RadarChart';

interface StrategyDashboardProps {
  result: DecisionResult;
}

const StrategyDashboard: React.FC<StrategyDashboardProps> = ({ result }) => {
  const downloadReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `decision_report_${result.meta.domain.toLowerCase()}_${new Date().getTime()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Mock score mapping for Radar Chart based on tradeoffs text or generic weights
  const chartData = useMemo(() => {
    const dims = ["Speed", "Cost", "Risk", "Scale", "Stability"];
    // In a real scenario, the LLM would output these numbers. 
    // Here we derive them or provide defaults to visualize the comparison.
    return {
      dimensions: dims,
      a: [8, 4, 7, 9, 5],
      b: [4, 9, 3, 6, 9]
    };
  }, [result]);

  const renderStrategyCard = (strategy: Strategy, variant: 'a' | 'b') => (
    <div className={`rounded-2xl border transition-all ${variant === 'a' ? 'border-indigo-500/30 bg-indigo-500/5 shadow-lg shadow-indigo-500/5' : 'border-amber-500/10 bg-zinc-900 shadow-lg'}`}>
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${variant === 'a' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'bg-amber-600/20 text-amber-400 border border-amber-500/30'}`}>
            Strategy {variant.toUpperCase()}
          </span>
          <span className="text-zinc-500 text-xs font-mono">{strategy.timeline.length} PHASES</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{strategy.name}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">{strategy.summary}</p>
        
        <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800 mb-6">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Core Logic</h4>
          <p className="text-sm font-medium text-zinc-300 italic">{strategy.core_logic}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-3">Key Pros</h4>
            <ul className="space-y-2">
              {strategy.pros.map((p, i) => (
                <li key={i} className="flex gap-2 text-xs text-zinc-400">
                  <span className="text-emerald-500 flex-shrink-0">•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-3">Key Cons</h4>
            <ul className="space-y-2">
              {strategy.cons.map((c, i) => (
                <li key={i} className="flex gap-2 text-xs text-zinc-400">
                  <span className="text-red-500 flex-shrink-0">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Implementation Roadmap</h4>
          <div className="space-y-4">
            {strategy.steps.map((step, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== strategy.steps.length - 1 && (
                  <div className="absolute left-3 top-6 w-[1px] h-full bg-zinc-800"></div>
                )}
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold flex-shrink-0 relative z-10 ${
                  variant === 'a' ? 'bg-indigo-900/50 border-indigo-500/50 text-indigo-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}>
                  {i + 1}
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-zinc-200">{step.step}</h5>
                  <p className="text-xs text-zinc-500 mt-1">{step.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-6 border-t border-zinc-800">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Resource & Cost Outline</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-950/30 rounded-lg p-3 border border-zinc-800/50">
              <span className="text-[10px] text-zinc-600 block mb-2 font-bold uppercase tracking-tighter">Human/Asset Allocation</span>
              {strategy.resource_plan.map((r, i) => (
                <div key={i} className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-500 truncate mr-2">{r.resource}</span>
                  <span className="text-zinc-300 font-medium whitespace-nowrap">{r.allocation}</span>
                </div>
              ))}
            </div>
            <div className="bg-zinc-950/30 rounded-lg p-3 border border-zinc-800/50">
              <span className="text-[10px] text-zinc-600 block mb-2 font-bold uppercase tracking-tighter">Financial Estimate</span>
              {strategy.cost_outline.map((c, i) => (
                <div key={i} className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-500 truncate mr-2">{c.item}</span>
                  <span className="text-zinc-300 font-medium whitespace-nowrap">{c.estimate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight">Strategic Analysis Report</h2>
          <p className="text-zinc-500 text-xs font-mono mt-1">SIMULATION_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} // {result.meta.timestamp_utc}</p>
        </div>
        <button 
          onClick={downloadReport}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all border border-zinc-700 shadow-xl self-start md:self-center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          DOWNLOAD REPORT (.JSON)
        </button>
      </div>

      {/* Top Level Comparison: Radar + Confidence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col md:flex-row bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl gap-8">
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Decision Surface Map</h3>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                Visualizing strategy alignment across primary operational vectors. Path A prioritizes 
                <span className="text-indigo-400 font-bold"> {chartData.dimensions[0]}</span> and 
                <span className="text-indigo-400 font-bold"> {chartData.dimensions[3]}</span>, while Path B optimizes for 
                <span className="text-amber-400 font-bold"> {chartData.dimensions[1]}</span> and 
                <span className="text-amber-400 font-bold"> {chartData.dimensions[4]}</span>.
              </p>
            </div>
            <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/50">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Core Assumptions</h4>
              <div className="flex flex-wrap gap-2">
                {result.assumptions.slice(0, 5).map((a, i) => (
                  <span key={i} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-500 text-[9px] rounded font-medium">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <RadarChart 
            dimensions={chartData.dimensions} 
            strategyA={chartData.a} 
            strategyB={chartData.b}
            labels={{ a: result.strategy_a.name, b: result.strategy_b.name }}
          />
        </div>

        <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center shadow-xl text-center">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Simulation Confidence</div>
            <div className="text-5xl font-black text-indigo-400 mono leading-none mb-4">{result.confidence.score_0_to_100}%</div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden mb-6">
              <div 
                className="h-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)] transition-all duration-1000 ease-out" 
                style={{ width: `${result.confidence.score_0_to_100}%` }}
              ></div>
            </div>
            <div className="text-left w-full space-y-2">
              <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Key Uncertainties</h4>
              {result.confidence.key_uncertainties.map((u, i) => (
                <div key={i} className="text-[10px] text-zinc-500 leading-tight flex gap-2">
                  <span className="text-zinc-700">●</span> {u}
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Execution Summary Section */}
      {result.execution_summary && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl border-l-4 border-l-emerald-500">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Simulation Execution Audit</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-2 tracking-widest">Analysis Vector</h4>
              <ul className="space-y-1">
                {result.execution_summary.analysis_performed.map((a, i) => (
                  <li key={i} className="text-[11px] text-zinc-400 flex gap-2">
                    <span className="text-indigo-500 font-bold">›</span> {a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-2 tracking-widest">Constraint Set</h4>
              <ul className="space-y-1">
                {result.execution_summary.constraints_considered.map((c, i) => (
                  <li key={i} className="text-[11px] text-zinc-400 flex gap-2">
                    <span className="text-indigo-500 font-bold">›</span> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-2 tracking-widest">Evaluated Trade-offs</h4>
              <ul className="space-y-1">
                {result.execution_summary.key_tradeoffs_evaluated.map((t, i) => (
                  <li key={i} className="text-[11px] text-zinc-400 flex gap-2">
                    <span className="text-indigo-500 font-bold">›</span> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800 flex flex-col justify-center">
              <h4 className="text-[10px] font-bold text-indigo-400 uppercase mb-2 tracking-widest">Primary Optimization</h4>
              <p className="text-xs font-semibold text-zinc-200 leading-relaxed">{result.execution_summary.what_was_optimized_for}</p>
            </div>
          </div>
        </div>
      )}

      {/* Strategy Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderStrategyCard(result.strategy_a, 'a')}
        {renderStrategyCard(result.strategy_b, 'b')}
      </div>

      {/* Trade-offs Matrix */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Logic Comparison Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 font-mono text-[10px] uppercase">
                <th className="px-6 py-4 font-medium">Dimension</th>
                <th className="px-6 py-4 font-medium text-indigo-400">{result.strategy_a.name}</th>
                <th className="px-6 py-4 font-medium text-amber-400">{result.strategy_b.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {result.comparison.tradeoffs.map((t, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/20">
                  <td className="px-6 py-4 font-bold text-zinc-500 uppercase text-[10px] tracking-wider whitespace-nowrap">{t.dimension}</td>
                  <td className="px-6 py-4 text-zinc-300 italic border-l border-zinc-800/50">{t.strategy_a}</td>
                  <td className="px-6 py-4 text-zinc-300 italic border-l border-zinc-800/50">{t.strategy_b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Failure Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-red-950/10 border border-red-500/20 rounded-xl p-6 shadow-lg">
          <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Critical Failure Conditions (A)
          </h4>
          <ul className="space-y-3">
            {result.comparison.failure_conditions.strategy_a_fails_if.map((f, i) => (
              <li key={i} className="text-xs text-zinc-400 flex gap-3">
                <span className="text-red-500/50 font-bold">[!]</span> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-950/10 border border-amber-500/20 rounded-xl p-6 shadow-lg">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Critical Failure Conditions (B)
          </h4>
          <ul className="space-y-3">
            {result.comparison.failure_conditions.strategy_b_fails_if.map((f, i) => (
              <li key={i} className="text-xs text-zinc-400 flex gap-3">
                <span className="text-amber-500/50 font-bold">[!]</span> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Risk Matrix */}
      <RiskMatrix risks={result.risk_matrix} />

      {/* Final Recommendation */}
      <div className="bg-indigo-600 rounded-2xl p-1 shadow-2xl shadow-indigo-500/40">
        <div className="bg-zinc-900 rounded-[14px] p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Executive Synthesis
              </span>
              <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">
                PROPOSAL: {result.recommendation.selected === 'Hybrid' ? 'HYBRID ARCHITECTURE' : `STRATEGY ${result.recommendation.selected}`}
              </h3>
              <div className="space-y-4">
                {result.recommendation.justification.map((j, i) => (
                  <p key={i} className="text-zinc-200 leading-relaxed font-medium border-l-2 border-indigo-500/50 pl-4">
                    {j}
                  </p>
                ))}
              </div>
            </div>
            <div className="w-full md:w-80 bg-zinc-950 rounded-xl p-6 border border-zinc-800 shadow-inner">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Tactical Activation (0-72h)</h4>
              <ul className="space-y-4">
                {result.recommendation.first_actions.map((a, i) => (
                  <li key={i} className="flex gap-3 text-xs text-zinc-400 items-start">
                    <span className="w-5 h-5 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-indigo-400 flex-shrink-0">
                      {i + 1}
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Log */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mono text-[10px] shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-zinc-600 uppercase tracking-widest font-bold">Engine Decision Trace</h4>
          <span className="text-[9px] text-zinc-800 font-bold uppercase tracking-widest">Protocol: DecisionLab_Engine_v3.1</span>
        </div>
        <div className="space-y-1 opacity-60 overflow-y-auto max-h-48 scrollbar-hide">
          {result.decision_log.map((log, i) => (
            <div key={i} className="flex gap-4">
              <span className="text-zinc-700">[{result.meta.timestamp_utc || new Date().toISOString().slice(11, 19)}]</span>
              <span className="text-zinc-500">{log}</span>
            </div>
          ))}
          <div className="text-emerald-900/50 uppercase font-black pt-2 tracking-[0.3em]">Simulation Complete // System Idle</div>
        </div>
      </div>
    </div>
  );
};

export default StrategyDashboard;
