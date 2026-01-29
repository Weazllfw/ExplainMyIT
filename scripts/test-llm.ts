#!/usr/bin/env tsx
/**
 * LLM Integration Test Script
 * 
 * Tests end-to-end LLM report generation with real signal data
 */

// Load environment variables
import { config } from 'dotenv';
config({ path: '.env.local' });

import { collectAllSignals } from '../lib/signals/orchestrator';
import { generateReport, validateReport } from '../lib/llm/generator';

async function testLLMGeneration() {
  console.log('🧪 Testing LLM Report Generation\n');
  console.log('═'.repeat(60));
  
  const testDomain = 'github.com';
  
  try {
    // Step 1: Collect signals
    console.log(`\n📡 Step 1: Collecting signals for ${testDomain}...\n`);
    const signals = await collectAllSignals(testDomain);
    
    console.log(`✅ Signal collection complete (${signals.collection_duration_ms}ms)`);
    console.log(`   Successful modules: ${
      [signals.dns.success, signals.email.success, signals.tls.success, 
       signals.techstack.success, signals.exposure.success, signals.hibp.success]
      .filter(Boolean).length
    }/6`);
    
    // Step 2: Generate LLM report
    console.log(`\n🤖 Step 2: Generating LLM report...\n`);
    const reportUrl = 'https://explainmyit.com/report/test-12345';
    
    const result = await generateReport(signals, reportUrl);
    
    if (!result.success || !result.report) {
      console.error('❌ LLM generation failed:', result.error);
      process.exit(1);
    }
    
    const report = result.report;
    
    // Step 3: Validate report structure
    console.log('\n✅ LLM generation successful! Validating...\n');
    
    const validation = validateReport(report);
    
    if (!validation.valid) {
      console.error('❌ Report validation failed:');
      validation.errors.forEach(err => console.error(`   - ${err}`));
      process.exit(1);
    }
    
    console.log('✅ Report validation passed!\n');
    
    // Step 4: Display results
    console.log('═'.repeat(60));
    console.log('📊 REPORT PREVIEW\n');
    
    console.log('📧 EMAIL SUBJECT:');
    console.log(`   ${report.email_subject}\n`);
    
    console.log('📝 OWNER SUMMARY:');
    console.log(`   ${report.owner_summary}\n`);
    
    console.log('🎯 TOP FINDINGS:');
    report.top_findings.forEach((finding, i) => {
      console.log(`   ${i + 1}. ${finding.title} (${finding.confidence})`);
      console.log(`      ${finding.description.substring(0, 100)}...\n`);
    });
    
    console.log('💭 ASSUMPTIONS:');
    report.assumptions.forEach((assumption, i) => {
      console.log(`   ${i + 1}. ${assumption}`);
    });
    console.log('');
    
    console.log('❓ QUESTIONS:');
    report.questions.forEach((question, i) => {
      console.log(`   ${i + 1}. ${question}`);
    });
    console.log('');
    
    console.log('📦 BLOCK NARRATIVES:');
    const blocks = ['dns', 'email', 'tls', 'techstack', 'exposure', 'hibp'];
    blocks.forEach(block => {
      const narrative = (report.block_narratives as any)[block];
      if (narrative) {
        console.log(`   ${block.toUpperCase()}: ${narrative.title} (${narrative.confidence})`);
        console.log(`      Code: ${narrative.finding_code}`);
      }
    });
    console.log('');
    
    console.log('═'.repeat(60));
    console.log('✅ LLM Integration Test PASSED!\n');
    console.log('Ready for production use.');
    
  } catch (error) {
    console.error('\n❌ Test failed with exception:');
    console.error(error);
    process.exit(1);
  }
}

// Run test
testLLMGeneration().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
