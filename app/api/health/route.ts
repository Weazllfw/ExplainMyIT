/**
 * Health Check API Route
 * 
 * Diagnose environment variable and database connectivity issues
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    envVars: {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_KEY: {
        exists: !!process.env.SUPABASE_SERVICE_KEY,
        length: process.env.SUPABASE_SERVICE_KEY?.length || 0,
        startsWithEye: process.env.SUPABASE_SERVICE_KEY?.startsWith('eyJ') || false,
        preview: process.env.SUPABASE_SERVICE_KEY?.substring(0, 20) || 'undefined',
      },
      ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
      BREVO_API_KEY: !!process.env.BREVO_API_KEY,
      JWT_SECRET: !!process.env.JWT_SECRET,
      HIBP_API_KEY: !!process.env.HIBP_API_KEY,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'not set',
    },
  };

  return NextResponse.json(diagnostics);
}
