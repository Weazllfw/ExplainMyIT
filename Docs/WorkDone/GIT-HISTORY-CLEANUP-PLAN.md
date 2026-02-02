# Git History Cleanup Plan

## Problem
GitHub push protection detected API keys in `.env.local.example` file in the commit history.
Even though the file was deleted in commit e35b475, GitHub scans all 92 commits being pushed.

## Commits with the problematic file:
- e35b475: Removed the file (most recent)
- 23f287a: File exists
- 24d1d64: File exists  
- 18a7ee0: File exists
- 1c98e04: File exists (first commit)

## Solution Strategy

### Step 1: Create Safety Backup
Create a backup branch before any destructive operations.

### Step 2: Remove from History
Use git filter-branch to remove `.env.local.example` from all commits.

### Step 3: Force Push
After cleaning history, force push to origin.

### Step 4: Verify
Confirm the file no longer appears in any commit.

## Commands to Execute

```bash
# 1. Create backup
git branch backup-before-cleanup

# 2. Remove file from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch '.env.local.example'" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Clean up refs
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. Force push (requires careful verification first)
git push origin main --force
```

## Current State
- Branch: main
- Commits ahead: 92
- Staged changes: .env.local.example deletion + 3 new docs
- Dev branch: needs checking

## Risk Mitigation
✓ Backup branch created before cleanup
✓ Dev branch preserved
✓ Only affecting main branch
✓ Can abort if anything goes wrong
