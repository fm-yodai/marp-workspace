# Conversion Strategies

Detailed comparison of the three conversion strategies.

## Overview

The tool offers three strategies, each optimized for different use cases:

| Strategy | Fidelity | Editability | File Size | Speed | Best For |
|----------|----------|-------------|-----------|-------|----------|
| Background | 100% | None | Large | Fast | Archival, exact reproduction |
| Hybrid | 85-95% | Medium | Large | Medium | Editable with visual reference |
| Reconstruction | 60-90% | Full | Small | Slow | Text-heavy, version control |

## Strategy A: Background Mode

### Description

Preserves original slides as full-page background images. No text extraction or OCR required.

### Output Example

```markdown
---
marp: true
theme: default
size: 16:9
paginate: true
---

![bg](./assets/slide-01.png)

---

![bg](./assets/slide-02.png)

---

![bg](./assets/slide-03.png)
```

### Characteristics

**Visual Fidelity: Perfect (100%)**
- Exact pixel-perfect reproduction
- All graphics, fonts, effects preserved
- No interpretation or conversion errors

**Editability: None**
- Cannot edit text directly
- Must replace entire slide to change content
- Not searchable in Markdown

**File Size: Large**
- One PNG per slide (~500KB-2MB each)
- 50-slide deck: 25-100MB
- Largest of three strategies

**Processing Speed: Fast**
- No OCR processing needed
- Only PPTX→PDF→PNG conversion
- ~10 seconds per deck

### Use Cases

✅ **Recommended for:**
- Archival/preservation of presentations
- Designs with complex graphics or custom fonts
- Quick preview generation
- Presentations that won't need editing
- Legacy slides with unknown fonts

❌ **Not recommended for:**
- Presentations you need to edit regularly
- Text-heavy content that should be searchable
- Version control workflows
- Accessibility requirements (screen readers)

### Example

**Input PPTX:**
- Corporate template with logo, branding
- Custom fonts and colors
- Charts and diagrams
- 30 slides

**Command:**
```bash
npm run ocr:convert -- corporate.pptx -o 2026-01_corporate --strategy background
```

**Result:**
- Perfect visual match to original
- Ready to present immediately
- No text editing needed
- File size: ~50MB

## Strategy B: Hybrid Mode

### Description

Combines background images with OCR-extracted text overlays. Provides visual reference while allowing text editing.

### Output Example

```markdown
---
marp: true
theme: default
size: 16:9
---

![bg opacity:0.3](./assets/slide-01.png)

<!-- _class: overlay-slide -->

# Quarterly Results

## Key Achievements

- Revenue growth: 25%
- New customers: 1,200
- Product launches: 3

---

![bg opacity:0.3](./assets/slide-02.png)

# Financial Overview

| Metric | Q4 2025 | Change |
|--------|---------|--------|
| Revenue | $2.5M | +25% |
| Profit | $800K | +30% |
```

### Characteristics

**Visual Fidelity: High (85-95%)**
- Background image provides context
- Text overlay may not match exact positioning
- Colors and fonts use Marp theme

**Editability: Medium**
- Text content is editable
- Can update numbers, bullet points
- Layout adjustments possible
- Original design visible as reference

**File Size: Large**
- Same images as background mode
- Plus text content (negligible)
- 50-slide deck: 25-100MB

**Processing Speed: Medium**
- Requires OCR processing
- ~1-2 seconds per slide
- Total: ~2-5 minutes for 50 slides

### Use Cases

✅ **Recommended for:**
- Presentations you want to edit but keep design reference
- Updating content while maintaining brand
- Collaborative editing with visual context
- Converting templates for reuse

❌ **Not recommended for:**
- Presentations with very complex layouts
- When file size is critical
- When perfect positioning is required

### Custom Theme Required

For best results, use the hybrid overlay theme:

**shared/themes/hybrid-overlay.css:**
```css
/* Hybrid overlay theme */
.overlay-slide {
  position: relative;
}

.overlay-slide h1,
.overlay-slide h2,
.overlay-slide h3 {
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.overlay-slide p,
.overlay-slide li {
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}
```

### Example

**Input PPTX:**
- Quarterly report
- Mix of text and charts
- 25 slides

**Command:**
```bash
npm run ocr:convert -- quarterly.pptx -o 2026-02_q4 --strategy hybrid
```

**Result:**
- Editable text content
- Original design visible
- Can update numbers easily
- File size: ~40MB

## Strategy C: Reconstruction Mode

### Description

Fully reconstructs presentation as Markdown using OCR. Maximum editability, no background images.

### Output Example

```markdown
---
marp: true
theme: default
size: 16:9
---

# Quarterly Results

## Key Achievements

- Revenue growth: 25%
- New customers: 1,200
- Product launches: 3

---

# Financial Overview

| Metric | Q4 2025 | Change |
|--------|---------|--------|
| Revenue | $2.5M | +25% |
| Profit | $800K | +30% |

---

# Market Analysis

## Current Trends

1. Increased demand in APAC
2. Shift to subscription model
3. Mobile-first adoption

### Challenges

- Competition intensifying
- Regulatory changes
- Supply chain issues
```

### Characteristics

**Visual Fidelity: Variable (60-90%)**
- Depends on OCR accuracy
- Simple layouts: 85-90% accurate
- Complex layouts: 60-75% accurate
- Custom design elements lost

**Editability: Full**
- Complete Markdown editing
- Easy to modify structure
- Add/remove slides freely
- Version control friendly

**File Size: Small**
- Text only, no images
- 50-slide deck: <100KB
- 99% smaller than image modes

**Processing Speed: Slow**
- Full OCR processing
- ~2-3 seconds per slide
- Total: ~3-7 minutes for 50 slides

### Use Cases

✅ **Recommended for:**
- Text-heavy presentations
- Technical documentation
- Presentations you'll heavily edit
- Version control workflows (git)
- Collaborative editing
- Accessibility (screen readers)

❌ **Not recommended for:**
- Design-heavy presentations
- Custom graphics and branding
- Complex multi-column layouts
- Presentations with embedded charts

### OCR Accuracy Factors

**High accuracy (85-90%):**
- Clean, high-contrast text
- Standard fonts
- Simple layouts
- Good image quality (300+ DPI)

**Lower accuracy (60-75%):**
- Custom fonts
- Low contrast
- Complex layouts
- Tables and charts
- Rotated or curved text

### Example

**Input PPTX:**
- Training materials
- Mostly text and bullet points
- 40 slides

**Command:**
```bash
npm run ocr:convert -- training.pptx -o 2026-03_training --strategy reconstruction
```

**Result:**
- Fully editable Markdown
- Easy to update content
- Version control friendly
- File size: ~50KB

**Post-conversion:**
```bash
# Edit with any text editor
vim decks/2026-03_training/deck.md

# Track changes
git diff decks/2026-03_training/deck.md

# Build updated version
cd decks/2026-03_training
npm run build:all
```

## Choosing the Right Strategy

### Decision Tree

```
Do you need to edit the content?
├─ No → Background mode
└─ Yes → Do you need to preserve the original design?
    ├─ Yes → Hybrid mode
    └─ No → Reconstruction mode
```

### By Use Case

**Quick archival/sharing:**
→ Background mode

**Update corporate template:**
→ Hybrid mode

**Collaborative document editing:**
→ Reconstruction mode

**Legacy preservation:**
→ Background mode

**Training material iteration:**
→ Reconstruction mode

**Client presentation with minor updates:**
→ Hybrid mode

### By Slide Content

**Heavy graphics, charts, images:**
→ Background or Hybrid

**Mostly text and bullet points:**
→ Reconstruction

**Tables and structured data:**
→ Hybrid or Reconstruction

**Custom fonts and branding:**
→ Background or Hybrid

**Technical diagrams:**
→ Background

## Hybrid Strategy Comparison

### When to Upgrade

**Background → Hybrid:**
- Need to edit text occasionally
- Want to maintain visual reference
- File size not a concern

**Hybrid → Reconstruction:**
- Need full editing flexibility
- File size is important
- Version control required
- Original design less important

### When to Downgrade

**Reconstruction → Hybrid:**
- Lost too much design
- Need visual reference
- OCR accuracy insufficient

**Hybrid → Background:**
- Not editing as expected
- Overlay positioning issues
- Want perfect fidelity

## Advanced Techniques

### Combining Strategies

For complex presentations, you can:

1. **Convert with all three strategies:**
   ```bash
   npm run ocr:convert -- source.pptx -o deck-bg --strategy background
   npm run ocr:convert -- source.pptx -o deck-hybrid --strategy hybrid
   npm run ocr:convert -- source.pptx -o deck-recon --strategy reconstruction
   ```

2. **Compare outputs and choose best slides from each**

3. **Merge manually:**
   - Use background for graphic-heavy slides
   - Use reconstruction for text-heavy slides
   - Create final hybrid deck

### Strategy Migration

Convert between strategies:

```bash
# Start with background for preview
npm run ocr:convert -- source.pptx -o deck-preview --strategy background

# After review, convert with hybrid for editing
npm run ocr:convert -- source.pptx -o deck-edit --strategy hybrid

# Final version: reconstruction for maximum flexibility
npm run ocr:convert -- source.pptx -o deck-final --strategy reconstruction
```

## Cost Comparison

### API Costs

| Strategy | OCR Required | Cost per 50 Slides |
|----------|--------------|-------------------|
| Background | No | $0.00 |
| Hybrid | Yes | $0.10 |
| Reconstruction | Yes | $0.10 |

### Storage Costs

| Strategy | Disk Usage per 50 Slides |
|----------|-------------------------|
| Background | 25-100 MB |
| Hybrid | 25-100 MB |
| Reconstruction | <1 MB |

### Time Costs

| Strategy | Processing Time per 50 Slides |
|----------|------------------------------|
| Background | ~30 seconds |
| Hybrid | ~3-5 minutes |
| Reconstruction | ~4-7 minutes |

## Next Steps

- See [Usage Guide](./usage.md) for command examples
- Check [Troubleshooting](./troubleshooting.md) for issues
- Explore [Marp Documentation](../marp/) for slide customization
