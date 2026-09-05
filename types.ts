export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type InputType = 'message' | 'screenshot' | 'url' | 'upi';

export interface Indicator {
  id: string;
  label: string;
  description: string;
  weight: number;
  matched: boolean;
  category: string;
}

export interface ScamAnalysis {
  riskScore: number;
  riskLevel: RiskLevel;
  scamType: string;
  indicators: Indicator[];
  recommendations: string[];
  summary: string;
  inputType: InputType;
  analyzedText: string;
  screenshotWarning?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface DemoCase {
  id: string;
  title: string;
  description: string;
  inputType: InputType;
  content: string;
}
