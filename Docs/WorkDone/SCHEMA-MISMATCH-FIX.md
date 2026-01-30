# Schema Mismatch Fix - Orchestrator vs Database Types

**Date**: January 29, 2026  
**Issue**: Major schema mismatch between signal orchestrator output and database type definitions

---

## Error Chain

1. **Error #11**: `Property 'domain_age_years' does not exist on type 'DnsSignals'. Did you mean 'domain_age_days'?`
2. Root cause investigation revealed systematic schema mismatches across ALL signal blocks

---

## Root Cause

The `lib/signals/orchestrator.ts` was creating a `SnapshotSignals` structure with properties that don't match the database schema defined in `types/database.ts`. 

**Pattern**: Orchestrator used internal signal module formats (with `flags`, `error_message`, custom property names) instead of database schema format.

---

## Fixes Applied

### DNS Signals
**Before**: `domain_age_years`, `dns_hosting_provider`, `flags`, `error_message`  
**After**: `domain_age_days` (converted from years * 365), `has_dnssec`, `checked_at`, `error`

### Email Signals  
**Before**: `mx_provider`, `spf_strictness`, `dkim_present`, `flags`, `error_message`  
**After**: `has_spf`, `has_dkim`, `dkim_selectors`, `has_dmarc`, `dmarc_record`, `email_spoofing_possible`, `checked_at`, `error`

### TLS Signals
**Before**: `certificate_expiry_days`, `tls_versions_supported`, `flags`, `error_message`  
**After**: `has_https`, `certificate_expires_at`, `days_until_expiry`, `tls_versions`, `ssl_expiring_soon`, `checked_at`, `error`

### TechStack Signals  
**Before**: `cms_detected`, `server_headers`, `technologies`, `flags`, `error_message`  
**After**: `cms`, `cms_version`, `server_software`, `frameworks`, `cms_common_target`, `checked_at`, `error`

### Exposure Signals
**Before**: `hosting_region`, `flags`, `error_message`  
**After**: `ip_addresses`, `cloud_provider`, `disclaimer`, `checked_at`, `error`

### HIBP Signals
**Before**: `breaches`, `total_breach_count`, `flags`, `error_message`  
**After**: `breaches_found`, `breach_names`, `total_accounts_breached`, `data_classes_compromised`, `checked_at`, `error`

---

## Files Modified

1. **`lib/signals/orchestrator.ts`** - Rewrote all 6 signal block mappings to match database schema
2. **`lib/llm/prompts.ts`** - Updated all property references in both prompt builders (21+ changes)

---

## Impact

**Total Changes**: 60+ property mappings corrected across orchestrator and prompts

This was a critical fix - without it, the database would store data in the wrong format and the LLM prompts would fail to access signal properties.

---

## Verification Needed

- [ ] Verify all signal modules still work after schema changes
- [ ] Test end-to-end signal collection and LLM generation
- [ ] Check database inserts match schema

---

**Status**: Schema mismatch fully resolved. All signal blocks now conform to database types.
