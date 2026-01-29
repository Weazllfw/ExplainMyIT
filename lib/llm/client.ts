/**
 * Anthropic Claude Client
 * 
 * Configured for Claude 3.5 Haiku (cost-optimized, fast, reliable JSON)
 */

import Anthropic from '@anthropic-ai/sdk';

/**
 * Get Anthropic API key (lazy evaluation)
 */
function getAnthropicKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error('Missing ANTHROPIC_API_KEY environment variable');
  }
  return key;
}

/**
 * Anthropic client (lazy initialization)
 */
let _anthropic: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({
      apiKey: getAnthropicKey(),
    });
  }
  return _anthropic;
}

/**
 * Model configuration
 */
export const LLM_CONFIG = {
  model: 'claude-haiku-4-5-20251001', // Claude 4.5 Haiku (fastest, cost-optimized)
  max_tokens: 4096, // Generous for JSON responses
  temperature: 0.3, // Low for consistency, not zero (allows some natural variation)
} as const;

/**
 * Call Claude with prompt and parse JSON response
 */
export async function callClaude(
  prompt: string,
  options?: {
    max_tokens?: number;
    temperature?: number;
  }
): Promise<string> {
  const anthropic = getAnthropic();
  
  const response = await anthropic.messages.create({
    model: LLM_CONFIG.model,
    max_tokens: options?.max_tokens || LLM_CONFIG.max_tokens,
    temperature: options?.temperature ?? LLM_CONFIG.temperature,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Extract text from response
  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  return content.text;
}

/**
 * Call Claude and parse JSON response with validation
 */
export async function callClaudeJSON<T = any>(
  prompt: string,
  options?: {
    max_tokens?: number;
    temperature?: number;
    retries?: number;
  }
): Promise<{ success: boolean; data?: T; error?: string; raw?: string }> {
  const maxRetries = options?.retries ?? 1; // Default 1 retry
  let lastError = '';

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const raw = await callClaude(prompt, options);

      // Strip markdown code fences if present (Claude often wraps JSON in ```json ... ```)
      let cleanedJson = raw.trim();
      if (cleanedJson.startsWith('```json')) {
        cleanedJson = cleanedJson.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
      } else if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');
      }

      // Try to parse JSON
      const parsed = JSON.parse(cleanedJson);

      // Check if LLM returned error signal
      if (parsed.error) {
        lastError = `LLM returned error: ${parsed.error}`;
        if (attempt < maxRetries) {
          console.warn(`LLM attempt ${attempt + 1} failed, retrying...`);
          continue;
        }
      }

      return {
        success: true,
        data: parsed as T,
        raw,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      console.error(`LLM attempt ${attempt + 1} failed:`, lastError);

      if (attempt < maxRetries) {
        // Wait briefly before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
    }
  }

  // All retries exhausted
  return {
    success: false,
    error: lastError,
  };
}
