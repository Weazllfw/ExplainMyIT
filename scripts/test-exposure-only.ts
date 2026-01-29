#!/usr/bin/env tsx
import { collectExposureSignals } from '../lib/signals/exposure';

async function test() {
  console.log('Testing Exposure Signal Collection\n');
  
  const domains = ['github.com', 'cloudflare.com', 'google.com'];
  
  for (const domain of domains) {
    console.log(`\nTesting: ${domain}`);
    console.log('─'.repeat(60));
    
    const result = await collectExposureSignals(domain);
    
    console.log(`Success: ${result.success}`);
    console.log(`Confidence: ${result.confidence}`);
    console.log(`Reverse DNS: ${result.raw_signals.reverse_dns || 'None'}`);
    console.log(`Infrastructure: ${result.raw_signals.infrastructure_type}`);
    console.log(`Region: ${result.raw_signals.hosting_region || 'Unknown'}`);
    console.log(`Cloud Hosted: ${result.derived_flags.cloud_hosted}`);
  }
}

test().catch(console.error);
