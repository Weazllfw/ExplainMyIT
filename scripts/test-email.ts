#!/usr/bin/env tsx
/**
 * Email Integration Test Script
 * 
 * Tests email sending via Brevo
 */

// Load environment variables
import { config } from 'dotenv';
config({ path: '.env.local' });

import { sendSnapshotEmail, sendWelcomeEmail } from '../lib/email/snapshot-email';
import { sendEmail } from '../lib/email/brevo-client';

async function testEmailIntegration() {
  console.log('🧪 Testing Email Integration\n');
  console.log('═'.repeat(60));
  
  const testEmail = process.env.TEST_EMAIL || 'test@example.com';
  
  if (testEmail === 'test@example.com') {
    console.warn('\n⚠️  Using default test email. Set TEST_EMAIL in .env.local for real testing\n');
  }
  
  try {
    // Test 1: Basic email sending
    console.log('\n📧 Test 1: Basic Email Send\n');
    
    const basicResult = await sendEmail({
      to: [{ email: testEmail, name: 'Test User' }],
      subject: 'Test Email from Explain My IT',
      textContent: 'This is a test email. If you received this, the integration is working!',
      htmlContent: '<p>This is a test email. If you received this, the integration is working!</p>',
      tags: ['test'],
    });
    
    if (basicResult.success) {
      console.log(`✅ Basic email sent successfully!`);
    } else {
      console.error(`❌ Basic email failed: ${basicResult.error}`);
    }
    
    // Test 2: Snapshot report email
    console.log('\n📧 Test 2: Snapshot Report Email\n');
    
    const snapshotResult = await sendSnapshotEmail(
      testEmail,
      'example.com',
      'Your IT Reality Check for example.com',
      `Hi there,

We've completed a public-signals snapshot of example.com. This is a one-time check based on what's observable from outside your network—think of it as an external perspective on how your IT setup appears to the internet.

Here's what we found:

Your domain and website have been operational for several years and use standard hosting infrastructure. Email authentication is partially configured, with basic protections in place but missing the final enforcement layer that prevents impersonation.

A few things worth noting:

• Email impersonation risk is present due to missing DMARC enforcement
• Website maintenance responsibility may not be clearly documented  
• Your domain age (5+ years) is a positive trust signal

You can see the full breakdown, assumptions being made, and suggested questions for your IT team here:
https://explainmyit.com/report/test-12345?token=test-token

If you'd like this kind of clarity on a recurring basis, we offer subscriptions that re-run snapshots automatically and highlight what changed over time.

Thanks for using Explain My IT.`,
      'https://explainmyit.com/report/test-12345?token=test-token'
    );
    
    if (snapshotResult.success) {
      console.log(`✅ Snapshot email sent successfully!`);
    } else {
      console.error(`❌ Snapshot email failed: ${snapshotResult.error}`);
    }
    
    // Test 3: Welcome email
    console.log('\n📧 Test 3: Welcome Email\n');
    
    const welcomeResult = await sendWelcomeEmail(testEmail, 'Test User');
    
    if (welcomeResult.success) {
      console.log(`✅ Welcome email sent successfully!`);
    } else {
      console.error(`❌ Welcome email failed: ${welcomeResult.error}`);
    }
    
    // Summary
    console.log('\n═'.repeat(60));
    console.log('📊 Test Summary\n');
    
    const tests = [
      { name: 'Basic Email', result: basicResult },
      { name: 'Snapshot Email', result: snapshotResult },
      { name: 'Welcome Email', result: welcomeResult },
    ];
    
    const passed = tests.filter(t => t.result.success).length;
    const failed = tests.filter(t => !t.result.success).length;
    
    console.log(`   Passed: ${passed}/3`);
    console.log(`   Failed: ${failed}/3\n`);
    
    if (failed === 0) {
      console.log('✅ All email tests PASSED!\n');
      console.log(`Check your inbox at ${testEmail}`);
    } else {
      console.log('❌ Some tests FAILED\n');
      tests.filter(t => !t.result.success).forEach(t => {
        console.log(`   - ${t.name}: ${t.result.error}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ Test failed with exception:');
    console.error(error);
    process.exit(1);
  }
}

// Check for required env vars
if (!process.env.BREVO_API_KEY) {
  console.error('❌ BREVO_API_KEY not configured in .env.local');
  console.log('\nAdd to .env.local:');
  console.log('BREVO_API_KEY=your-brevo-api-key\n');
  process.exit(1);
}

console.log('\n💡 TIP: Set TEST_EMAIL=your-email@domain.com in .env.local to test with your own email\n');

// Run test
testEmailIntegration().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
