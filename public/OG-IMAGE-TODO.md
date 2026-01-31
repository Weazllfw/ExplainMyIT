# IMPORTANT: Create Open Graph Image

**Filename**: `og-image.png`  
**Location**: `public/og-image.png`  
**Size**: 1200 x 630 pixels  
**Format**: PNG

## Design Specifications

### **Background**
- Color: Brand Navy (#1f3a5f)
- Or: Gradient from navy to darker navy

### **Content**
- Logo/Wordmark: "Explain My IT"
- Tagline: "Plain-English IT Reports for Business Owners"
- Optional: Simple icon/graphic

### **Typography**
- Font: Inter (or similar sans-serif)
- Title: Bold, large (48-64px)
- Tagline: Regular, medium (24-32px)
- Color: White or Cyan (#06b6d4)

### **Layout**
```
+--------------------------------------------------+
|                                                  |
|                                                  |
|              Explain My IT                       |
|                                                  |
|     Plain-English IT Reports                     |
|       for Business Owners                        |
|                                                  |
|                                                  |
+--------------------------------------------------+
```

## Tools to Create

1. **Canva** (easiest):
   - Go to canva.com
   - Search "Facebook Post" template
   - Resize to 1200 x 630px
   - Add brand colors & text
   - Download as PNG

2. **Figma** (professional):
   - Create 1200 x 630px frame
   - Design with brand guidelines
   - Export as PNG @2x

3. **Online OG Image Generator**:
   - og-image-generator.vercel.app
   - Customize and download

## Current Status

❌ **NOT CREATED YET**

The code references `/og-image.png` but the file doesn't exist yet.

**Impact**: Social sharing (Twitter, LinkedIn, Facebook) will show generic preview

**Priority**: HIGH (create before launch)

**Time**: 15 minutes

## After Creating

1. Save as `public/og-image.png`
2. Test with:
   - Twitter Card Validator
   - Facebook Sharing Debugger
   - LinkedIn Post Inspector

## Reference

Current metadata in `app/layout.tsx`:
```typescript
openGraph: {
  images: [
    {
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Explain My IT - Plain-English IT Reports',
    },
  ],
}
```
