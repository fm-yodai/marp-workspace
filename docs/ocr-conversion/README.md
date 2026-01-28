# OCR-Based PPTX to Marp Conversion

Convert PowerPoint presentations to Marp slide decks using Mistral Vision/OCR API.

## Quick Start

```bash
# 1. Install Python dependencies
npm run ocr:install

# 2. Set your Mistral API key
export MISTRAL_API_KEY="your_api_key_here"

# 3. Convert a PPTX file
npm run ocr:convert -- presentation.pptx -o 2026-01_converted

# 4. Preview the result
cd decks/2026-01_converted
npm run dev
```

## Overview

This tool converts PowerPoint presentations to Marp format with three different strategies:

1. **Background Mode** (default): Perfect visual fidelity, preserves original slides as images
2. **Hybrid Mode**: Background images with editable text overlays
3. **Reconstruction Mode**: Full Markdown reconstruction for maximum editability

## Features

- ✅ High-fidelity conversion using Mistral Vision/OCR
- ✅ Three output strategies for different use cases
- ✅ Automatic deck structure generation
- ✅ Progress indicators and error handling
- ✅ Integration with workspace infrastructure

## Documentation

- [Installation Guide](./installation.md) - Setup instructions
- [Usage Guide](./usage.md) - CLI reference and examples
- [Conversion Strategies](./strategies.md) - Comparison of output modes
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions

## Cost Considerations

- **Mistral Vision API**: ~$2 per 1,000 pages
- **Typical 50-slide deck**: $0.10 standard
- **Free trial**: Available at https://console.mistral.ai

## Requirements

### System Dependencies

```bash
# Ubuntu/Debian/WSL
sudo apt-get install libreoffice poppler-utils

# macOS
brew install libreoffice poppler
```

### Python Dependencies

```bash
npm run ocr:install
```

This installs:
- `mistralai` - Mistral API client
- `Pillow` - Image processing
- `pdf2image` - PDF to image conversion

### Node.js Dependencies

Already included in workspace:
- `commander` - CLI framework
- `ora` - Progress indicators

## Architecture

```
Input PPTX
    ↓
[pptx-to-images.py] - LibreOffice + pdf2image
    ↓
PNG images (one per slide)
    ↓
[mistral-ocr.py] - Mistral Vision API
    ↓
OCR results (text + layout)
    ↓
[marp-generator.ts] - Markdown generation
    ↓
Output: Marp deck in decks/
```

## Next Steps

After conversion, you can:

1. **Preview**: `cd decks/your-deck && npm run dev`
2. **Edit**: Modify `deck.md` with your text editor
3. **Build**: `npm run build:all` to generate HTML/PDF/PPTX
4. **Customize**: Update theme, add animations, etc.

## Support

For issues or questions:
- Check the [Troubleshooting Guide](./troubleshooting.md)
- Review [Usage Examples](./usage.md)
- Report bugs at: https://github.com/anthropics/claude-code/issues
