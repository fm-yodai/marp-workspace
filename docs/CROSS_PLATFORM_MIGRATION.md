# Cross-Platform Migration Guide

This document describes the cross-platform compatibility improvements made to the Marp workspace.

## Summary

The workspace has been updated to fully support Windows, macOS, and Linux. All tools now automatically detect the platform and use the appropriate commands and executables.

## What Changed

### New Files Created

1. **`scripts/utils/platform.ts`** - Platform detection and executable finding utilities
   - Detects current platform (Windows/macOS/Linux)
   - Finds Python, pip, and LibreOffice executables automatically
   - Provides platform-specific installation instructions
   - Handles temporary directory access cross-platform

2. **`scripts/utils/python-worker.ts`** - Unified Python script execution
   - Automatically finds Python executable
   - JSON communication protocol
   - Timeout and error handling
   - Works on all platforms

3. **`scripts/verify-ocr-setup.ts`** - TypeScript verification script
   - Replaces bash-only `verify-ocr-setup.sh`
   - Checks all dependencies
   - Provides platform-specific help
   - Works on Windows, macOS, and Linux

4. **`scripts/utils/install-python-deps.js`** - Cross-platform Python installer
   - Automatically detects pip command
   - Installs Python packages on all platforms
   - Provides helpful error messages

5. **`scripts/test-cross-platform.ts`** - Automated test suite
   - Tests platform detection
   - Tests executable finding
   - Tests path handling
   - Verifies cross-platform compatibility

6. **`.gitattributes`** - Line ending normalization
   - Ensures LF line endings for text files
   - Prevents CRLF issues on Windows
   - Marks binary files appropriately

7. **`docs/ocr-conversion/windows-troubleshooting.md`** - Windows troubleshooting guide
   - Common Windows issues and solutions
   - Path handling on Windows
   - Environment variable setup
   - Permission issues

### Files Modified

1. **`scripts/ocr-convert-pptx.ts`**
   - Replaced hardcoded `/tmp` with `getTempDir()`
   - Replaced hardcoded `python3` with `findPythonExecutable()`
   - Added platform-specific error messages
   - Uses new Python worker utility

2. **`scripts/utils/ocr/pptx-to-images.py`**
   - Added `find_libreoffice_command()` function
   - Auto-detects LibreOffice on Windows/macOS/Linux
   - Extended timeout for Windows (first run is slower)
   - Better error messages

3. **`package.json`**
   - Updated scripts to use cross-platform tools:
     - `ocr:install`: Now uses Node.js script instead of `pip3`
     - `ocr:verify`: Now uses TypeScript instead of bash
     - `clean`: Now uses `rimraf` instead of `rm -rf`
   - Added new dependencies: `rimraf`, `cross-env`
   - Added new test script: `test:cross-platform`

4. **`CLAUDE.md`**
   - Added "Platform-Specific Setup" section
   - Windows setup instructions
   - macOS setup instructions
   - Linux setup instructions
   - Common Windows issues and solutions

5. **`docs/ocr-conversion/installation.md`**
   - Split system dependencies by platform
   - Added Windows-specific instructions
   - Added verification script usage
   - Updated environment variable setup for all platforms

### Files Removed

1. **`scripts/verify-ocr-setup.sh`** - Replaced by TypeScript version
   - Old bash script only worked on Unix/Linux
   - New TypeScript version works on all platforms

## How It Works

### Platform Detection

The new `platform.ts` utility automatically detects the platform:

```typescript
import { getPlatform } from './utils/platform.js';

const platform = getPlatform(); // 'windows' | 'macos' | 'linux'
```

### Executable Finding

Instead of hardcoding commands, the tools now auto-detect executables:

```typescript
import { findPythonExecutable, findPipExecutable, findLibreOfficeExecutable } from './utils/platform.js';

const python = await findPythonExecutable();
// Returns: 'python3', 'python', or 'py' depending on platform

const pip = await findPipExecutable();
// Returns: 'pip3', 'pip', or 'py -m pip' depending on platform

const libreoffice = await findLibreOfficeExecutable();
// Returns: 'libreoffice', 'soffice', or full path on Windows
```

### Temporary Directory

Cross-platform temporary directory handling:

```typescript
import { getTempDir } from './utils/platform.js';

const tempDir = getTempDir();
// Returns: os.tmpdir() - works on all platforms
// Windows: C:\Users\<User>\AppData\Local\Temp
// macOS/Linux: /tmp
```

### Python Execution

Unified Python script execution:

```typescript
import { runPythonWorker } from './utils/python-worker.js';

const result = await runPythonWorker('script.py', ['arg1', 'arg2'], {
  timeout: 300000,
  verbose: false,
});

if (result.success) {
  console.log('Data:', result.data);
} else {
  console.error('Error:', result.error);
}
```

## Breaking Changes

### None for Users

All existing commands work exactly the same:

```bash
npm install
npm run ocr:install
npm run ocr:verify
npm run ocr:convert -- slides.pptx -o output
npm run create-deck
npm run clean
```

### For Contributors

When adding new code that interacts with the system:

**Do:**
- ✅ Use `getTempDir()` instead of `/tmp`
- ✅ Use `findPythonExecutable()` instead of `python3`
- ✅ Use `findPipExecutable()` instead of `pip3`
- ✅ Use `path.join()` for all path operations
- ✅ Use `runPythonWorker()` for running Python scripts
- ✅ Add `shell: true` and `windowsHide: true` to `spawn()` calls
- ✅ Provide platform-specific error messages

**Don't:**
- ❌ Hardcode `/tmp` or other Unix-specific paths
- ❌ Hardcode `python3`, `pip3`, or other Unix commands
- ❌ Use `rm -rf` in scripts (use `rimraf` package)
- ❌ Use bash-specific syntax in scripts
- ❌ Assume forward slashes work (use `path.join()`)

## Testing

### Automated Tests

Run the automated test suite:

```bash
npm run test:cross-platform
```

This tests:
- Platform detection
- Executable finding
- Temporary directory access
- Path handling
- Environment variables
- File system operations

### Manual Testing

Test on each platform:

1. **Clone and install**:
   ```bash
   git clone <repo>
   cd marp-workspace
   npm install
   ```

2. **Verify setup**:
   ```bash
   npm run ocr:verify
   ```

3. **Install Python dependencies**:
   ```bash
   npm run ocr:install
   ```

4. **Test conversion** (if API key and files available):
   ```bash
   npm run ocr:convert -- test.pptx -o test-output
   ```

5. **Test clean**:
   ```bash
   npm run clean
   npm install
   ```

## Platform-Specific Notes

### Windows

- Commands work in Command Prompt, PowerShell, and Git Bash
- Python is typically `python` or `py`, not `python3` (auto-detected)
- pip is typically `pip` or `py -m pip`, not `pip3` (auto-detected)
- LibreOffice is `soffice.exe` (auto-detected from common install locations)
- Environment variables set via "Environment Variables" dialog for persistence
- See `docs/ocr-conversion/windows-troubleshooting.md` for common issues

### macOS

- Python 3 is typically installed via Homebrew
- LibreOffice is in `/Applications/LibreOffice.app/`
- Use `brew install` for system dependencies
- Environment variables set in `~/.zshrc` (default shell)

### Linux

- Python 3 is typically pre-installed or available via package manager
- LibreOffice is available via package manager
- Use `apt-get`, `yum`, or `pacman` depending on distribution
- Environment variables set in `~/.bashrc`

## Dependencies Added

```json
{
  "devDependencies": {
    "rimraf": "^5.0.0",      // Cross-platform file deletion
    "cross-env": "^7.0.3"    // Cross-platform environment variables
  }
}
```

Total size: ~3MB (minimal impact)

## Verification

To verify the migration was successful:

```bash
# Install dependencies
npm install

# Run verification
npm run ocr:verify

# Run tests
npm run test:cross-platform
```

All checks should pass on Windows, macOS, and Linux.

## Rollback

If issues occur, the changes can be reverted:

```bash
git revert <commit-hash>
```

The old scripts were Unix-only, so rollback only works on Unix systems.

## Documentation Updates

Updated documentation:
- `CLAUDE.md`: Added platform-specific setup section
- `docs/ocr-conversion/installation.md`: Split by platform
- `docs/ocr-conversion/windows-troubleshooting.md`: New Windows guide

## Support

For issues:

1. Run `npm run ocr:verify` for diagnostics
2. Check `docs/ocr-conversion/windows-troubleshooting.md` (Windows)
3. Check `docs/ocr-conversion/installation.md` (all platforms)
4. Check error messages (now include platform-specific help)

## Credits

Migration completed: 2026-01-28

Platform support: Windows 10+, macOS 10.15+, Ubuntu 18.04+, Fedora 30+, Arch Linux
