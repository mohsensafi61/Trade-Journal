// ─── Database Types (from Supabase) ───
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface TradingSystem {
  id: string;
  user_id: string;
  entry: string | null;
  exit: string | null;
  sizing: string | null;
  stop_rule: string | null;
  time_rule: string | null;
  instruments: string | null;
  news_rule: string | null;
  psych_rule: string | null;
  updated_at: string;
}

export interface ForbiddenItem {
  id: string;
  user_id: string;
  text: string;
  created_at: string;
}

export type Outcome = 'win' | 'loss' | 'flat';
export type DecisionQuality = 'good' | 'bad';
export type ConfidenceType = 'real' | 'false';
export type LearningType = 'pattern' | 'belief' | 'stat' | 'rule';

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  symbol: string;
  outcome: Outcome;
  r_value: number | null;
  rule_adherence: boolean | null;
  decision_quality: DecisionQuality | null;
  execution: Record<string, boolean>;
  stress: number;
  satisfaction: number;
  fatigue: number;
  confidence_type: ConfidenceType | null;
  greed: boolean | null;
  fears: string[];
  forbidden_violated: string[]; // array of forbidden_item ids
  learning_type: LearningType | null;
  learning_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Checklist {
  id: string;
  user_id: string;
  checklist_date: string; // YYYY-MM-DD
  checks: Record<string, boolean>;
  motivation: string | null;
  created_at: string;
  updated_at: string;
}

export interface SystemLog {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD
  stability: number;
  adaptability: number;
  resilience: number;
  calm: number;
  created_at: string;
}

// ─── UI/Constant Types ───
export interface ChecklistItemDef {
  id: string;
  label: string;
}

export interface ChecklistSectionDef {
  id: string;
  title: string;
  subtitle: string;
  items: ChecklistItemDef[];
}

export interface SystemFieldDef {
  id: string;
  label: string;
  hint: string;
}

export interface ExecCheckDef {
  id: string;
  label: string;
}

export interface LearningTypeOption {
  value: LearningType;
  label: string;
}