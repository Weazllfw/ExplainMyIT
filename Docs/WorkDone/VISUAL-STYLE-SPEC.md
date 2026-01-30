# Explain My IT — Visual Style Specification

**Status**: Cursor-Ready Reference  
**Last Updated**: January 29, 2026

---

## Brand Intent (1 sentence)

A calm, credible, owner-first dashboard/report product: **quiet confidence**, not "cybersecurity theatrics".

---

## Color Palette (Final)

### Core Colors

| Use Case | Color Name | Hex Value |
|----------|-----------|-----------|
| Authority / text / primary buttons | **Primary Navy** | `#1F3A5F` |
| Clarity / highlights / links | **Accent Cyan** | `#4FB6C6` |
| Secondary text | **Deep Slate** | `#445468` |

### Neutrals (UI Foundation)

| Use Case | Color Name | Hex Value |
|----------|-----------|-----------|
| Page background | Background | `#F6F8FB` |
| Cards | Surface | `#FFFFFF` |
| Border / divider | Border | `#E6ECF2` |
| Muted text | Muted | `#6B7C93` |

### State Colors (Subtle, Non-Alarming)

These are **"signals"**, not panic colors:

| Use Case | Color Name | Hex Value |
|----------|-----------|-----------|
| Positive / OK | Positive (use sparingly) | `#2E8B57` |
| Caution (not warning-red) | Caution | `#D6A545` (muted amber) |
| Info / neutral badge | Info | `#7A8CA6` |

### Usage Rules

- ✅ **Primary buttons**: Navy background + white text
- ✅ **Links + accents**: Cyan
- ❌ **Never use harsh red** for findings; reserve red only for true app errors (rare)

---

## Gradients & Effects (Minimal)

### Brand Gradient (Optional, only for hero sections)

```css
linear-gradient(135deg, #4FB6C6 0%, #1F3A5F 100%)
```

**Usage**: At 5–12% opacity as a background wash, not a loud banner.

### Shadows (Soft and Modern)

```css
/* Card shadow */
box-shadow: 0 6px 24px rgba(31, 58, 95, 0.08);

/* Hover shadow */
box-shadow: 0 10px 32px rgba(31, 58, 95, 0.12);
```

**Rule**: No heavy drop shadows.

---

## Typography

### Font Stack

**Preferred**: `Inter`

**Alternatives**: `DM Sans`, `Source Sans 3`

### Type Scale (Simple, Consistent)

| Element | Size | Weight |
|---------|------|--------|
| **H1** (page hero) | 40–48px | 700 |
| **H2** (section headers) | 24–28px | 700 |
| **H3** (card titles) | 16–18px | 700 |
| **Body** | 15–16px | 400–500 |
| **Small / caption** | 12–13px | 400 |

### Tone Rule

Copy should feel:
- ✅ **calm**
- ✅ **factual**
- ✅ **non-technical**
- ❌ **never "urgent"**

---

## Layout System

### Spacing

- **Grid**: 8px base
- **Section padding**: 64–96px vertical
- **Card padding**: 20–28px
- **Card gaps**: 16–24px

### Rounded Corners

- **Cards**: 14–16px
- **Buttons**: 10–12px
- **Inputs**: 10–12px

### Max Widths

- **Marketing content**: 1100–1200px
- **Dashboard**: 1200–1280px

---

## Iconography & Visual Language

### Style

- **Outline icons**, consistent stroke (2px)
- **Rounded corners**, minimal detail
- ❌ **No "security" icons** (locks/shields/bugs) unless absolutely necessary

### Key Motifs (From the Logo)

Your brand mark communicates: **raw technical → explained human**

UI should echo:
- ✅ Split-panels
- ✅ "Translation" arrows
- ✅ "Before/after" layout
- ✅ Structured report blocks

---

## UI Components

### Buttons

#### Primary
```css
background: #1F3A5F;
color: #FFFFFF;
/* hover: darken by ~6–8% */
/* focus ring: rgba(79,182,198,0.35) */
```

#### Secondary
```css
background: #FFFFFF;
border: 1px solid #E6ECF2;
color: #1F3A5F;
/* hover background: #F1F5FA */
```

### Cards

- **Surface**: White (#FFFFFF)
- **Border**: #E6ECF2
- **Shadow**: Soft (see Shadows section)
- **Title**: Navy (#1F3A5F)
- **Body**: Slate/Muted text

### Badges (Confidence + Finding Type)

Use **pill badges**, not aggressive colors:

| Confidence Level | Badge Style |
|-----------------|-------------|
| High confidence | Neutral navy badge |
| Medium | Muted amber |
| Low | Grey-blue |

**Badge Text**:
- ✅ "High confidence"
- ✅ "Medium confidence"
- ✅ "Low confidence"
- ❌ NOT "certain/uncertain"

---

## Dashboard Visual Representation (Tier 1)

### Structure

1. **Owner Summary** (top card, full width)
   - Light background wash (navy at 4–6% opacity)
   - 4–6 sentences
   - Small "Public signals only" note beneath

2. **Top Findings** (3 cards)
   - Each card: title + 2–3 sentences
   - Include confidence pill in top-right

3. **Assumptions Being Made** (signature block)
   - Full-width card
   - List format with subtle separators
   - Each begins: "You're assuming…"

4. **Questions to Ask Your IT/MSP**
   - Full-width card
   - List of 3–5 questions (no bullets that look alarming)

5. **Detail Cards** (6 blocks)
   - Grid: 2 columns desktop, 1 column mobile
   - Each shows:
     - Icon + block title
     - 2–4 sentence explanation
     - "Why it matters"
     - Confidence note

### Visual Tone Rule

Findings should look like:
- ✅ **insights**

NOT:
- ❌ **alerts**

**Never**:
- ❌ Red callouts
- ❌ Warning triangles
- ❌ "Security scan" look

---

## Marketing Site Representation

### Hero Section

- **Background**: Very light blue/grey wash (#F6F8FB)
- **H1**: "Explain My IT"
- **Subhead**: "Plain-English IT reports for business owners."
- **CTA**: Navy button

### Accent Usage

Use cyan in:
- ✅ Small highlights
- ✅ Underline accents
- ✅ Icon fills

NOT:
- ❌ Full backgrounds

---

## Key Principles Summary

1. **Insights, not alerts**
2. **Calm authority, not urgency**
3. **Clarity through structure**
4. **Translation, not jargon**
5. **Business owner first, IT second**

---

## Logo Reference

Logo file: `Docs/ChatGPT Image Jan 29, 2026, 07_12_37 PM.png`

The logo embodies the core concept:
- **Left (Cyan)**: Raw technical/data (circuit board motif)
- **Right (Navy)**: Explained human-readable report
- **Combined**: Translation bubble → clarity for business owners
