# Installation Guide

Complete setup instructions for the OCR conversion tool.

## Prerequisites

- **Node.js**: Version 18 or higher
- **Python 3**: Version 3.8 or higher
- **pip3**: Python package manager
- **System tools**: LibreOffice and poppler-utils

## Step 1: System Dependencies

### Ubuntu/Debian/WSL

```bash
sudo apt-get update
sudo apt-get install libreoffice poppler-utils python3-pip
```

### macOS

```bash
brew install libreoffice poppler python3
```

### Verify Installation

```bash
# Check LibreOffice
libreoffice --version
# Expected: LibreOffice 7.x.x or higher

# Check poppler (pdftoppm)
pdftoppm -v
# Expected: pdftoppm version 22.x.x or higher

# Check Python
python3 --version
# Expected: Python 3.8.x or higher
```

## Step 2: Python Dependencies

Install required Python packages:

```bash
npm run ocr:install
```

This is equivalent to:

```bash
pip3 install -r scripts/utils/ocr/requirements.txt
```

### Verify Python Installation

```bash
python3 -c "import mistralai; import PIL; import pdf2image; print('All packages installed!')"
```

If successful, you should see: `All packages installed!`

## Step 3: Mistral API Key

### Get Your API Key

1. Visit https://console.mistral.ai
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key

### Set Environment Variable

**Option A: Export in terminal (temporary)**

```bash
export MISTRAL_API_KEY="your_api_key_here"
```

**Option B: Add to shell profile (permanent)**

```bash
# For bash
echo 'export MISTRAL_API_KEY="your_api_key_here"' >> ~/.bashrc
source ~/.bashrc

# For zsh
echo 'export MISTRAL_API_KEY="your_api_key_here"' >> ~/.zshrc
source ~/.zshrc
```

**Option C: Use .env file**

Create `.env` in workspace root:

```bash
MISTRAL_API_KEY=your_api_key_here
```

## Step 4: Node.js Dependencies

If not already installed:

```bash
npm install
```

This installs:
- `commander` - CLI framework
- `ora` - Progress indicators
- Other workspace dependencies

## Step 5: Verification

Test the installation with a sample conversion:

```bash
# Verify command is available
npm run ocr:convert -- --help

# Should display usage information
```

## Troubleshooting Installation

### LibreOffice Not Found

**Error**: `libreoffice: command not found`

**Solution**:
```bash
# Check if installed but not in PATH
which libreoffice
# or
/usr/bin/libreoffice --version

# If installed at different location, create symlink
sudo ln -s /path/to/libreoffice /usr/local/bin/libreoffice
```

### Python Package Installation Fails

**Error**: `error: externally-managed-environment`

**Solution**: Use virtual environment or `--break-system-packages` (not recommended)

```bash
# Better: Use virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r scripts/utils/ocr/requirements.txt
```

### Mistral API Import Error

**Error**: `ImportError: cannot import name 'Mistral'`

**Solution**: Update mistralai package

```bash
pip3 install --upgrade mistralai
```

### pdf2image Error

**Error**: `pdf2image.exceptions.PDFInfoNotInstalledError`

**Solution**: Install poppler-utils

```bash
# Ubuntu/Debian
sudo apt-get install poppler-utils

# macOS
brew install poppler
```

## Next Steps

Once installation is complete, proceed to the [Usage Guide](./usage.md) to start converting presentations.

## System Requirements

### Minimum

- **CPU**: 2 cores
- **RAM**: 4GB
- **Disk**: 500MB for dependencies + space for converted files

### Recommended

- **CPU**: 4+ cores (for faster processing)
- **RAM**: 8GB+ (for large presentations)
- **Disk**: 2GB+ (for working with multiple decks)

### Network

- Internet connection required for Mistral API calls
- Bandwidth: ~500KB per slide (for image upload to API)
