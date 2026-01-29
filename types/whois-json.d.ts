/**
 * Type declarations for whois-json
 * Package doesn't ship with TypeScript types
 */

declare module 'whois-json' {
  interface WhoisOptions {
    timeout?: number;
    follow?: number;
    [key: string]: any;
  }
  
  function whois(domain: string, options?: WhoisOptions): Promise<any>;
  export default whois;
}
