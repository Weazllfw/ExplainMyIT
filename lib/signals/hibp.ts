/**
 * HIBP (Have I Been Pwned) Integration Module
 * 
 * Collects known breach data for Block F.
 * Uses HIBP API to check if domain has appeared in data breaches.
 * 
 * API: https://haveibeenpwned.com/API/v3
 * Tier: Pwned 1 (10 RPM, up to 25 breached email addresses per domain)
 */

import { getHibpCache, saveHibpCache } from '../db/cache';
import type {
  HibpBlockResult,
  HibpRawSignals,
  HibpDerivedFlags,
  Confidence
} from './types';
import type { HibpResults } from '@/types/database';

const HIBP_API_BASE = 'https://haveibeenpwned.com/api/v3';
const HIBP_API_KEY = process.env.HIBP_API_KEY;

interface HibpBreach {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  AddedDate: string;
  ModifiedDate: string;
  PwnCount: number;
  Description: string;
  DataClasses: string[];
  IsVerified: boolean;
  IsFabricated: boolean;
  IsSensitive: boolean;
  IsRetired: boolean;
  IsSpamList: boolean;
  LogoPath: string;
}

/**
 * Main HIBP signal collection function
 */
export async function collectHibpSignals(domain: string): Promise<HibpBlockResult> {
  const startTime = new Date().toISOString();
  
  // Check if API key is configured
  if (!HIBP_API_KEY) {
    return {
      block_name: 'hibp',
      success: false,
      confidence: 'low',
      raw_signals: getEmptyHibpSignals(),
      derived_flags: getEmptyHibpFlags(),
      error_message: 'HIBP API key not configured',
      collected_at: startTime,
    };
  }
  
  try {
    // Normalize domain
    const normalizedDomain = normalizeDomain(domain);
    
    // Check cache first (30-day TTL)
    const cached = await getHibpCache(normalizedDomain);
    
    if (cached.results) {
      console.log(`HIBP cache hit for ${normalizedDomain}`);
      
      // Reconstruct block result from cached data
      const cachedBreaches = cached.results.breaches;
      
      // Extract relevant breach data
      const breachData = cachedBreaches.map(b => ({
        name: b.Name,
        title: b.Title,
        breach_date: b.BreachDate,
        added_date: b.AddedDate,
        data_classes: b.DataClasses,
      }));
      
      // Find most recent breach
      const mostRecentBreachDate = cachedBreaches.length > 0
        ? cachedBreaches.reduce((latest, b) => {
            const date = new Date(b.BreachDate);
            return date > latest ? date : latest;
          }, new Date(cachedBreaches[0].BreachDate)).toISOString().split('T')[0]
        : null;
      
      const rawSignals: HibpRawSignals = {
        breaches: breachData,
        total_breach_count: cachedBreaches.length,
        most_recent_breach_date: mostRecentBreachDate,
      };
      
      const derivedFlags = computeHibpFlags(rawSignals);
      const confidence: Confidence = 'high';
      
      return {
        block_name: 'hibp',
        success: true,
        confidence,
        raw_signals: rawSignals,
        derived_flags: derivedFlags,
        collected_at: cached.results.fetched_at,
      };
    }
    
    // Fetch from API
    const breaches = await fetchBreachesForDomain(normalizedDomain);
    
    // Extract relevant breach data
    const breachData = breaches.map(b => ({
      name: b.Name,
      title: b.Title,
      breach_date: b.BreachDate,
      added_date: b.AddedDate,
      data_classes: b.DataClasses,
    }));
    
    // Find most recent breach
    const mostRecentBreachDate = breaches.length > 0
      ? breaches.reduce((latest, b) => {
          const date = new Date(b.BreachDate);
          return date > latest ? date : latest;
        }, new Date(breaches[0].BreachDate)).toISOString().split('T')[0]
      : null;
    
    const rawSignals: HibpRawSignals = {
      breaches: breachData,
      total_breach_count: breaches.length,
      most_recent_breach_date: mostRecentBreachDate,
    };
    
    // Compute derived flags
    const derivedFlags = computeHibpFlags(rawSignals);
    
    // Always high confidence (API is authoritative)
    const confidence: Confidence = 'high';
    
    const result: HibpBlockResult = {
      block_name: 'hibp',
      success: true,
      confidence,
      raw_signals: rawSignals,
      derived_flags: derivedFlags,
      collected_at: startTime,
    };
    
    // Cache the result (convert to HibpResults format for storage)
    const cacheData: HibpResults = {
      breaches: breaches, // Store raw API breaches for cache
      fetched_at: startTime,
    };
    await saveHibpCache(normalizedDomain, cacheData);
    
    return result;
    
  } catch (error) {
    console.error('HIBP collection error:', error);
    
    // Check if it's a rate limit or API error
    const errorMessage = error instanceof Error ? error.message : 'Unknown HIBP error';
    const isRateLimit = errorMessage.includes('429') || errorMessage.includes('rate limit');
    
    return {
      block_name: 'hibp',
      success: false,
      confidence: 'low',
      raw_signals: getEmptyHibpSignals(),
      derived_flags: getEmptyHibpFlags(),
      error_message: isRateLimit ? 'HIBP API rate limit reached' : errorMessage,
      collected_at: startTime,
    };
  }
}

/**
 * Normalize domain name
 */
function normalizeDomain(input: string): string {
  let domain = input.toLowerCase().trim();
  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.replace(/^www\./, '');
  domain = domain.split('/')[0];
  domain = domain.split('?')[0];
  domain = domain.split('#')[0];
  domain = domain.split(':')[0];
  return domain;
}

/**
 * Fetch breaches for domain from HIBP API
 */
async function fetchBreachesForDomain(domain: string): Promise<HibpBreach[]> {
  const url = `${HIBP_API_BASE}/breaches?domain=${encodeURIComponent(domain)}`;
  
  const response = await fetch(url, {
    headers: {
      'hibp-api-key': HIBP_API_KEY!,
      'user-agent': 'ExplainMyIT-Scanner/1.0',
    },
    signal: AbortSignal.timeout(10000), // 10 second timeout
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      // No breaches found (good news!)
      return [];
    }
    
    if (response.status === 429) {
      throw new Error('HIBP API rate limit exceeded (10 requests per minute)');
    }
    
    throw new Error(`HIBP API error: ${response.status} ${response.statusText}`);
  }
  
  const breaches: HibpBreach[] = await response.json();
  return breaches;
}

/**
 * Compute derived flags from raw signals
 */
function computeHibpFlags(signals: HibpRawSignals): HibpDerivedFlags {
  // Recent breach (within last 12 months)
  let recent_breach = false;
  if (signals.most_recent_breach_date) {
    const breachDate = new Date(signals.most_recent_breach_date);
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    recent_breach = breachDate > twelveMonthsAgo;
  }
  
  // Multiple breaches (2 or more)
  const multiple_breaches = signals.total_breach_count >= 2;
  
  // Credential breach (password or email exposed)
  const credential_breach = signals.breaches.some(breach =>
    breach.data_classes.some(dc =>
      dc.toLowerCase().includes('password') ||
      dc.toLowerCase().includes('email')
    )
  );
  
  return {
    recent_breach,
    multiple_breaches,
    credential_breach,
  };
}

/**
 * Empty signals fallback
 */
function getEmptyHibpSignals(): HibpRawSignals {
  return {
    breaches: [],
    total_breach_count: 0,
    most_recent_breach_date: null,
  };
}

/**
 * Empty flags fallback
 */
function getEmptyHibpFlags(): HibpDerivedFlags {
  return {
    recent_breach: false,
    multiple_breaches: false,
    credential_breach: false,
  };
}
