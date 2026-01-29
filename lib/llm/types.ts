/**
 * LLM Response Types
 * 
 * Type definitions for all LLM-generated content
 */

/**
 * Block narrative (per signal block)
 */
export interface BlockNarrative {
  finding_code: string;
  title: string;
  explanation: string;
  why_it_matters: string;
  confidence: 'high' | 'medium' | 'low';
  confidence_note: string;
}

/**
 * All block narratives (Call 1 output)
 */
export interface AllBlockNarratives {
  dns: BlockNarrative;
  email: BlockNarrative;
  tls: BlockNarrative;
  techstack: BlockNarrative;
  exposure: BlockNarrative;
  hibp: BlockNarrative;
}

/**
 * Top finding (for synthesis)
 */
export interface TopFinding {
  finding_code: string;
  title: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Synthesis + Assumptions + Questions (Call 2 output)
 */
export interface SynthesisOutput {
  owner_summary: string;
  top_findings: TopFinding[];
  assumptions: string[];
  questions: string[];
}

/**
 * Email summary (Call 3 output)
 */
export interface EmailOutput {
  subject: string;
  body: string;
}

/**
 * Complete LLM-generated report
 */
export interface LLMReport {
  block_narratives: AllBlockNarratives;
  owner_summary: string;
  top_findings: TopFinding[];
  assumptions: string[];
  questions: string[];
  email_subject: string;
  email_body: string;
}
