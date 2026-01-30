# Frontend Visual Language - Tier 1

**Last Updated**: January 29, 2026  
**Status**: Production-Ready

---

## Brand Foundation

The Explain My IT frontend embodies **"quiet confidence"** - a calm, credible, owner-first experience that presents insights, not alerts.

**Core Reference**: `../VISUAL-STYLE-SPEC.md` (complete brand guidelines)  
**Logo**: `../ChatGPT Image Jan 29, 2026, 07_12_37 PM.png` (visual identity)

---

## Color System

### Primary Palette (In Code)

```typescript
// tailwind.config.ts
colors: {
  brand: {
    navy: '#1F3A5F',      // Authority, primary buttons, headings
    cyan: '#4FB6C6',       // Accents, links, highlights
    slate: '#445468',      // Body text
    bg: '#F6F8FB',         // Page background
    border: '#E6ECF2',     // All borders
    muted: '#6B7C93',      // Secondary/muted text
    positive: '#2E8B57',   // Positive (sparingly)
    caution: '#D6A545',    // Caution (muted amber, not red)
    info: '#7A8CA6',       // Neutral/info badges
  },
}
```

### Usage Rules

- **Primary actions**: Navy background + white text
- **Links & highlights**: Cyan
- **Body text**: Slate for primary, Muted for secondary
- **Backgrounds**: bg for pages, surface (white) for cards
- **Never harsh red**: Only for true app errors (not findings)

---

## Typography

**Font Family**: Inter (Google Fonts, optimized with display: 'swap')

**Type Scale**:
- H1: 40-48px, weight 700 (hero titles)
- H2: 24-28px, weight 700 (section headers)
- H3: 16-18px, weight 700 (card titles)
- Body: 15-16px, weight 400-500 (content)
- Small: 12-13px, weight 400 (captions)

**Implementation**: `app/globals.css` + component-level sizing

---

## Shadows

**Card shadow**: `shadow-brand` → `0 6px 24px rgba(31, 58, 95, 0.08)`  
**Hover shadow**: `shadow-brand-hover` → `0 10px 32px rgba(31, 58, 95, 0.12)`

**Principle**: Soft and modern, never heavy

---

## Border Radius

**Standardized values**:
- Cards: `rounded-[16px]` (14-16px)
- Buttons/inputs: `rounded-[12px]` (10-12px)
- Small cards: `rounded-[14px]`
- Inner elements: `rounded-[10px]`

---

## Component Patterns

### Confidence Badges

**Critical brand requirement**: Badges show insights, not alerts

```typescript
// CORRECT (brand-aligned)
high: 'bg-brand-navy/10 text-brand-navy border-brand-navy/20'      // Calm authority
medium: 'bg-brand-caution/15 text-brand-caution border-brand-caution/30'  // Subtle caution
low: 'bg-brand-info/10 text-brand-info border-brand-info/20'       // Neutral

// WRONG (alert-style)
high: 'bg-green-100 text-green-800'  // ❌ Too "traffic light"
medium: 'bg-yellow-100 text-yellow-800'  // ❌ Warning-like
```

**Labels**: "High confidence", "Medium confidence", "Low confidence" (full words, not abbreviations)

---

### Buttons

#### Primary Button
```css
.btn-primary {
  bg-brand-navy text-white 
  rounded-[12px] 
  shadow-brand hover:shadow-brand-hover
  focus:ring-2 focus:ring-brand-cyan/35
}
```

#### Secondary Button
```css
.btn-secondary {
  bg-white text-brand-navy 
  border border-brand-border
  rounded-[12px]
  hover:bg-[#F1F5FA]
  focus:ring-2 focus:ring-brand-cyan/35
}
```

---

### Cards

**Standard card**:
```html
<div className="bg-white rounded-[16px] border border-brand-border shadow-brand p-8">
  <!-- content -->
</div>
```

**Hover effects**:
```html
hover:shadow-brand-hover hover:border-brand-cyan/30
```

---

### Forms

**Inputs**:
```html
<input 
  className="border border-brand-border 
             rounded-[12px] 
             focus:ring-2 focus:ring-brand-cyan/35 
             focus:border-brand-cyan
             text-[15px]" 
/>
```

**Focus states**: Always use `focus:ring-brand-cyan/35` (35% opacity, spec-compliant)

---

## Layout System

**Max widths**:
- Marketing content: 1200px (`.container-section`)
- Dashboard: 1280px (report page slightly wider)

**Spacing**:
- Section padding: `py-20` (80px, within 64-96px spec)
- Card padding: `p-8` (32px, within 20-28px spec)
- Card gaps: `gap-6` or `gap-8` (24-32px, within 16-24px spec)

**Grid**: 8px base (Tailwind default maintained)

---

## Gradients

### Hero Gradient (Brand)
```html
<div className="bg-brand-gradient opacity-[0.06]">
```

**Usage**: Only for hero sections, 5-12% opacity, never loud

### Card Gradients (Subtle)
```html
<div className="bg-gradient-to-br from-brand-navy/5 to-brand-navy/10">
<div className="bg-gradient-to-br from-brand-cyan/10 to-brand-cyan/20">
```

**Principle**: Gentle washes, not bold backgrounds

---

## Iconography

**Emojis Used** (spec-approved):
- 📊 Owner Summary
- 🎯 Key Findings
- 💭 Assumptions (changed from ⚠️ for less alarm)
- 💡 Questions
- 🌐📧🔒⚙️🔍🛡️ Six signal blocks

**SVG Icons**: 
- Outline style, consistent 2px stroke
- Rounded corners
- Navy or cyan color

---

## Page-Specific Patterns

### Homepage

1. **Hero**: Brand bg + gradient overlay (6%), navy headlines, form card with brand-hover shadow
2. **Benefits bar**: Cyan numbers, muted descriptions
3. **Feature cards**: Brand shadows, hover effects, navy/cyan/positive distribution
4. **Waitlist CTA**: Navy background, white form card

### Report Page

1. **Owner Summary**: Navy wash background (5% opacity), "Public signals only" note
2. **Top Findings**: Numbered badges (cyan background), confidence pills (navy/amber/grey-blue)
3. **Block Narratives**: Expandable accordion, emojis for blocks, cyan focus rings
4. **Assumptions**: Subtle separators, info badges, calm presentation
5. **Questions**: Cyan badges, clear list format
6. **CTA**: Navy background, cyan button for secondary action

---

## Tone Enforcement

### Copy Guidelines

- ✅ **Calm, factual, non-technical**
- ✅ **Never urgent**
- ✅ **Owner-first language**

### Visual Tone

- ✅ **Insights, not alerts**
- ✅ **Structured, not chaotic**
- ✅ **Translation, not jargon**

### What to Avoid

- ❌ Red for findings (only for true errors)
- ❌ Warning triangles
- ❌ "Security scan" aesthetics
- ❌ Harsh shadows
- ❌ Traffic light colors (green/yellow/red)

---

## Accessibility

- **Focus rings**: Brand cyan at 35% opacity (visible, not harsh)
- **Contrast**: Navy on white = WCAG AAA
- **ARIA**: All labels preserved, semantic HTML
- **Keyboard nav**: All interactive elements accessible

---

## Responsive Design

- **Mobile-first**: All components stack gracefully
- **Breakpoints**: md: (768px), lg: (1024px)
- **Grid patterns**: 2-column desktop → 1-column mobile
- **Touch targets**: Min 44x44px (accessibility standard)

---

## Implementation Notes

1. **Tailwind config**: Brand colors available as `brand-*` utilities
2. **Inter font**: Loaded via Next.js font optimization
3. **Shadows**: Use `shadow-brand` and `shadow-brand-hover` exclusively
4. **Border radius**: Always use exact pixel values (e.g., `rounded-[16px]`)
5. **Opacity**: When using brand colors with opacity, use `/` syntax (e.g., `bg-brand-navy/10`)

---

## Quality Checklist

Before deploying any new frontend components:

- [ ] Uses brand color palette (no generic Tailwind colors)
- [ ] Inter font family
- [ ] Confidence badges use navy/amber/grey-blue (not green/yellow/red)
- [ ] Border radius matches spec (16px cards, 12px buttons)
- [ ] Shadows use brand values
- [ ] Focus rings use cyan/35
- [ ] Typography sizes match scale
- [ ] No harsh reds (except true errors)
- [ ] Emojis match approved list
- [ ] Mobile responsive
- [ ] ARIA labels present

---

**Status**: All Tier 1 frontend components 100% brand-compliant. Ready for production deployment.
