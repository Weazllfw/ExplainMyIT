#!/usr/bin/env tsx
/**
 * Signal Collection Test Script
 * 
 * Tests individual signal modules to verify they work correctly.
 * Run: npm run test-signals
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

import { collectDnsSignals } from '../lib/signals/dns';
import { collectEmailSignals } from '../lib/signals/email';
import { collectTlsSignals } from '../lib/signals/tls';
import { collectTechStackSignals } from '../lib/signals/techstack';
import { collectExposureSignals } from '../lib/signals/exposure';
import { collectHibpSignals } from '../lib/signals/hibp';
import { collectAllSignals } from '../lib/signals/orchestrator';

/**
 * Test DNS signal collection
 */
async function testDnsSignals() {
  console.log('\n🧪 Testing DNS Signal Collection...\n');
  
  const testDomains = [
    'google.com',        // Well-established domain
    'cloudflare.com',    // DNS provider
    'github.com',        // Tech company
  ];
  
  for (const domain of testDomains) {
    console.log(`\n📡 Testing: ${domain}`);
    console.log('─'.repeat(60));
    
    try {
      const result = await collectDnsSignals(domain);
      
      if (result.success) {
        console.log('✅ Success!');
        console.log(`Confidence: ${result.confidence}`);
        console.log('\nRaw Signals:');
        console.log(`  Domain Age: ${result.raw_signals.domain_age_years} years`);
        console.log(`  Registrar: ${result.raw_signals.registrar}`);
        console.log(`  Nameservers: ${result.raw_signals.nameservers.length} found`);
        result.raw_signals.nameservers.forEach(ns => {
          console.log(`    - ${ns}`);
        });
        console.log(`  A Records: ${result.raw_signals.a_records.length} found`);
        result.raw_signals.a_records.forEach(ip => {
          console.log(`    - ${ip}`);
        });
        console.log(`  MX Records: ${result.raw_signals.mx_records.length} found`);
        result.raw_signals.mx_records.slice(0, 3).forEach(mx => {
          console.log(`    - ${mx}`);
        });
        console.log(`  DNS Provider: ${result.raw_signals.dns_hosting_provider}`);
        
        console.log('\nDerived Flags:');
        console.log(`  Domain Age Low: ${result.derived_flags.domain_age_low}`);
        console.log(`  Third-Party DNS: ${result.derived_flags.dns_provider_third_party}`);
        console.log(`  Single DNS Dependency: ${result.derived_flags.single_point_dns_dependency}`);
      } else {
        console.log('❌ Failed!');
        console.log(`Error: ${result.error_message}`);
      }
    } catch (error) {
      console.log('❌ Exception!');
      console.error(error);
    }
  }
}

/**
 * Test Email Auth signal collection
 */
async function testEmailSignals() {
  console.log('\n🧪 Testing Email Auth Signal Collection...\n');
  
  const testDomains = [
    'google.com',        // Google Workspace with strong protection
    'github.com',        // Google Workspace backend
    'cloudflare.com',    // Strong email security
  ];
  
  for (const domain of testDomains) {
    console.log(`\n📧 Testing: ${domain}`);
    console.log('─'.repeat(60));
    
    try {
      const result = await collectEmailSignals(domain);
      
      if (result.success) {
        console.log('✅ Success!');
        console.log(`Confidence: ${result.confidence}`);
        console.log('\nRaw Signals:');
        console.log(`  MX Provider: ${result.raw_signals.mx_provider}`);
        console.log(`  SPF Record: ${result.raw_signals.spf_record ? 'Present' : 'Missing'}`);
        if (result.raw_signals.spf_record) {
          console.log(`    Strictness: ${result.raw_signals.spf_strictness}`);
        }
        console.log(`  DKIM Present: ${result.raw_signals.dkim_present ? 'Yes' : 'No (or custom selector)'}`);
        console.log(`  DMARC Policy: ${result.raw_signals.dmarc_policy}`);
        
        console.log('\nDerived Flags:');
        console.log(`  Email Spoofing Possible: ${result.derived_flags.email_spoofing_possible ? '⚠️  YES' : '✅ No'}`);
        console.log(`  Email Protection Partial: ${result.derived_flags.email_protection_partial ? '⚠️  YES' : 'No'}`);
        console.log(`  Email Protection Strong: ${result.derived_flags.email_protection_strong ? '✅ YES' : 'No'}`);
      } else {
        console.log('❌ Failed!');
        console.log(`Error: ${result.error_message}`);
      }
    } catch (error) {
      console.log('❌ Exception!');
      console.error(error);
    }
  }
}

/**
 * Test TLS/SSL signal collection
 */
async function testTlsSignals() {
  console.log('\n🧪 Testing TLS/SSL Signal Collection...\n');
  
  const testDomains = [
    'google.com',        // Modern HTTPS setup
    'github.com',        // Strong TLS
    'cloudflare.com',    // Security-focused
  ];
  
  for (const domain of testDomains) {
    console.log(`\n🔒 Testing: ${domain}`);
    console.log('─'.repeat(60));
    
    try {
      const result = await collectTlsSignals(domain);
      
      if (result.success) {
        console.log('✅ Success!');
        console.log(`Confidence: ${result.confidence}`);
        console.log('\nRaw Signals:');
        console.log(`  HTTPS Enforced: ${result.raw_signals.https_enforced ? '✅ Yes' : '⚠️  No'}`);
        console.log(`  Certificate Valid: ${result.raw_signals.certificate_valid ? '✅ Yes' : '❌ No'}`);
        console.log(`  Certificate Issuer: ${result.raw_signals.certificate_issuer || 'Unknown'}`);
        
        if (result.raw_signals.certificate_expiry_days !== null) {
          const days = result.raw_signals.certificate_expiry_days;
          const expiryStatus = days < 30 ? '⚠️ ' : days < 90 ? '⚡' : '✅';
          console.log(`  Certificate Expiry: ${expiryStatus} ${days} days`);
        } else {
          console.log(`  Certificate Expiry: Unknown`);
        }
        
        if (result.raw_signals.tls_versions_supported.length > 0) {
          console.log(`  TLS Versions: ${result.raw_signals.tls_versions_supported.join(', ')}`);
        } else {
          console.log(`  TLS Versions: Unknown`);
        }
        
        console.log('\nDerived Flags:');
        console.log(`  SSL Expiring Soon: ${result.derived_flags.ssl_expiring_soon ? '⚠️  YES' : '✅ No'}`);
        console.log(`  Legacy TLS Supported: ${result.derived_flags.legacy_tls_supported ? '⚠️  YES' : '✅ No'}`);
        console.log(`  No HTTPS Redirect: ${result.derived_flags.no_https_redirect ? '⚠️  YES' : '✅ No'}`);
      } else {
        console.log('❌ Failed!');
        console.log(`Error: ${result.error_message}`);
      }
    } catch (error) {
      console.log('❌ Exception!');
      console.error(error);
    }
  }
}

/**
 * Test Tech Stack signal collection
 */
async function testTechStackSignals() {
  console.log('\n🧪 Testing Tech Stack Detection...\n');
  
  const testDomains = [
    'github.com',        // Modern tech stack
    'cloudflare.com',    // Cloudflare
    'google.com',        // Google
  ];
  
  for (const domain of testDomains) {
    console.log(`\n🔧 Testing: ${domain}`);
    console.log('─'.repeat(60));
    
    try {
      const result = await collectTechStackSignals(domain);
      
      if (result.success) {
        console.log('✅ Success!');
        console.log(`Confidence: ${result.confidence}`);
        console.log('\nRaw Signals:');
        console.log(`  CMS Detected: ${result.raw_signals.cms_detected || 'None'}`);
        console.log(`  CDN Provider: ${result.raw_signals.cdn_provider || 'None'}`);
        console.log(`  Hosting Provider: ${result.raw_signals.hosting_provider || 'Unknown'}`);
        
        if (Object.keys(result.raw_signals.server_headers).length > 0) {
          console.log(`  Server Headers:`);
          Object.entries(result.raw_signals.server_headers).forEach(([key, value]) => {
            console.log(`    ${key}: ${value}`);
          });
        }
        
        if (result.raw_signals.technologies.length > 0) {
          console.log(`  Technologies: ${result.raw_signals.technologies.join(', ')}`);
        }
        
        console.log('\nDerived Flags:');
        console.log(`  Common CMS Target: ${result.derived_flags.cms_common_target ? '⚠️  YES (WordPress/Joomla/Drupal)' : '✅ No'}`);
        console.log(`  CDN Present: ${result.derived_flags.cdn_present ? '✅ YES' : 'No'}`);
        console.log(`  Hosting Identified: ${result.derived_flags.hosting_identified ? '✅ YES' : 'No'}`);
      } else {
        console.log('❌ Failed!');
        console.log(`Error: ${result.error_message}`);
      }
    } catch (error) {
      console.log('❌ Exception!');
      console.error(error);
    }
  }
}

/**
 * Test Public Exposure signal collection
 */
async function testExposureSignals() {
  console.log('\n🧪 Testing Public Exposure Signal Collection...\n');
  
  const testDomains = [
    'github.com',        // Cloud infrastructure
    'cloudflare.com',    // Cloud infrastructure
    'google.com',        // Google infrastructure
  ];
  
  for (const domain of testDomains) {
    console.log(`\n🌍 Testing: ${domain}`);
    console.log('─'.repeat(60));
    
    try {
      const result = await collectExposureSignals(domain);
      
      if (result.success) {
        console.log('✅ Success!');
        console.log(`Confidence: ${result.confidence} (intentionally low - inference-based)`);
        console.log('\nRaw Signals:');
        console.log(`  Reverse DNS: ${result.raw_signals.reverse_dns || 'Not configured'}`);
        console.log(`  IP Geolocation: ${result.raw_signals.ip_geolocation || 'Unknown'}`);
        console.log(`  Infrastructure Type: ${result.raw_signals.infrastructure_type}`);
        console.log(`  Hosting Region: ${result.raw_signals.hosting_region || 'Unknown'}`);
        
        console.log('\nDerived Flags:');
        console.log(`  Cloud Hosted: ${result.derived_flags.cloud_hosted ? '✅ YES' : 'No (or unknown)'}`);
        console.log(`  Infrastructure Identifiable: ${result.derived_flags.infrastructure_identifiable ? '✅ YES' : 'No'}`);
        
        console.log('\n  ℹ️  Note: This module uses passive DNS lookups only (no scanning)');
      } else {
        console.log('❌ Failed!');
        console.log(`Error: ${result.error_message}`);
      }
    } catch (error) {
      console.log('❌ Exception!');
      console.error(error);
    }
  }
}

/**
 * Test HIBP signal collection
 */
async function testHibpSignals() {
  console.log('\n🧪 Testing HIBP Breach Detection...\n');
  
  const testDomains = [
    'adobe.com',         // Known major breach
    'google.com',        // Likely no direct breaches
    'linkedin.com',      // Known breach
  ];
  
  for (const domain of testDomains) {
    console.log(`\n🔍 Testing: ${domain}`);
    console.log('─'.repeat(60));
    
    try {
      const result = await collectHibpSignals(domain);
      
      if (result.success) {
        console.log('✅ Success!');
        console.log(`Confidence: ${result.confidence}`);
        console.log('\nRaw Signals:');
        console.log(`  Total Breaches: ${result.raw_signals.total_breach_count}`);
        
        if (result.raw_signals.total_breach_count > 0) {
          console.log(`  Most Recent: ${result.raw_signals.most_recent_breach_date}`);
          console.log(`  Breaches (showing first 3):`);
          result.raw_signals.breaches.slice(0, 3).forEach(breach => {
            console.log(`    - ${breach.title} (${breach.breach_date})`);
            console.log(`      Data exposed: ${breach.data_classes.slice(0, 5).join(', ')}`);
          });
        } else {
          console.log(`  ✅ No known breaches found`);
        }
        
        console.log('\nDerived Flags:');
        console.log(`  Recent Breach (<12 months): ${result.derived_flags.recent_breach ? '⚠️  YES' : '✅ No'}`);
        console.log(`  Multiple Breaches: ${result.derived_flags.multiple_breaches ? '⚠️  YES' : '✅ No'}`);
        console.log(`  Credential Breach: ${result.derived_flags.credential_breach ? '⚠️  YES (passwords/emails)' : '✅ No'}`);
        
        console.log('\n  ℹ️  Note: HIBP results are cached for 30 days to reduce API costs');
      } else {
        console.log('❌ Failed!');
        console.log(`Error: ${result.error_message}`);
      }
    } catch (error) {
      console.log('❌ Exception!');
      console.error(error);
    }
  }
}

/**
 * Test full orchestrator (all modules in parallel)
 */
async function testOrchestrator() {
  console.log('\n🧪 Testing Signal Orchestrator (All Modules Parallel)...\n');
  
  const testDomain = 'github.com';
  
  console.log(`\n🎯 Full Collection Test: ${testDomain}`);
  console.log('═'.repeat(60));
  
  try {
    const signals = await collectAllSignals(testDomain);
    
    console.log('\n📊 Collection Summary:');
    console.log(`  Domain: ${signals.domain}`);
    console.log(`  Duration: ${(signals.collection_duration_ms / 1000).toFixed(2)}s`);
    console.log(`  Collected: ${signals.collected_at}`);
    
    console.log('\n  Module Success:');
    console.log(`    DNS: ${signals.dns?.error ? '❌' : '✅'} (${signals.dns?.confidence || 'N/A'})`);
    console.log(`    Email: ${signals.email?.error ? '❌' : '✅'} (${signals.email?.confidence || 'N/A'})`);
    console.log(`    TLS: ${signals.tls?.error ? '❌' : '✅'} (${signals.tls?.confidence || 'N/A'})`);
    console.log(`    Tech Stack: ${signals.techstack?.error ? '❌' : '✅'} (${signals.techstack?.confidence || 'N/A'})`);
    console.log(`    Exposure: ${signals.exposure?.error ? '❌' : '✅'} (${signals.exposure?.confidence || 'N/A'})`);
    console.log(`    HIBP: ${signals.hibp?.error ? '❌' : '✅'} (${signals.hibp?.confidence || 'N/A'})`);
    
    console.log('\n  Cross-Block Flags:');
    if (signals.cross_block_flags && signals.cross_block_flags.length > 0) {
      console.log(`    Active Flags: ${signals.cross_block_flags.join(', ')}`);
    } else {
      console.log(`    Active Flags: None`);
    }
    
    console.log('\n  ✅ Signal orchestration successful!');
    console.log('  ✅ All signals ready for LLM processing');
    
  } catch (error) {
    console.log('\n❌ Orchestrator failed!');
    console.error(error);
  }
}

/**
 * Main test runner
 */
async function main() {
  console.log('🚀 Signal Collection Test Suite');
  console.log('================================\n');
  
  try {
    // Test individual modules
    await testDnsSignals();
    await testEmailSignals();
    await testTlsSignals();
    await testTechStackSignals();
    await testExposureSignals();
    await testHibpSignals();
    
    // Test full orchestrator
    await testOrchestrator();
    
    console.log('\n\n✅ All tests completed!');
    console.log('\nNote: Some WHOIS lookups may fail due to rate limiting.');
    console.log('This is normal - the system handles these gracefully.\n');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run tests
main();
