# Component Integration Guide

**How to add the new components to the report page**

---

## 🎯 Components to Add

1. **ExecutiveSummary** - At the top of the report (after header)
2. **TechnicalDataViewer** - At the bottom of the report (after Q&A, before footer)

---

## 📝 Integration Steps

### **File to Modify**: `app/report/[id]/page.tsx`

### **Step 1: Add Imports**

```typescript
// At the top of the file, add these imports:
import { ExecutiveSummary } from '@/components/report/ExecutiveSummary';
import { TechnicalDataViewer } from '@/components/report/TechnicalDataViewer';
```

### **Step 2: Add ExecutiveSummary** (After ReportHeader)

Find this section:
```typescript
<main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
  {/* Owner Summary */}
  <OwnerSummary summary={report.owner_summary} />
```

**Add BEFORE OwnerSummary**:
```typescript
<main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
  {/* Executive Summary - NEW! */}
  <ExecutiveSummary report={report} domain={snapshot.domain} />

  {/* Owner Summary */}
  <OwnerSummary summary={report.owner_summary} />
```

### **Step 3: Add TechnicalDataViewer** (After Questions, Before Footer Actions)

Find this section:
```typescript
  {/* Questions */}
  {report.questions && report.questions.length > 0 && (
    <Questions questions={report.questions} />
  )}

  {/* Footer Actions - Smart CTA based on auth state */}
  <ReportFooterActions
```

**Add BETWEEN Questions and Footer Actions**:
```typescript
  {/* Questions */}
  {report.questions && report.questions.length > 0 && (
    <Questions questions={report.questions} />
  )}

  {/* Technical Data Viewer - NEW! */}
  {snapshot.signals_json && (
    <TechnicalDataViewer
      signals={snapshot.signals_json as any}
      domain={snapshot.domain}
    />
  )}

  {/* Footer Actions - Smart CTA based on auth state */}
  <ReportFooterActions
```

---

## ✅ Complete Modified Section

Here's what your `<main>` section should look like:

```typescript
<main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
  {/* Executive Summary - NEW! */}
  <ExecutiveSummary report={report} domain={snapshot.domain} />

  {/* Owner Summary */}
  <OwnerSummary summary={report.owner_summary} />

  {/* Top Findings */}
  {report.top_findings && report.top_findings.length > 0 && (
    <TopFindings findings={report.top_findings} />
  )}

  {/* Block Narratives */}
  {report.block_narratives && (
    <BlockNarratives narratives={report.block_narratives} />
  )}

  {/* Assumptions */}
  {report.assumptions && report.assumptions.length > 0 && (
    <Assumptions assumptions={report.assumptions} />
  )}

  {/* Questions */}
  {report.questions && report.questions.length > 0 && (
    <Questions questions={report.questions} />
  )}

  {/* Technical Data Viewer - NEW! */}
  {snapshot.signals_json && (
    <TechnicalDataViewer
      signals={snapshot.signals_json as any}
      domain={snapshot.domain}
    />
  )}

  {/* Footer Actions - Smart CTA based on auth state */}
  <ReportFooterActions 
    snapshotId={snapshot.id}
    domain={snapshot.domain}
    isOwnedByUser={!!snapshot.user_id}
  />
</main>
```

---

## 🎨 Visual Order

After integration, reports will flow like this:

1. **ReportHeader** (existing)
2. **ExecutiveSummary** ⭐ NEW - Health score + quick stats
3. **OwnerSummary** (existing)
4. **TopFindings** (existing)
5. **BlockNarratives** (existing)
6. **Assumptions** (existing)
7. **Questions** (existing)
8. **TechnicalDataViewer** ⭐ NEW - Collapsible raw data
9. **ReportFooterActions** (existing)
10. **Footer** (existing)

---

## 🧪 Testing After Integration

### **Test 1: Executive Summary**
- [ ] Health score displays (0-100 with colored ring)
- [ ] Critical/Attention/Good counts are correct
- [ ] Top 3 recommendations display
- [ ] Matches report findings

### **Test 2: Technical Data Viewer**
- [ ] "Show Technical Data" button appears
- [ ] Clicking reveals block selector
- [ ] Each block (DNS, Email, TLS, etc.) shows data
- [ ] New signals appear (security_headers, deliverability_score)
- [ ] JSON formatting is readable
- [ ] "Hide Data" button works

### **Test 3: Mobile**
- [ ] Executive Summary stacks properly
- [ ] Health score ring scales
- [ ] Technical Data Viewer is touch-friendly
- [ ] Block selector wraps on small screens

---

## 🐛 Troubleshooting

### **Issue**: "Cannot find module '@/components/report/ExecutiveSummary'"
**Fix**: Make sure you saved the files in the correct location:
- `components/report/ExecutiveSummary.tsx`
- `components/report/TechnicalDataViewer.tsx`

### **Issue**: "Type 'unknown' is not assignable to type 'SnapshotSignals'"
**Fix**: Use type assertion:
```typescript
signals={snapshot.signals_json as any}
```

### **Issue**: Executive Summary health score is always 75
**Fix**: This is expected for initial testing. The score will vary once LLM generates reports with the new signals.

### **Issue**: Technical Data Viewer shows undefined signals
**Fix**: Old snapshots don't have new signals. Request a fresh snapshot to see:
- `security_headers` in TLS block
- `deliverability_score` in Email block
- `subdomains` block (if API key configured)

---

## 📸 Expected Visual

### **Executive Summary**:
```
┌────────────────────────────────────────────┐
│ IT Snapshot Summary         [Health: 78]  │
│ example.com · Jan 30, 2026                 │
│                                            │
│ ┌─────┐  ┌───────┐  ┌────┐               │
│ │  1  │  │   2   │  │ 5  │               │
│ │Crit.│  │Needs  │  │Good│               │
│ └─────┘  └───────┘  └────┘               │
│                                            │
│ Top Recommendations:                       │
│ ① Add DMARC record (15 min)              │
│ ② Enable HSTS header (5 min)             │
│ ③ Renew SSL in next 30 days              │
└────────────────────────────────────────────┘
```

### **Technical Data Viewer (Collapsed)**:
```
┌────────────────────────────────────────────┐
│ Technical Data                             │
│ View raw signals for example.com           │
│                        [Show Data]         │
└────────────────────────────────────────────┘
```

### **Technical Data Viewer (Expanded)**:
```
┌────────────────────────────────────────────┐
│ Technical Data         [Hide Data]         │
│ Raw signals collected Jan 30, 2026         │
│                                            │
│ [🌐 DNS] [📧 Email] [🔒 TLS]             │
│ [⚙️ Tech] [🔍 Expo]  [🛡️ HIBP]          │
│                                            │
│ ┌──────────────────────────────────────┐ │
│ │ Email Auth Data                      │ │
│ │                                      │ │
│ │ Confidence: HIGH                     │ │
│ │                                      │ │
│ │ Raw Signals:                         │ │
│ │ {                                    │ │
│ │   "mx_provider": "Google Workspace",│ │
│ │   "deliverability_score": 85,       │ │
│ │   "blacklist_status": "clean",      │ │
│ │   ...                                │ │
│ │ }                                    │ │
│ └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

---

## 🚀 Ready to Integrate!

**Time**: ~5 minutes  
**Risk**: Low (components are self-contained)  
**Impact**: High (massive UX improvement)

After integration, commit with:
```bash
git add app/report/[id]/page.tsx
git commit -m "UI: Add Executive Summary and Technical Data Viewer

- ExecutiveSummary at top: Health score + quick stats + recommendations
- TechnicalDataViewer at bottom: Collapsible raw signal data for power users"
```

---

**Let me know when you're ready and I'll update the report page for you!** 🎯
