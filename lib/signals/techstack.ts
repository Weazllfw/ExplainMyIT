/**
 * Tech Stack Detection Module
 * 
 * Collects technology stack signals for Block D.
 * Detects CMS, CDN, hosting provider, and server technologies.
 */

import https from 'https';
import type {
  TechStackBlockResult,
  TechStackRawSignals,
  TechStackDerivedFlags,
  Confidence
} from './types';

/**
 * Main tech stack detection function
 */
export async function collectTechStackSignals(domain: string): Promise<TechStackBlockResult> {
  const startTime = new Date().toISOString();
  
  try {
    // Normalize domain
    const normalizedDomain = normalizeDomain(domain);
    
    // Fetch homepage and headers
    const { html, headers } = await fetchHomepage(normalizedDomain);
    
    // Detect various technologies
    const cms = detectCMS(html, headers);
    const cdn = detectCDN(headers, html);
    const hosting = detectHostingProvider(headers, html);
    const serverHeaders = extractServerHeaders(headers);
    const technologies = detectTechnologies(html, headers);
    
    const rawSignals: TechStackRawSignals = {
      cms_detected: cms,
      cdn_provider: cdn,
      hosting_provider: hosting,
      server_headers: serverHeaders,
      technologies,
    };
    
    // Compute derived flags
    const derivedFlags = computeTechStackFlags(rawSignals);
    
    // Determine confidence
    const confidence = determineConfidence(rawSignals);
    
    return {
      block_name: 'techstack',
      success: true,
      confidence,
      raw_signals: rawSignals,
      derived_flags: derivedFlags,
      collected_at: startTime,
    };
    
  } catch (error) {
    console.error('Tech stack detection error:', error);
    
    return {
      block_name: 'techstack',
      success: false,
      confidence: 'low',
      raw_signals: getEmptyTechStackSignals(),
      derived_flags: getEmptyTechStackFlags(),
      error_message: error instanceof Error ? error.message : 'Unknown tech stack error',
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
 * Fetch homepage HTML and headers
 */
async function fetchHomepage(domain: string): Promise<{ html: string; headers: Record<string, string> }> {
  return new Promise((resolve, reject) => {
    const options = {
      host: domain,
      port: 443,
      method: 'GET',
      path: '/',
      timeout: 15000,
      headers: {
        'User-Agent': 'ExplainMyIT-Scanner/1.0',
      },
    };
    
    let resolved = false;
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
        // Limit HTML size to prevent memory issues (first 100KB is enough for detection)
        if (data.length > 100000 && !resolved) {
          resolved = true;
          const headers: Record<string, string> = {};
          Object.keys(res.headers).forEach(key => {
            const value = res.headers[key];
            headers[key] = Array.isArray(value) ? value.join(', ') : (value || '');
          });
          resolve({ html: data.substring(0, 100000), headers });
          req.destroy();
        }
      });
      
      res.on('end', () => {
        if (!resolved) {
          resolved = true;
          const headers: Record<string, string> = {};
          Object.keys(res.headers).forEach(key => {
            const value = res.headers[key];
            headers[key] = Array.isArray(value) ? value.join(', ') : (value || '');
          });
          resolve({ html: data.substring(0, 100000), headers });
        }
      });
    });
    
    req.on('error', (err) => {
      if (!resolved) {
        resolved = true;
        reject(err);
      }
    });
    
    req.on('timeout', () => {
      if (!resolved) {
        resolved = true;
        req.destroy();
        reject(new Error('Request timeout'));
      }
    });
    
    req.end();
  });
}

/**
 * Detect CMS from HTML and headers
 */
function detectCMS(html: string, headers: Record<string, string>): string | null {
  const htmlLower = html.toLowerCase();
  
  // WordPress
  if (htmlLower.includes('wp-content') || 
      htmlLower.includes('wp-includes') ||
      htmlLower.includes('wordpress')) {
    return 'WordPress';
  }
  
  // Drupal
  if (htmlLower.includes('drupal') || 
      headers['x-drupal-cache'] ||
      headers['x-generator']?.includes('Drupal')) {
    return 'Drupal';
  }
  
  // Joomla
  if (htmlLower.includes('joomla') ||
      htmlLower.includes('/components/com_')) {
    return 'Joomla';
  }
  
  // Shopify
  if (htmlLower.includes('shopify') ||
      htmlLower.includes('cdn.shopify.com') ||
      headers['x-shopify-stage']) {
    return 'Shopify';
  }
  
  // Wix
  if (htmlLower.includes('wix.com') ||
      htmlLower.includes('_wix')) {
    return 'Wix';
  }
  
  // Squarespace
  if (htmlLower.includes('squarespace') ||
      headers['x-squarespace-renderer-mode']) {
    return 'Squarespace';
  }
  
  // Webflow
  if (htmlLower.includes('webflow')) {
    return 'Webflow';
  }
  
  // Ghost
  if (htmlLower.includes('ghost') ||
      headers['x-powered-by']?.includes('Ghost')) {
    return 'Ghost';
  }
  
  // HubSpot
  if (htmlLower.includes('hubspot') ||
      htmlLower.includes('hs-scripts.com')) {
    return 'HubSpot CMS';
  }
  
  return null;
}

/**
 * Detect CDN provider
 */
function detectCDN(headers: Record<string, string>, html: string): string | null {
  // Check headers first (most reliable)
  if (headers['cf-ray'] || headers['server']?.includes('cloudflare')) {
    return 'Cloudflare';
  }
  
  if (headers['x-amz-cf-id'] || headers['x-amz-cf-pop']) {
    return 'Amazon CloudFront';
  }
  
  if (headers['x-cache']?.includes('akamai') || headers['akamai-x-cache-on']) {
    return 'Akamai';
  }
  
  if (headers['x-fastly-request-id'] || headers['fastly-io-info']) {
    return 'Fastly';
  }
  
  if (headers['x-cdn']?.includes('imperva') || headers['x-iinfo']) {
    return 'Imperva (Incapsula)';
  }
  
  if (headers['x-azure-ref']) {
    return 'Azure CDN';
  }
  
  if (headers['x-bunnycdn-cache-status']) {
    return 'BunnyCDN';
  }
  
  // Check HTML for CDN references
  const htmlLower = html.toLowerCase();
  
  if (htmlLower.includes('cloudflare')) {
    return 'Cloudflare';
  }
  
  if (htmlLower.includes('cloudfront.net')) {
    return 'Amazon CloudFront';
  }
  
  return null;
}

/**
 * Detect hosting provider (inferred from various signals)
 */
function detectHostingProvider(headers: Record<string, string>, html: string): string | null {
  const htmlLower = html.toLowerCase();
  
  // Check server header
  const server = headers['server']?.toLowerCase() || '';
  
  // Vercel
  if (server.includes('vercel') || headers['x-vercel-id']) {
    return 'Vercel';
  }
  
  // Netlify
  if (server.includes('netlify') || headers['x-nf-request-id']) {
    return 'Netlify';
  }
  
  // AWS
  if (headers['x-amz-request-id'] || htmlLower.includes('amazonaws.com')) {
    return 'Amazon AWS';
  }
  
  // Google Cloud
  if (server.includes('gfe') || headers['x-cloud-trace-context']) {
    return 'Google Cloud';
  }
  
  // Azure
  if (headers['x-azure-ref'] || server.includes('azure')) {
    return 'Microsoft Azure';
  }
  
  // Heroku
  if (headers['via']?.includes('heroku') || server.includes('heroku')) {
    return 'Heroku';
  }
  
  // DigitalOcean
  if (htmlLower.includes('digitalocean')) {
    return 'DigitalOcean';
  }
  
  // WP Engine
  if (headers['x-powered-by']?.includes('WP Engine') || server.includes('wpengine')) {
    return 'WP Engine';
  }
  
  // GoDaddy
  if (server.includes('godaddy') || htmlLower.includes('godaddy')) {
    return 'GoDaddy';
  }
  
  // Bluehost
  if (server.includes('bluehost') || htmlLower.includes('bluehost')) {
    return 'Bluehost';
  }
  
  return null;
}

/**
 * Extract relevant server headers
 */
function extractServerHeaders(headers: Record<string, string>): Record<string, string> {
  const relevantHeaders: Record<string, string> = {};
  
  const keysToExtract = [
    'server',
    'x-powered-by',
    'x-runtime',
    'x-version',
    'x-aspnet-version',
    'x-generator',
  ];
  
  keysToExtract.forEach(key => {
    if (headers[key]) {
      relevantHeaders[key] = headers[key];
    }
  });
  
  return relevantHeaders;
}

/**
 * Detect technologies from HTML and headers
 */
function detectTechnologies(html: string, headers: Record<string, string>): string[] {
  const technologies: Set<string> = new Set();
  const htmlLower = html.toLowerCase();
  
  // Web servers
  const server = headers['server']?.toLowerCase() || '';
  if (server.includes('nginx')) technologies.add('Nginx');
  if (server.includes('apache')) technologies.add('Apache');
  if (server.includes('iis')) technologies.add('IIS');
  if (server.includes('litespeed')) technologies.add('LiteSpeed');
  
  // Backend frameworks
  const poweredBy = headers['x-powered-by']?.toLowerCase() || '';
  if (poweredBy.includes('express')) technologies.add('Express.js');
  if (poweredBy.includes('asp.net')) technologies.add('ASP.NET');
  if (poweredBy.includes('php')) technologies.add('PHP');
  
  // Frontend frameworks (from HTML)
  if (htmlLower.includes('react')) technologies.add('React');
  if (htmlLower.includes('vue')) technologies.add('Vue.js');
  if (htmlLower.includes('angular')) technologies.add('Angular');
  if (htmlLower.includes('next')) technologies.add('Next.js');
  if (htmlLower.includes('gatsby')) technologies.add('Gatsby');
  
  // Analytics
  if (htmlLower.includes('google-analytics') || htmlLower.includes('gtag')) {
    technologies.add('Google Analytics');
  }
  
  // Common libraries
  if (htmlLower.includes('jquery')) technologies.add('jQuery');
  if (htmlLower.includes('bootstrap')) technologies.add('Bootstrap');
  if (htmlLower.includes('tailwind')) technologies.add('Tailwind CSS');
  
  return Array.from(technologies).sort();
}

/**
 * Compute derived flags from raw signals
 */
function computeTechStackFlags(signals: TechStackRawSignals): TechStackDerivedFlags {
  // Common CMS targets (WordPress, Joomla, Drupal)
  const cms_common_target = signals.cms_detected !== null && 
    ['WordPress', 'Joomla', 'Drupal'].includes(signals.cms_detected);
  
  // CDN present
  const cdn_present = signals.cdn_provider !== null;
  
  // Hosting identified
  const hosting_identified = signals.hosting_provider !== null;
  
  return {
    cms_common_target,
    cdn_present,
    hosting_identified,
  };
}

/**
 * Determine confidence level based on data quality
 */
function determineConfidence(signals: TechStackRawSignals): Confidence {
  let score = 0;
  let maxScore = 0;
  
  // CMS detection (30 points)
  maxScore += 30;
  if (signals.cms_detected !== null) score += 30;
  
  // CDN detection (25 points)
  maxScore += 25;
  if (signals.cdn_provider !== null) score += 25;
  
  // Hosting detection (25 points)
  maxScore += 25;
  if (signals.hosting_provider !== null) score += 25;
  
  // Technologies detected (20 points)
  maxScore += 20;
  if (signals.technologies.length > 0) score += 20;
  
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 70) return 'high';
  if (percentage >= 40) return 'medium';
  return 'low';
}

/**
 * Empty signals fallback
 */
function getEmptyTechStackSignals(): TechStackRawSignals {
  return {
    cms_detected: null,
    cdn_provider: null,
    hosting_provider: null,
    server_headers: {},
    technologies: [],
  };
}

/**
 * Empty flags fallback
 */
function getEmptyTechStackFlags(): TechStackDerivedFlags {
  return {
    cms_common_target: false,
    cdn_present: false,
    hosting_identified: false,
  };
}
