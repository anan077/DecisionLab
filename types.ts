
export type ThinkingDepth = 'low' | 'medium' | 'high';

export interface ScenarioInput {
  title: string;
  domain: string;
  scenario: string;
  goal: string;
  constraints: {
    budget: string;
    timeframe: string;
    teamSize: string;
  };
  thinkingDepth: ThinkingDepth;
}

export interface Step {
  step: string;
  why: string;
}

export interface TimelineEntry {
  phase: string;
  duration: string;
}

export interface ResourceAllocation {
  resource: string;
  allocation: string;
}

export interface CostOutlineEntry {
  item: string;
  estimate: string;
}

export interface Strategy {
  name: string;
  summary: string;
  core_logic: string;
  steps: Step[];
  timeline: TimelineEntry[];
  resource_plan: ResourceAllocation[];
  cost_outline: CostOutlineEntry[];
  pros: string[];
  cons: string[];
}

export interface Tradeoff {
  dimension: string;
  strategy_a: string;
  strategy_b: string;
}

export interface RiskItem {
  risk: string;
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
}

export interface ExecutionSummary {
  analysis_performed: string[];
  constraints_considered: string[];
  key_tradeoffs_evaluated: string[];
  what_was_optimized_for: string;
}

export interface DecisionResult {
  meta: {
    model: string;
    thinking_depth: ThinkingDepth;
    domain: string;
    timestamp_utc: string;
  };
  assumptions: string[];
  strategy_a: Strategy;
  strategy_b: Strategy;
  comparison: {
    tradeoffs: Tradeoff[];
    failure_conditions: {
      strategy_a_fails_if: string[];
      strategy_b_fails_if: string[];
    };
  };
  risk_matrix: RiskItem[];
  recommendation: {
    selected: 'A' | 'B' | 'Hybrid';
    justification: string[];
    first_actions: string[];
  };
  decision_log: string[];
  execution_summary: ExecutionSummary;
  confidence: {
    score_0_to_100: number;
    key_uncertainties: string[];
  };
}

export interface HistoryItem {
  id: string;
  scenario_title: string;
  domain: string;
  thinking_depth: ThinkingDepth;
  created_at: string;
  original_input: ScenarioInput; // Added for restoration
  selected_strategy: 'A' | 'B' | 'Hybrid';
  result: DecisionResult;
}
