/**
 * Database Setup Script
 * 
 * This script helps set up the Supabase database for Tier 1.
 * 
 * Usage:
 *   npm run setup-db
 * 
 * What it does:
 *   1. Tests connection to Supabase
 *   2. Provides instructions for running the schema
 *   3. Verifies tables are created
 *   4. Runs basic health checks
 */

import { supabase, supabaseAdmin, healthCheck, testConnection } from '../lib/db/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const SCHEMA_PATH = join(__dirname, '..', 'lib', 'db', 'schema.sql');

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║           Explain My IT - Database Setup                      ║');
  console.log('║                    Tier 1 Schema                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  
  // Step 1: Check environment variables
  console.log('Step 1: Checking environment variables...');
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_KEY',
  ];
  
  const missingVars = requiredEnvVars.filter(v => !process.env[v]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(v => console.error(`   - ${v}`));
    console.error('\nPlease set these in .env.local and try again.');
    process.exit(1);
  }
  
  console.log('✅ All environment variables are set\n');
  
  // Step 2: Test connection
  console.log('Step 2: Testing database connection...');
  
  const health = await healthCheck();
  
  if (!health.connected) {
    console.error('❌ Cannot connect to database:', health.error);
    console.error('\nPlease check your Supabase URL and keys.');
    process.exit(1);
  }
  
  console.log(`✅ Connected to database (latency: ${health.latency}ms)\n`);
  
  // Step 3: Check if schema is already applied
  console.log('Step 3: Checking if schema is applied...');
  
  const { data: schemaVersion, error: versionError } = await supabaseAdmin!
    .from('schema_version')
    .select('*')
    .order('version', { ascending: false })
    .limit(1)
    .single();
  
  if (schemaVersion) {
    console.log(`✅ Schema version ${schemaVersion.version} is applied`);
    console.log(`   ${schemaVersion.description}`);
    console.log(`   Applied at: ${new Date(schemaVersion.applied_at).toLocaleString()}\n`);
    
    // Verify tables exist
    const tables = ['users', 'snapshots', 'rate_limits', 'hibp_cache'];
    console.log('Verifying tables...');
    
    for (const table of tables) {
      const { error } = await supabaseAdmin!
        .from(table as any)
        .select('count')
        .limit(1);
      
      if (error) {
        console.error(`❌ Table '${table}' not found or inaccessible`);
      } else {
        console.log(`✅ Table '${table}' exists`);
      }
    }
    
    console.log('\n✨ Database is ready to use!\n');
    
    // Show next steps
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('Next steps:');
    console.log('  1. Start building signal modules (lib/signals/)');
    console.log('  2. Test with: npm run dev');
    console.log('  3. See: Docs/dev/Tier1-Implementation-Plan.md');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    return;
  }
  
  // Schema not applied yet - provide instructions
  console.log('⚠️  Schema is not applied yet\n');
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('To apply the schema:');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log('Option 1: Using Supabase Dashboard (Recommended)');
  console.log('  1. Go to: https://supabase.com/dashboard');
  console.log('  2. Select your project');
  console.log('  3. Go to: SQL Editor');
  console.log('  4. Click: New Query');
  console.log('  5. Copy and paste the contents of: lib/db/schema.sql');
  console.log('  6. Click: Run');
  console.log('  7. Wait for completion (should take ~5 seconds)\n');
  
  console.log('Option 2: Using Supabase CLI');
  console.log('  1. Install CLI: npm install -g supabase');
  console.log('  2. Login: supabase login');
  console.log('  3. Link project: supabase link --project-ref YOUR_PROJECT_ID');
  console.log('  4. Run migration: supabase db push --include-all\n');
  
  console.log('Schema file location:');
  console.log(`  ${SCHEMA_PATH}\n`);
  
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log('After applying the schema, run this script again to verify.');
  console.log('Command: npm run setup-db\n');
}

main().catch((error) => {
  console.error('\n❌ Setup failed:', error);
  process.exit(1);
});
