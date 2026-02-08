
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { DecisionResult, ScenarioInput } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async runSimulation(input: ScenarioInput, isPivot: boolean = false): Promise<DecisionResult> {
    const prompt = `
${isPivot ? 'PIVOT_CHANGE: Recalculate based on new variables.' : ''}
SCENARIO_TITLE: ${input.title}
DOMAIN: ${input.domain}
SCENARIO: ${input.scenario}
GOAL: ${input.goal}
CONSTRAINTS:
Budget: ${input.constraints.budget}
Timeframe: ${input.constraints.timeframe}
Team size: ${input.constraints.teamSize}
THINKING_DEPTH: ${input.thinkingDepth}
    `.trim();

    try {
      // Re-initialize to ensure latest API key if applicable
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.1,
          thinkingConfig: input.thinkingDepth === 'high' ? { thinkingBudget: 32768 } : undefined,
        },
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from simulation engine.");
      
      // Strict JSON extraction
      let cleaned = text.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
      }
      
      return JSON.parse(cleaned) as DecisionResult;
    } catch (error) {
      console.error("Simulation failed:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
