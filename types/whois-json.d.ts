/**
 * Type declarations for whois-json
 * Package doesn't ship with TypeScript types
 */

declare module 'whois-json' {
  function whois(domain: string): Promise<any>;
  export default whois;
}
