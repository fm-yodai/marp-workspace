# Usage Guide

Complete reference for using the OCR conversion tool.

## Basic Usage

```bash
npm run ocr:convert -- <pptx-file> -o <deck-name>
```

## Command Options

```
Arguments:
  pptx-file              Path to PowerPoint file (.pptx)

Required Options:
  -o, --output <name>    Output deck name (e.g., 2026-01_presentation)

Optional:
  -s, --strategy <type>  Conversion strategy: background, hybrid, reconstruction
                         (default: "background")
  --dpi <number>         Image resolution (default: 300)
  --api-key <key>        Mistral API key (overrides MISTRAL_API_KEY env var)
  --theme <name>         Marp theme to use (default: "default")
  --keep-temp            Keep temporary files for debugging
  -h, --help             Display help information
  -V, --version          Display version number
```

## Examples

### Example 1: Basic Conversion

```bash
npm run ocr:convert -- presentation.pptx -o 2026-01_quarterly-review
```

This will:
1. Convert `presentation.pptx` to images
2. Process with Mistral OCR
3. Generate Marp deck at `decks/2026-01_quarterly-review/`
4. Use default settings (background mode, 300 DPI)

### Example 2: Hybrid Mode with Text Overlay

```bash
npm run ocr:convert -- slides.pptx -o 2026-02_project --strategy hybrid
```

Output includes:
- Background images at 30% opacity
- Extracted text as editable Markdown overlays

### Example 3: Full Reconstruction

```bash
npm run ocr:convert -- presentation.pptx -o 2026-03_training --strategy reconstruction
```

Output:
- Fully editable Markdown
- No background images
- Smaller file size

### Example 4: High-Resolution Images

```bash
npm run ocr:convert -- slides.pptx -o 2026-04_poster --dpi 600
```

Use higher DPI for:
- Large displays
- Printing
- Fine detail preservation

### Example 5: Custom Theme

```bash
npm run ocr:convert -- presentation.pptx -o 2026-05_branded --theme company
```

Applies custom theme during generation.

### Example 6: Debugging with Temporary Files

```bash
npm run ocr:convert -- problematic.pptx -o test-debug --keep-temp
```

Keeps temporary image files for inspection.

### Example 7: Specify API Key Inline

```bash
npm run ocr:convert -- presentation.pptx -o 2026-06_demo --api-key "your_key_here"
```

Useful for:
- CI/CD environments
- Multiple API keys
- Override environment variable

## Workflow

### Complete Conversion Workflow

```bash
# 1. Convert PPTX to Marp
npm run ocr:convert -- source.pptx -o 2026-01_new-deck --strategy hybrid

# 2. Navigate to deck
cd decks/2026-01_new-deck

# 3. Preview in browser
npm run dev

# 4. Edit deck.md as needed
# (Use your favorite text editor)

# 5. Build all formats
npm run build:all

# 6. Check output
ls -lh dist/
# deck.html, deck.pdf, deck.pptx
```

## Output Structure

After conversion, your deck directory will contain:

```
decks/2026-01_example/
├── deck.md                 # Main presentation file
├── assets/                 # Slide images
│   ├── slide-01.png
│   ├── slide-02.png
│   └── ...
├── context/                # Metadata and notes
│   ├── ocr-metadata.json  # Full OCR results
│   ├── background.md      # Conversion details
│   └── notes.md           # Your notes
├── package.json           # Build scripts
├── .marprc                # Marp configuration
└── .gitignore             # Ignore dist/
```

## Strategy Comparison

### Background Mode (Default)

**Best for:**
- Quick conversions
- Preserving exact visual appearance
- Complex layouts with custom graphics

**Output:**
```markdown
---
marp: true
---

![bg](./assets/slide-01.png)

---

![bg](./assets/slide-02.png)
```

**Pros:**
- Perfect fidelity (100%)
- Fast conversion
- No OCR errors

**Cons:**
- Not editable
- Large file size
- Not searchable

### Hybrid Mode

**Best for:**
- Presentations you want to edit
- Maintaining visual reference
- Balance between fidelity and editability

**Output:**
```markdown
---
marp: true
---

![bg opacity:0.3](./assets/slide-01.png)

# Extracted Title

- Bullet point 1
- Bullet point 2
```

**Pros:**
- Editable text
- Visual reference maintained
- Good OCR accuracy

**Cons:**
- Medium file size
- May need overlay adjustments
- Requires custom theme

### Reconstruction Mode

**Best for:**
- Fully editable presentations
- Simple layouts
- Text-heavy slides
- Version control friendly

**Output:**
```markdown
---
marp: true
---

# Extracted Title

- Bullet point 1
- Bullet point 2

---

## Section Heading

Content here...
```

**Pros:**
- Fully editable
- Small file size
- Version control friendly
- Searchable

**Cons:**
- May lose visual design
- Complex layouts simplified
- OCR accuracy dependent

## Performance Tips

### Large Presentations

For presentations with 50+ slides:

```bash
# Use lower DPI to speed up processing
npm run ocr:convert -- large.pptx -o 2026-big --dpi 150

# Consider batch processing (future feature)
# Split large PPTX into smaller files
```

### Optimization

**Image Quality vs. Speed:**
- 150 DPI: Fast, good for preview
- 300 DPI: Standard, recommended
- 600 DPI: Slow, high quality only when needed

**API Costs:**
- ~$0.002 per slide
- 50-slide deck ≈ $0.10
- Consider batch API for large projects (future)

## Common Workflows

### Workflow 1: Corporate Presentation Update

```bash
# 1. Convert existing PPTX
npm run ocr:convert -- Q4-2025.pptx -o 2026-01_q4-review --strategy hybrid

# 2. Edit content
cd decks/2026-01_q4-review
# Edit deck.md to update numbers, add slides

# 3. Apply company theme
# Copy custom theme to themes/
# Update .marprc

# 4. Build and distribute
npm run build:all
```

### Workflow 2: Conference Talk Migration

```bash
# 1. Convert with full reconstruction
npm run ocr:convert -- conference-2025.pptx -o 2026-02_conference --strategy reconstruction

# 2. Refine content
# Simplify slides, improve readability

# 3. Add speaker notes
# Edit context/notes.md

# 4. Export to multiple formats
npm run build:all
```

### Workflow 3: Training Material Conversion

```bash
# 1. Convert training deck
npm run ocr:convert -- training-v1.pptx -o 2026-03_training --strategy hybrid

# 2. Version control
git add decks/2026-03_training
git commit -m "Convert training materials to Marp"

# 3. Iterate
# Edit, commit, build
# Track changes in git
```

## Troubleshooting

See [Troubleshooting Guide](./troubleshooting.md) for detailed solutions.

### Quick Fixes

**Conversion fails:**
```bash
# Check LibreOffice
libreoffice --version

# Test manually
libreoffice --headless --convert-to pdf presentation.pptx
```

**OCR returns empty:**
```bash
# Verify API key
echo $MISTRAL_API_KEY

# Test with single image
python3 scripts/utils/ocr/mistral-ocr.py slide-01.png "$MISTRAL_API_KEY" pixtral-12b-2409
```

**Output deck doesn't render:**
```bash
# Check deck.md syntax
cd decks/your-deck
npm run dev
# Look for errors in console
```

## Next Steps

- Review [Conversion Strategies](./strategies.md) for detailed comparison
- Check [Troubleshooting](./troubleshooting.md) for common issues
- Explore [Marp Documentation](../marp/) for slide customization
