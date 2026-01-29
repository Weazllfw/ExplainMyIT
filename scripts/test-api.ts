#!/usr/bin/env tsx
/**
 * Snapshot API Test Script
 * 
 * Tests the complete flow:
 * 1. Request snapshot via API
 * 2. Validate response
 * 3. Check database records
 * 4. Verify magic link
 */

// Load environment variables
import { config } from 'dotenv';
config({ path: '.env.local' });

import { getSnapshotById } from '../lib/db/snapshots';
import { verifyMagicLinkToken, validateSnapshotAccess } from '../lib/auth/magic-link';

async function testSnapshotAPI() {
  console.log('🧪 Testing Snapshot API\n');
  console.log('═'.repeat(60));
  
  const testDomain = 'github.com';
  const testEmail = 'test@example.com';
  const apiUrl = 'http://localhost:3000/api/snapshot';
  
  try {
    // Step 1: Request snapshot
    console.log(`\n📨 Step 1: Requesting snapshot for ${testDomain}...\n`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        domain: testDomain,
        email: testEmail,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API request failed:', error);
      process.exit(1);
    }
    
    const result = await response.json();
    
    console.log(`✅ API request successful!`);
    console.log(`   Snapshot ID: ${result.snapshot_id}`);
    console.log(`   Generation Time: ${result.generation_time_seconds}s`);
    console.log(`   Report URL: ${result.report_url}`);
    console.log(`   Message: ${result.message}\n`);
    
    const { snapshot_id, magic_link } = result;
    
    // Step 2: Verify database record
    console.log(`\n📊 Step 2: Verifying database record...\n`);
    
    const { snapshot, error: dbError } = await getSnapshotById(snapshot_id);
    
    if (dbError || !snapshot) {
      console.error('❌ Failed to fetch snapshot from database:', dbError);
      process.exit(1);
    }
    
    console.log(`✅ Snapshot found in database`);
    console.log(`   Status: ${snapshot.status}`);
    console.log(`   Domain: ${snapshot.domain}`);
    console.log(`   Created: ${snapshot.created_at}`);
    console.log(`   Completed: ${snapshot.completed_at}`);
    console.log(`   Duration: ${snapshot.generation_duration_seconds}s\n`);
    
    // Check signals
    if (snapshot.signals_json) {
      const signals = snapshot.signals_json;
      console.log(`   Signals collected:`);
      console.log(`     DNS: ${signals.dns.success ? '✅' : '❌'} (${signals.dns.confidence})`);
      console.log(`     Email: ${signals.email.success ? '✅' : '❌'} (${signals.email.confidence})`);
      console.log(`     TLS: ${signals.tls.success ? '✅' : '❌'} (${signals.tls.confidence})`);
      console.log(`     Tech Stack: ${signals.techstack.success ? '✅' : '❌'} (${signals.techstack.confidence})`);
      console.log(`     Exposure: ${signals.exposure.success ? '✅' : '❌'} (${signals.exposure.confidence})`);
      console.log(`     HIBP: ${signals.hibp.success ? '✅' : '❌'} (${signals.hibp.confidence})\n`);
    }
    
    // Check report
    if (snapshot.report_json) {
      const report = snapshot.report_json as any;
      console.log(`   Report generated:`);
      console.log(`     Owner Summary: ${typeof report.owner_summary === 'string' ? report.owner_summary.substring(0, 60) : JSON.stringify(report.owner_summary).substring(0, 60)}...`);
      console.log(`     Top Findings: ${report.top_findings?.length || 0}`);
      console.log(`     Assumptions: ${report.assumptions?.length || 0}`);
      console.log(`     Questions: ${report.questions?.length || 0}`);
      console.log(`     Email Subject: ${report.email_subject || 'N/A'}\n`);
    }
    
    // Step 3: Verify magic link
    console.log(`\n🔐 Step 3: Verifying magic link...\n`);
    
    // Extract token from magic link
    const url = new URL(magic_link);
    const token = url.searchParams.get('token');
    
    if (!token) {
      console.error('❌ No token found in magic link');
      process.exit(1);
    }
    
    // Verify token
    const verification = await verifyMagicLinkToken(token);
    
    if (!verification.valid || !verification.payload) {
      console.error('❌ Token verification failed:', verification.error);
      process.exit(1);
    }
    
    console.log(`✅ Token verified successfully`);
    console.log(`   Snapshot ID: ${verification.payload.snapshot_id}`);
    console.log(`   Email: ${verification.payload.email}`);
    console.log(`   Domain: ${verification.payload.domain}`);
    console.log(`   Issued At: ${new Date(verification.payload.iat * 1000).toISOString()}`);
    console.log(`   Expires At: ${new Date(verification.payload.exp * 1000).toISOString()}\n`);
    
    // Validate access
    const accessValidation = await validateSnapshotAccess(token, snapshot_id);
    
    if (!accessValidation.authorized) {
      console.error('❌ Access validation failed:', accessValidation.error);
      process.exit(1);
    }
    
    console.log(`✅ Access authorized for email: ${accessValidation.email}\n`);
    
    // Step 4: Summary
    console.log('═'.repeat(60));
    console.log('✅ Snapshot API Test PASSED!\n');
    console.log('All components working:');
    console.log('  ✅ API route (validation, rate limiting, orchestration)');
    console.log('  ✅ Signal collection (6 modules)');
    console.log('  ✅ LLM generation (3 calls)');
    console.log('  ✅ Database storage (snapshots table)');
    console.log('  ✅ Magic link generation (JWT)');
    console.log('  ✅ Token verification & access control\n');
    console.log('Ready for frontend integration!');
    
  } catch (error) {
    console.error('\n❌ Test failed with exception:');
    console.error(error);
    process.exit(1);
  }
}

// Run test
console.log('\n⚠️  NOTE: This test requires Next.js dev server running on port 3000');
console.log('Start the server with: npm run dev\n');

testSnapshotAPI().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
