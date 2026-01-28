#!/bin/bash
# Verification script for OCR conversion setup

echo "🔍 Verifying OCR Conversion Setup..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SUCCESS=0
WARNINGS=0
ERRORS=0

# Check Node.js dependencies
echo "📦 Checking Node.js dependencies..."
if npm list commander ora &>/dev/null; then
    echo -e "${GREEN}✓${NC} Node.js dependencies installed"
    ((SUCCESS++))
else
    echo -e "${RED}✗${NC} Node.js dependencies missing"
    echo "  Run: npm install"
    ((ERRORS++))
fi
echo ""

# Check Python
echo "🐍 Checking Python..."
if command -v python3 &>/dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} $PYTHON_VERSION"
    ((SUCCESS++))
else
    echo -e "${RED}✗${NC} Python 3 not found"
    echo "  Install Python 3.8 or higher"
    ((ERRORS++))
fi
echo ""

# Check LibreOffice
echo "📄 Checking LibreOffice..."
if command -v libreoffice &>/dev/null; then
    LO_VERSION=$(libreoffice --version 2>&1 | head -n1)
    echo -e "${GREEN}✓${NC} $LO_VERSION"
    ((SUCCESS++))
else
    echo -e "${RED}✗${NC} LibreOffice not found"
    echo "  Ubuntu/Debian: sudo apt-get install libreoffice"
    echo "  macOS: brew install --cask libreoffice"
    ((ERRORS++))
fi
echo ""

# Check poppler-utils
echo "🔧 Checking poppler-utils..."
if command -v pdftoppm &>/dev/null; then
    POPPLER_VERSION=$(pdftoppm -v 2>&1 | head -n1)
    echo -e "${GREEN}✓${NC} poppler-utils installed"
    ((SUCCESS++))
else
    echo -e "${RED}✗${NC} poppler-utils not found"
    echo "  Ubuntu/Debian: sudo apt-get install poppler-utils"
    echo "  macOS: brew install poppler"
    ((ERRORS++))
fi
echo ""

# Check Python packages
echo "📚 Checking Python packages..."
PYTHON_PACKAGES=("mistralai" "PIL" "pdf2image")
for pkg in "${PYTHON_PACKAGES[@]}"; do
    if python3 -c "import $pkg" &>/dev/null; then
        echo -e "${GREEN}✓${NC} $pkg"
        ((SUCCESS++))
    else
        echo -e "${RED}✗${NC} $pkg not installed"
        if [ $pkg == "PIL" ]; then
            echo "  Run: npm run ocr:install (installs Pillow)"
        else
            echo "  Run: npm run ocr:install"
        fi
        ((ERRORS++))
    fi
done
echo ""

# Check Mistral API key
echo "🔑 Checking Mistral API key..."
if [ -n "$MISTRAL_API_KEY" ]; then
    KEY_LENGTH=${#MISTRAL_API_KEY}
    MASKED_KEY="${MISTRAL_API_KEY:0:10}..."
    echo -e "${GREEN}✓${NC} API key set ($KEY_LENGTH chars): $MASKED_KEY"
    ((SUCCESS++))
else
    echo -e "${YELLOW}⚠${NC} MISTRAL_API_KEY not set"
    echo "  Set with: export MISTRAL_API_KEY='your_key_here'"
    echo "  Or use --api-key option when running conversion"
    ((WARNINGS++))
fi
echo ""

# Check OCR scripts
echo "📜 Checking OCR scripts..."
SCRIPTS=("scripts/ocr-convert-pptx.ts" "scripts/utils/ocr/pptx-to-images.py" "scripts/utils/ocr/mistral-ocr.py")
for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        echo -e "${GREEN}✓${NC} $script"
        ((SUCCESS++))
    else
        echo -e "${RED}✗${NC} $script missing"
        ((ERRORS++))
    fi
done
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓${NC} Success: $SUCCESS"
if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠${NC} Warnings: $WARNINGS"
fi
if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}✗${NC} Errors: $ERRORS"
fi
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 Setup is complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Set API key: export MISTRAL_API_KEY='your_key_here'"
    echo "  2. Convert PPTX: npm run ocr:convert -- presentation.pptx -o 2026-01_test"
    echo "  3. Preview: cd decks/2026-01_test && npm run dev"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Setup incomplete${NC}"
    echo ""
    echo "Please fix the errors above before running OCR conversion."
    echo ""
    exit 1
fi
