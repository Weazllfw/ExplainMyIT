# Module Declaration Fix - whois-json

**Date**: January 29, 2026  
**Issue**: Missing TypeScript declaration file for `whois-json` package

---

## Error

```
Type error: Could not find a declaration file for module 'whois-json'. 
'/vercel/path0/node_modules/whois-json/index.js' implicitly has an 'any' type.
```

**Location**: `lib/signals/dns.ts:10`

---

## Root Cause

The `whois-json` npm package does not ship with TypeScript type declarations (`.d.ts` files), and there are no community-provided types available at `@types/whois-json`.

TypeScript strict mode requires type declarations for all imported modules.

---

## Solution

Created a custom type declaration file for the package:

**File**: `types/whois-json.d.ts`

```typescript
declare module 'whois-json' {
  interface WhoisOptions {
    timeout?: number;
    follow?: number;
    [key: string]: any;
  }
  
  function whois(domain: string, options?: WhoisOptions): Promise<any>;
  export default whois;
}
```

### Updates

**Initial Fix**: Simple function signature with single `domain` parameter  
**Updated Fix**: Added optional `options` parameter with `WhoisOptions` interface to support timeout and other configuration

---

## Why This Works

1. **Module Declaration**: The `declare module` syntax tells TypeScript about the shape of the external module
2. **Location**: Files in the `types/` directory are automatically included in TypeScript compilation
3. **Optional Parameters**: The `options?: WhoisOptions` allows the function to be called with or without options
4. **Flexible Options Interface**: The index signature `[key: string]: any` allows any additional properties

---

## Alternative Considered

**Option 1**: Install `@types/whois-json`  
**Result**: Package doesn't exist in DefinitelyTyped

**Option 2**: Use `// @ts-ignore`  
**Downside**: Loses all type safety for that import

**Option 3**: Create declaration file ✅ (chosen)  
**Benefits**: Maintains type safety, documents the API

---

## Verification

- [x] Declaration file created
- [x] Module signature matches actual API
- [ ] Build verification

---

**Status**: Module declaration added. Build should succeed.
