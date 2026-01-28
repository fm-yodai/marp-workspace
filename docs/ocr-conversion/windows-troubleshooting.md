# Windows Troubleshooting Guide

Common issues and solutions for running OCR conversion on Windows.

## Table of Contents

- [Python Issues](#python-issues)
- [LibreOffice Issues](#libreoffice-issues)
- [poppler-utils Issues](#poppler-utils-issues)
- [Path and File Issues](#path-and-file-issues)
- [Permission Issues](#permission-issues)
- [Environment Variables](#environment-variables)
- [Command Line Issues](#command-line-issues)

---

## Python Issues

### "python3 not found"

**Symptom**: Error when running scripts: `'python3' is not recognized as an internal or external command`

**Cause**: Windows typically installs Python as `python` or `py`, not `python3`

**Solution**:
✅ **No action needed!** The tools automatically detect whether to use `python`, `python3`, or `py`. This error should not occur with the updated tools.

If you still see this error in older scripts:
```cmd
# Use python instead
python --version

# Or use py launcher
py --version
```

### "pip3 not found"

**Symptom**: Error: `'pip3' is not recognized as an internal or external command`

**Cause**: Windows uses `pip` or `py -m pip` instead of `pip3`

**Solution**:
✅ **No action needed!** The `npm run ocr:install` command automatically detects the correct pip command.

If you need to manually install packages:
```cmd
# Use pip
pip install package-name

# Or use Python's module syntax
python -m pip install package-name

# Or use py launcher
py -m pip install package-name
```

### Python not in PATH

**Symptom**: `'python' is not recognized as an internal or external command`

**Solution**:
1. Find your Python installation:
   - Common location: `C:\Users\<YourName>\AppData\Local\Programs\Python\Python3x\`
   - Or: `C:\Python3x\`

2. Add to PATH:
   - Search "Environment Variables" in Start Menu
   - Click "Edit the system environment variables"
   - Click "Environment Variables"
   - Under "User variables", select "Path" and click "Edit"
   - Click "New" and add both:
     - `C:\Users\<YourName>\AppData\Local\Programs\Python\Python3x\`
     - `C:\Users\<YourName>\AppData\Local\Programs\Python\Python3x\Scripts\`
   - Click OK on all dialogs
   - **Restart your terminal**

3. Or reinstall Python:
   - Download from https://www.python.org/downloads/
   - Run installer
   - **Check "Add Python to PATH"**

---

## LibreOffice Issues

### LibreOffice conversion hangs or takes very long

**Symptom**: PPTX to PDF conversion seems stuck or takes 2-3 minutes

**Cause**:
- First run initializes LibreOffice components (slower)
- Background LibreOffice processes may be running
- Large or complex presentations take longer

**Solutions**:
1. **Wait patiently**: First conversion can take up to 3 minutes on Windows
2. **Close LibreOffice**: Close any open LibreOffice windows
3. **Kill background processes**:
   ```cmd
   taskkill /F /IM soffice.exe /IM soffice.bin
   ```
4. **Reduce DPI** for testing:
   ```cmd
   npm run ocr:convert -- presentation.pptx -o output --dpi 150
   ```

### "LibreOffice not found"

**Symptom**: Error: `LibreOffice executable not found`

**Cause**: LibreOffice not installed or not in PATH

**Solution**:
1. **Install LibreOffice**:
   - Download from https://www.libreoffice.org/download/
   - Or: `choco install libreoffice`
   - Or: `winget install LibreOffice.LibreOffice`

2. **Verify installation**:
   ```cmd
   # Check common locations
   "C:\Program Files\LibreOffice\program\soffice.exe" --version
   "C:\Program Files (x86)\LibreOffice\program\soffice.exe" --version
   ```

3. **Add to PATH** (if installed but not detected):
   - Find installation directory
   - Add to PATH environment variable (see [Environment Variables](#environment-variables))

### LibreOffice conversion fails with error

**Symptom**: Error during PPTX to PDF conversion

**Solutions**:
1. **Test the PPTX file**:
   - Open the file in LibreOffice Impress manually
   - If it opens successfully, try conversion again
   - If it fails to open, the file may be corrupted

2. **Try exporting to PDF manually**:
   - Open PPTX in LibreOffice
   - File → Export as PDF
   - If this works, but command-line doesn't, it may be a permissions issue

3. **Check file path**:
   - Ensure no special characters in path
   - Avoid paths with spaces (or use quotes)
   - Try copying file to a simple path like `C:\temp\test.pptx`

---

## poppler-utils Issues

### "pdftoppm not found"

**Symptom**: Error: `pdftoppm command not found` or `pdf2image.exceptions.PDFInfoNotInstalledError`

**Cause**: poppler-utils not installed or not in PATH

**Solution**:

1. **Download and install poppler-windows**:
   ```cmd
   # Using chocolatey (easiest)
   choco install poppler

   # Using scoop
   scoop install poppler

   # Manual installation:
   # 1. Download from: https://github.com/oschwartz10612/poppler-windows/releases/
   # 2. Extract to: C:\Program Files\poppler
   # 3. Add C:\Program Files\poppler\Library\bin to PATH
   ```

2. **Add to PATH**:
   - Search "Environment Variables" in Start Menu
   - Edit "Path" variable
   - Add the `bin` folder location (e.g., `C:\Program Files\poppler\Library\bin`)
   - **Restart terminal**

3. **Verify installation**:
   ```cmd
   pdftoppm -v
   # Should show version information
   ```

### Wrong poppler version

**Symptom**: `pdftoppm` exists but conversion fails

**Solution**:
1. Check version:
   ```cmd
   pdftoppm -v
   ```
2. Update to latest version (22.x or higher recommended)
3. Uninstall old version before installing new one

---

## Path and File Issues

### Paths with spaces

**Symptom**: Error when file path contains spaces: `C:\My Documents\presentation.pptx`

**Solution**:
```cmd
# Use quotes around the path
npm run ocr:convert -- "C:\My Documents\presentation.pptx" -o output

# Or use forward slashes (works on Windows)
npm run ocr:convert -- C:/My Documents/presentation.pptx -o output
```

### Backslash vs forward slash

**Issue**: Confusion about path separators on Windows

**Good to know**:
- Windows accepts both `\` and `/` in most contexts
- Node.js scripts prefer `/` (works cross-platform)
- Use `/` in commands for consistency:
  ```cmd
  # Both work, but forward slash is preferred
  npm run ocr:convert -- C:/Users/me/file.pptx -o output
  npm run ocr:convert -- C:\Users\me\file.pptx -o output
  ```

### Relative vs absolute paths

**Issue**: Commands fail with relative paths

**Solution**:
```cmd
# Absolute path (always works)
npm run ocr:convert -- C:/Users/me/Documents/slides.pptx -o output

# Relative path (use ./ or ../)
npm run ocr:convert -- ./slides.pptx -o output
npm run ocr:convert -- ../Documents/slides.pptx -o output
```

### Special characters in filenames

**Symptom**: Files with special characters (e.g., `Project (Final).pptx`) cause errors

**Solution**:
```cmd
# Use quotes
npm run ocr:convert -- "Project (Final).pptx" -o output

# Or rename file to remove special characters
ren "Project (Final).pptx" Project-Final.pptx
npm run ocr:convert -- Project-Final.pptx -o output
```

---

## Permission Issues

### "Access denied" errors

**Symptom**: Operations fail with permission errors

**Solutions**:

1. **Run as Administrator**:
   - Right-click Command Prompt or PowerShell
   - Select "Run as administrator"

2. **Check antivirus**:
   - Temporarily disable antivirus
   - Add Python, Node.js, and LibreOffice to exceptions
   - Some antivirus programs block script execution

3. **Check file permissions**:
   - Right-click file → Properties → Security
   - Ensure your user account has Read/Write permissions

4. **Use a different directory**:
   - Don't use system directories (e.g., `C:\Program Files\`)
   - Use your user directory (e.g., `C:\Users\<YourName>\Documents\`)

### Windows Defender blocking scripts

**Symptom**: Scripts fail to run or are deleted by Windows Defender

**Solution**:
1. Open Windows Security
2. Go to Virus & threat protection
3. Click "Manage settings"
4. Add exclusions for:
   - `C:\Users\<YourName>\AppData\Local\Programs\Python\`
   - Your workspace directory
   - Node.js installation directory

---

## Environment Variables

### Setting environment variables permanently

**How to set MISTRAL_API_KEY permanently**:

1. Search "Environment Variables" in Start Menu
2. Click "Edit the system environment variables"
3. Click "Environment Variables" button
4. Under "User variables", click "New"
5. Variable name: `MISTRAL_API_KEY`
6. Variable value: `your-actual-api-key`
7. Click OK on all dialogs
8. **Restart your terminal** (or restart Windows)

### Checking if environment variable is set

**Command Prompt**:
```cmd
echo %MISTRAL_API_KEY%
```

**PowerShell**:
```powershell
echo $env:MISTRAL_API_KEY
```

If it shows the variable name itself (not the value), it's not set.

### Temporary vs permanent environment variables

**Temporary (current session only)**:
```cmd
# Command Prompt
set MISTRAL_API_KEY=your-key

# PowerShell
$env:MISTRAL_API_KEY="your-key"
```

**Permanent** (survives terminal restart):
- Use the Environment Variables dialog (see above)
- Or use `setx` command:
  ```cmd
  setx MISTRAL_API_KEY "your-key"
  ```
  Note: `setx` requires opening a **new terminal** to see the change

---

## Command Line Issues

### Command Prompt vs PowerShell

**Key differences**:

| Feature | Command Prompt | PowerShell |
|---------|---------------|------------|
| Environment variables | `%VAR%` | `$env:VAR` |
| Set variable | `set VAR=value` | `$env:VAR="value"` |
| Path separator | `\` (but `/` works) | `\` (but `/` works) |
| Comments | `REM comment` | `# comment` |

**Recommendation**: Use PowerShell for better scripting support.

### Git Bash on Windows

**Good to know**:
- Git Bash emulates Unix environment
- Use Unix syntax: `export VAR="value"`
- Paths can use Unix style: `/c/Users/me/file.pptx`
- Windows paths work too: `C:/Users/me/file.pptx`

**Setting environment variable**:
```bash
export MISTRAL_API_KEY="your-key"
```

### npm scripts not working

**Symptom**: `npm run ocr:convert` fails with strange errors

**Solutions**:

1. **Update npm**:
   ```cmd
   npm install -g npm@latest
   ```

2. **Clear npm cache**:
   ```cmd
   npm cache clean --force
   ```

3. **Reinstall dependencies**:
   ```cmd
   npm run clean
   npm install
   ```

4. **Use full command**:
   ```cmd
   # Instead of npm script, use full command
   npx tsx scripts/ocr-convert-pptx.ts presentation.pptx -o output
   ```

---

## Quick Troubleshooting Checklist

Run through this checklist if you encounter issues:

- [ ] Python installed and in PATH (`python --version` works)
- [ ] pip installed and working (`pip --version` works)
- [ ] LibreOffice installed (`soffice --version` works or auto-detected)
- [ ] poppler-utils installed (`pdftoppm -v` works)
- [ ] Python packages installed (`npm run ocr:install` completed)
- [ ] Mistral API key set (`echo %MISTRAL_API_KEY%` shows key)
- [ ] Verification passes (`npm run ocr:verify` shows all green)
- [ ] Terminal restarted after setting environment variables
- [ ] No LibreOffice processes running in background
- [ ] File path has no special characters or spaces (or is quoted)
- [ ] Running from correct directory (workspace root)

---

## Getting Help

If you still have issues after trying the solutions above:

1. **Run verification script**:
   ```cmd
   npm run ocr:verify
   ```
   This provides detailed diagnostic information.

2. **Check detailed error messages**:
   - The tools provide platform-specific error messages
   - Follow the installation instructions in the error output

3. **Try a minimal test case**:
   ```cmd
   # Test with a small, simple PPTX file first
   npm run ocr:convert -- simple.pptx -o test-output --dpi 150
   ```

4. **Report issue**:
   - Include output from `npm run ocr:verify`
   - Include full error message
   - Mention Windows version
   - Mention Command Prompt vs PowerShell vs Git Bash
