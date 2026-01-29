/**
 * LLM Report Generator
 * 
 * Orchestrates 3 LLM calls to generate complete report narrative:
 * 1. Block Narratives (all 6 blocks)
 * 2. Synthesis + Assumptions + Questions
 * 3. Email Summary
 */

import { callClaudeJSON } from './client';
import {
  buildBlockNarrativesPrompt,
  buildSynthesisPrompt,
  buildEmailPrompt,
} from './prompts';
import type {
  LLMReport,
  AllBlockNarratives,
  SynthesisOutput,
  EmailOutput,
} from './types';
import type { SnapshotSignals } from '@/types/database';

/**
 * Generate complete LLM report for a snapshot
 * 
 * Cost estimate: ~$0.025-0.035 per snapshot (Claude 3.5 Haiku)
 * Duration: ~3-5 seconds for all 3 calls
 */
export async function generateReport(
  domain: string,
  signals: SnapshotSignals,
  reportUrl: string
): Promise<{ success: boolean; report?: LLMReport; error?: string }> {
  const startTime = Date.now();
  
  console.log(`🤖 Starting LLM report generation for ${domain}`);
  
  try {
    // CALL 1: Block Narratives (all 6 blocks in one request)
    console.log('   📝 Generating block narratives (6 blocks)...');
    const narrativesPrompt = buildBlockNarrativesPrompt(signals);
    const narrativesResult = await callClaudeJSON<AllBlockNarratives>(narrativesPrompt, {
      max_tokens: 3000, // Generous for 6 blocks
      retries: 1,
    });
    
    if (!narrativesResult.success || !narrativesResult.data) {
      return {
        success: false,
        error: `Block narratives failed: ${narrativesResult.error}`,
      };
    }
    
    const blockNarratives = narrativesResult.data;
    console.log('   ✅ Block narratives complete');
    
    // CALL 2: Synthesis + Assumptions + Questions
    console.log('   📝 Generating synthesis + assumptions + questions...');
    const synthesisPrompt = buildSynthesisPrompt(signals);
    const synthesisResult = await callClaudeJSON<SynthesisOutput>(synthesisPrompt, {
      max_tokens: 2000,
      retries: 1,
    });
    
    if (!synthesisResult.success || !synthesisResult.data) {
      return {
        success: false,
        error: `Synthesis failed: ${synthesisResult.error}`,
      };
    }
    
    const synthesis = synthesisResult.data;
    console.log('   ✅ Synthesis complete');
    
    // CALL 3: Email Summary
    console.log('   📝 Generating email summary...');
    const emailPrompt = buildEmailPrompt(
      synthesis.owner_summary,
      synthesis.top_findings.map(f => ({
        title: f.title,
        description: f.description,
      })),
      reportUrl
    );
    const emailResult = await callClaudeJSON<EmailOutput>(emailPrompt, {
      max_tokens: 1000,
      retries: 1,
    });
    
    if (!emailResult.success || !emailResult.data) {
      return {
        success: false,
        error: `Email generation failed: ${emailResult.error}`,
      };
    }
    
    const email = emailResult.data;
    console.log('   ✅ Email summary complete');
    
    const duration = Date.now() - startTime;
    console.log(`✅ LLM report generation complete in ${(duration / 1000).toFixed(2)}s`);
    
    // Combine all results
    const report: LLMReport = {
      block_narratives: blockNarratives,
      owner_summary: synthesis.owner_summary,
      top_findings: synthesis.top_findings,
      assumptions: synthesis.assumptions,
      questions: synthesis.questions,
      email_subject: email.subject,
      email_body: email.body,
    };
    
    return {
      success: true,
      report,
    };
    
  } catch (error) {
    console.error('❌ LLM report generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Validate LLM report structure
 * (Optional quality check before saving to database)
 */
export function validateReport(report: LLMReport): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check block narratives
  const requiredBlocks = ['dns', 'email', 'tls', 'techstack', 'exposure', 'hibp'];
  for (const block of requiredBlocks) {
    const narrative = (report.block_narratives as any)[block];
    if (!narrative) {
      errors.push(`Missing narrative for block: ${block}`);
      continue;
    }
    
    if (!narrative.finding_code || !narrative.title || !narrative.explanation) {
      errors.push(`Incomplete narrative for block: ${block}`);
    }
    
    if (!['high', 'medium', 'low'].includes(narrative.confidence)) {
      errors.push(`Invalid confidence for block ${block}: ${narrative.confidence}`);
    }
  }
  
  // Check synthesis
  if (!report.owner_summary || report.owner_summary.length < 50) {
    errors.push('Owner summary too short or missing');
  }
  
  if (!report.top_findings || report.top_findings.length === 0) {
    errors.push('No top findings generated');
  }
  
  if (!report.assumptions || report.assumptions.length < 3) {
    errors.push('Not enough assumptions (need 3-5)');
  }
  
  if (!report.questions || report.questions.length < 3) {
    errors.push('Not enough questions (need 3-5)');
  }
  
  // Check email
  if (!report.email_subject || !report.email_body) {
    errors.push('Email subject or body missing');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
