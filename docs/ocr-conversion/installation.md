# Installation Guide

Complete setup instructions for the OCR conversion tool.

**Cross-Platform Support**: This tool works on Windows, macOS, and Linux. All commands and scripts automatically detect your platform and use the appropriate executables.

## Prerequisites

- **Node.js**: Version 18 or higher
- **Python 3**: Version 3.8 or higher
- **pip**: Python package manager
- **System tools**: LibreOffice and poppler-utils

## Step 1: System Dependencies

Choose the instructions for your operating system:

### Windows

#### Python 3.8+

1. **Download Python installer**:
   - Visit https://www.python.org/downloads/
   - Download the latest Python 3.8+ installer
   - Run the installer
   - **IMPORTANT**: Check "Add Python to PATH" during installation

2. **Or use package manager**:
   ```cmd
   # Using chocolatey
   choco install python

   # Using scoop
   scoop install python
   ```

3. **Verify installation**:
   ```cmd
   python --version
   # or
   py --version
   # Expected: Python 3.8.x or higher
   ```

#### LibreOffice

1. **Download LibreOffice installer**:
   - Visit https://www.libreoffice.org/download/
   - Download the Windows installer (MSI)
   - Run the installer

2. **Or use package manager**:
   ```cmd
   choco install libreoffice
   ```

3. **Verify installation**:
   ```cmd
   # Should work if in PATH
   soffice --version

   # If not in PATH, the tool will auto-detect from:
   # C:\Program Files\LibreOffice\program\soffice.exe
   # C:\Program Files (x86)\LibreOffice\program\soffice.exe
   ```

#### poppler-utils

1. **Download poppler-windows**:
   - Visit https://github.com/oschwartz10612/poppler-windows/releases/
   - Download the latest release ZIP
   - Extract to a folder (e.g., `C:\Program Files\poppler`)

2. **Add to PATH**:
   - Search "Environment Variables" in Start Menu
   - Click "Edit the system environment variables"
   - Click "Environment Variables" button
   - Under "User variables", select "Path" and click "Edit"
   - Click "New" and add the path to poppler's `bin` folder
   - Click OK on all dialogs

3. **Or use package manager**:
   ```cmd
   # Using chocolatey
   choco install poppler

   # Using scoop
   scoop install poppler
   ```

4. **Verify installation**:
   ```cmd
   pdftoppm -v
   # Expected: pdftoppm version 22.x.x or higher
   ```

### macOS

```bash
# Install all dependencies with Homebrew
brew install python3 libreoffice poppler
```

**Verify installation**:

```bash
# Check Python
python3 --version
# Expected: Python 3.8.x or higher

# Check LibreOffice
soffice --version
# or
/Applications/LibreOffice.app/Contents/MacOS/soffice --version
# Expected: LibreOffice 7.x.x or higher

# Check poppler
pdftoppm -v
# Expected: pdftoppm version 22.x.x or higher
```

### Ubuntu/Debian/WSL

```bash
sudo apt-get update
sudo apt-get install python3 python3-pip libreoffice poppler-utils
```

**Verify installation**:

```bash
# Check Python
python3 --version
# Expected: Python 3.8.x or higher

# Check LibreOffice
libreoffice --version
# Expected: LibreOffice 7.x.x or higher

# Check poppler
pdftoppm -v
# Expected: pdftoppm version 22.x.x or higher
```

### Fedora/RHEL

```bash
sudo yum install python3 python3-pip libreoffice poppler-utils
```

### Arch Linux

```bash
sudo pacman -S python python-pip libreoffice poppler
```

## Quick Setup Verification

After installing system dependencies, run the verification script:

```bash
npm run ocr:verify
```

This will check all dependencies and provide platform-specific installation instructions for any missing components.

## Step 2: Python Dependencies

Install required Python packages (works on all platforms):

```bash
npm run ocr:install
```

The script automatically detects the correct pip command for your platform:
- Windows: Uses `pip`, `pip3`, or `py -m pip`
- macOS/Linux: Uses `pip3`, `pip`, or `python3 -m pip`

### Verify Python Installation

**Windows (Command Prompt)**:
```cmd
python -c "import mistralai; import PIL; import pdf2image; print('All packages installed!')"
```

**Windows (PowerShell)**:
```powershell
python -c "import mistralai; import PIL; import pdf2image; print('All packages installed!')"
```

**macOS/Linux**:
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

#### Windows

**Option A: Command Prompt (temporary, current session only)**
```cmd
set MISTRAL_API_KEY=your_api_key_here
```

**Option B: PowerShell (temporary, current session only)**
```powershell
$env:MISTRAL_API_KEY="your_api_key_here"
```

**Option C: Permanent (recommended for Windows)**
1. Search "Environment Variables" in Start Menu
2. Click "Edit the system environment variables"
3. Click "Environment Variables" button
4. Under "User variables", click "New"
5. Variable name: `MISTRAL_API_KEY`
6. Variable value: your API key
7. Click OK on all dialogs
8. **Restart your terminal** for changes to take effect

#### macOS / Linux

**Option A: Export in terminal (temporary)**
```bash
export MISTRAL_API_KEY="your_api_key_here"
```

**Option B: Add to shell profile (permanent)**
```bash
# For bash
echo 'export MISTRAL_API_KEY="your_api_key_here"' >> ~/.bashrc
source ~/.bashrc

# For zsh (default on macOS)
echo 'export MISTRAL_API_KEY="your_api_key_here"' >> ~/.zshrc
source ~/.zshrc
```

**Option C: Use .env file (all platforms)**

Create `.env` in workspace root:
```bash
MISTRAL_API_KEY=your_api_key_here
```

**Note**: The .env file is gitignored to prevent accidental commits of your API key.

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

Test the installation with the verification script:

```bash
# Run comprehensive setup verification
npm run ocr:verify
```

This will check:
- ✅ Node.js dependencies
- ✅ Python installation and version
- ✅ pip availability
- ✅ LibreOffice installation
- ✅ poppler-utils installation
- ✅ Python packages (mistralai, Pillow, pdf2image)
- ✅ Mistral API key configuration

If any checks fail, the script provides platform-specific installation instructions.

You can also verify the conversion command is available:

```bash
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
