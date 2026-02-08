
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import StrategyDashboard from './components/StrategyDashboard';
import HistorySidebar from './components/HistorySidebar';
import { DecisionResult, ScenarioInput, HistoryItem } from './types';
import { geminiService } from './services/geminiService';

const DEFAULT_INPUT: ScenarioInput = {
  title: "Gemini 3 Hackathon Strategy",
  domain: "Startup",
  scenario: "Solo builder with 3 days left. Aiming to win the prize. Highly competitive environment. Need to balance feature completeness with 'wow' factor and technical depth of Gemini integration.",
  goal: "Maximize probability of winning a top prize.",
  constraints: {
    budget: "$0",
    timeframe: "72 hours",
    teamSize: "1 Developer"
  },
  thinkingDepth: "high"
};

const LOADING_STAGES = [
  "Analyzing scenario constraints...",
  "Simulating strategic trajectories...",
  "Generating comparative models...",
  "Finalizing executive summary..."
];

const HISTORY_STORAGE_KEY = "decisionlab_history_v1";

const App: React.FC = () => {
  const [input, setInput] = useState<ScenarioInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentResultId, setCurrentResultId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const addToHistory = (res: DecisionResult, inp: ScenarioInput) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      scenario_title: inp.title,
      domain: inp.domain,
      thinking_depth: inp.thinkingDepth,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      original_input: { ...inp }, // Store full input for restoration
      selected_strategy: res.recommendation.selected,
      result: res
    };

    setHistory(prev => {
      const updated = [newItem, ...prev].slice(0, 5);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setCurrentResultId(newItem.id);
  };

  const clearHistory = () => {
    if (window.confirm("Clear all simulation records from the ledger?")) {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      setHistory([]);
    }
  };

  const loadHistoryResult = (item: HistoryItem) => {
    // 1. Restore the result to the dashboard
    setResult(item.result);
    setCurrentResultId(item.id);
    
    // 2. Restore the input form state for pivoting
    setInput(item.original_input);
    
    // 3. Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const runSimulation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setLoadingStage(LOADING_STAGES[0]);

    // Simulate stage transitions
    let currentStage = 0;
    const interval = setInterval(() => {
      currentStage++;
      if (currentStage < LOADING_STAGES.length) {
        setLoadingStage(LOADING_STAGES[currentStage]);
      }
    }, 2500);

    try {
      const isPivot = !!result;
      const data = await geminiService.runSimulation(input, isPivot);
      setResult(data);
      addToHistory(data, input);
    } catch (err: any) {
      setError(err.message || "Simulation engine encountered an unexpected runtime exception.");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
      setLoadingStage("");
    }
  }, [input, result]);

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-indigo-500/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Controls & History */}
          <div className="lg:col-span-4 space-y-8">
            <InputForm 
              input={input} 
              setInput={setInput} 
              onSimulate={runSimulation}
              isLoading={isLoading}
              defaultInput={DEFAULT_INPUT}
            />
            
            <HistorySidebar 
              history={history} 
              onLoadResult={loadHistoryResult} 
              onClearHistory={clearHistory}
              currentResultId={currentResultId}
            />
          </div>

          {/* Right Column: Dashboard */}
          <div className="lg:col-span-8">
            {error !== null && (
              <div className="bg-red-500/5 border border-red-500/20 text-red-400 p-5 rounded-xl mb-8 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-red-500/20">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-[10px] mb-1">Critical Runtime Error</h4>
                  <p className="text-sm font-medium leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {!result && !isLoading && !error && (
              <div className="h-full min-h-[400px] border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-12 text-center bg-zinc-900/20">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800 shadow-inner">
                  <svg className="w-8 h-8 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-zinc-400 mb-2 uppercase tracking-tight">Simulation Engine Idle</h2>
                <p className="text-zinc-600 max-w-sm text-sm">
                  The specialized reasoning engine is waiting for scenario parameters. Trigger the core to generate a strategic report.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="h-full flex flex-col items-center justify-center py-24 space-y-8">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-r-indigo-500/30 animate-spin [animation-duration:1.5s]"></div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-white uppercase tracking-[0.2em] animate-pulse">
                    {loadingStage}
                  </h3>
                  <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
                    Quantum Reasoning Subsystem v3.1 Active
                  </p>
                </div>
                
                <div className="w-64 grid grid-cols-4 gap-2">
                  {LOADING_STAGES.map((s, i) => (
                    <div 
                      key={i} 
                      className={`h-1 rounded-full transition-all duration-500 ${
                        LOADING_STAGES.indexOf(loadingStage) >= i ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-zinc-800'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {result && !isLoading && (
              <StrategyDashboard result={result} />
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-800 rounded-md flex items-center justify-center border border-zinc-700">
              <span className="text-zinc-400 font-black text-xs">DL</span>
            </div>
            <span className="text-zinc-600 text-xs font-mono tracking-widest uppercase font-bold">DECISIONLAB AI // SYSTEM_SECURE_V3.1</span>
          </div>
          <div className="text-zinc-800 text-[10px] font-mono uppercase tracking-[0.2em]">
            © 2025 Strategic Reasoning Engine • DecisionLab AI Global
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
