
import React, { useState, useEffect } from 'react';
import { ScenarioInput, ThinkingDepth } from '../types';

interface InputFormProps {
  input: ScenarioInput;
  setInput: React.Dispatch<React.SetStateAction<ScenarioInput>>;
  onSimulate: () => void;
  isLoading: boolean;
  defaultInput: ScenarioInput;
}

const STORAGE_KEY = "decisionlab_form_v3";

const DOMAINS = [
  "Business",
  "Startup",
  "Policy",
  "Education",
  "Personal",
  "Operations",
  "Healthcare",
  "Non-profit"
];

interface ValidationErrors {
  title?: string;
  domain?: string;
  budget?: string;
  timeframe?: string;
  teamSize?: string;
}

const InputForm: React.FC<InputFormProps> = ({ input, setInput, onSimulate, isLoading, defaultInput }) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showTooltip, setShowTooltip] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setInput(parsed);
      } catch (e) {
        console.error("Failed to load saved form state", e);
      }
    }
  }, [setInput]);

  // Auto-save on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
  }, [input]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'title':
        if (!value.trim()) return "Title is required";
        if (value.trim().length < 5) return "Title must be at least 5 characters";
        return "";
      case 'domain':
        if (!value || !DOMAINS.includes(value)) return "Valid domain selection required";
        return "";
      case 'budget':
        if (!value.trim()) return "Budget is required";
        const numericBudget = parseFloat(value.replace(/[^0-9.-]+/g, ""));
        if (isNaN(numericBudget)) return "Enter a valid amount (e.g. $2000)";
        if (numericBudget < 0) return "Budget cannot be negative";
        return "";
      case 'timeframe':
        if (!value.trim()) return "Timeframe is required (e.g. 30 days)";
        return "";
      case 'teamSize':
        if (!value.trim()) return "Team size is required";
        const size = parseInt(value, 10);
        if (isNaN(size) || size < 1) return "Team size must be an integer >= 1";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Map nested field names if necessary
    const fieldKey = name.includes('.') ? name.split('.')[1] : name;
    const error = validateField(fieldKey, value);
    setErrors(prev => ({ ...prev, [fieldKey]: error || undefined }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error on change
    const fieldKey = name.includes('.') ? name.split('.')[1] : name;
    if (errors[fieldKey as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [fieldKey]: undefined }));
    }

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setInput(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ScenarioInput] as any),
          [child]: value
        }
      }));
    } else {
      setInput(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const newErrors: ValidationErrors = {
      title: validateField('title', input.title) || undefined,
      domain: validateField('domain', input.domain) || undefined,
      budget: validateField('budget', input.constraints.budget) || undefined,
      timeframe: validateField('timeframe', input.constraints.timeframe) || undefined,
      teamSize: validateField('teamSize', input.constraints.teamSize) || undefined,
    };

    // Filter out undefined errors
    const activeErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, v]) => v !== undefined));
    setErrors(activeErrors);

    if (Object.keys(activeErrors).length === 0) {
      onSimulate();
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all parameters to default?")) {
      localStorage.removeItem(STORAGE_KEY);
      setInput(defaultInput);
      setErrors({});
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-fit sticky top-24 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          Scenario Parameters
        </h2>
        <button 
          onClick={handleReset}
          className="text-[10px] font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors"
        >
          Reset Defaults
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5 tracking-wider">Scenario Title</label>
          <input
            type="text"
            name="title"
            value={input.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Q4 Market Expansion"
            className={`w-full bg-zinc-950 border ${errors.title ? 'border-red-500/50' : 'border-zinc-800'} rounded-lg px-4 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors`}
          />
          {errors.title && (
            <p className="mt-1.5 text-[10px] font-medium text-red-500 uppercase tracking-tighter">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5 tracking-wider">Domain</label>
          <select
            name="domain"
            value={input.domain}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full bg-zinc-950 border ${errors.domain ? 'border-red-500/50' : 'border-zinc-800'} rounded-lg px-4 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
          >
            <option value="">Select Domain...</option>
            {DOMAINS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.domain && (
            <p className="mt-1.5 text-[10px] font-medium text-red-500 uppercase tracking-tighter">
              {errors.domain}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5 tracking-wider">Goal</label>
          <input
            type="text"
            name="goal"
            value={input.goal}
            onChange={handleChange}
            placeholder="What is the primary objective?"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5 tracking-wider">Simulation Context</label>
          <textarea
            name="scenario"
            rows={4}
            value={input.scenario}
            onChange={handleChange}
            placeholder="Describe the current situation, constraints, and market dynamics..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5 tracking-wider">Budget</label>
            <input
              type="text"
              name="constraints.budget"
              value={input.constraints.budget}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="$50k"
              className={`w-full bg-zinc-950 border ${errors.budget ? 'border-red-500/50' : 'border-zinc-800'} rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm`}
            />
            {errors.budget && (
              <p className="mt-1.5 text-[10px] font-medium text-red-500 uppercase tracking-tighter">
                {errors.budget}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5 tracking-wider">Timeframe</label>
            <input
              type="text"
              name="constraints.timeframe"
              value={input.constraints.timeframe}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="90 days"
              className={`w-full bg-zinc-950 border ${errors.timeframe ? 'border-red-500/50' : 'border-zinc-800'} rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm`}
            />
            {errors.timeframe && (
              <p className="mt-1.5 text-[10px] font-medium text-red-500 uppercase tracking-tighter">
                {errors.timeframe}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5 tracking-wider">Team Size</label>
          <input
            type="text"
            name="constraints.teamSize"
            value={input.constraints.teamSize}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="5 engineers"
            className={`w-full bg-zinc-950 border ${errors.teamSize ? 'border-red-500/50' : 'border-zinc-800'} rounded-lg px-4 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm`}
          />
          {errors.teamSize && (
            <p className="mt-1.5 text-[10px] font-medium text-red-500 uppercase tracking-tighter">
              {errors.teamSize}
            </p>
          )}
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Thinking Depth</label>
            <div 
              className="relative cursor-help text-zinc-600 hover:text-indigo-400 transition-colors"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              tabIndex={0}
              aria-label="Information about thinking depth levels"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              
              {showTooltip && (
                <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl z-50 text-[10px] leading-relaxed animate-in fade-in slide-in-from-bottom-1 duration-200">
                  <div className="space-y-2">
                    <p><strong className="text-indigo-400 uppercase">Low:</strong> Fast, surface-level tradeoffs and immediate logic paths.</p>
                    <p><strong className="text-indigo-400 uppercase">Medium:</strong> Deeper risk modeling, constraint interactions, and multi-step logic.</p>
                    <p><strong className="text-indigo-400 uppercase">High:</strong> Full second-order effects, failure modeling, and sensitivity analysis.</p>
                  </div>
                  <div className="absolute right-1 top-full w-2 h-2 bg-zinc-950 border-r border-b border-zinc-800 rotate-45 -translate-y-1"></div>
                </div>
              )}
            </div>
          </div>
          <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-1">
            {(['low', 'medium', 'high'] as ThinkingDepth[]).map((depth) => (
              <button
                key={depth}
                type="button"
                onClick={() => setInput(prev => ({ ...prev, thinkingDepth: depth }))}
                className={`flex-1 py-1.5 text-xs font-bold rounded capitalize transition-all ${
                  input.thinkingDepth === depth 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {depth}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              PROCESSING...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              RUN SIMULATION
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;
