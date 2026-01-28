import { spawn } from 'child_process';
import * as os from 'os';
import * as path from 'path';

/**
 * Platform types supported by this utility
 */
export type Platform = 'windows' | 'macos' | 'linux' | 'unknown';

/**
 * Get the current platform
 */
export function getPlatform(): Platform {
  const platform = os.platform();

  if (platform === 'win32') return 'windows';
  if (platform === 'darwin') return 'macos';
  if (platform === 'linux') return 'linux';

  return 'unknown';
}

/**
 * Get the platform-specific temporary directory
 */
export function getTempDir(): string {
  return os.tmpdir();
}

/**
 * Check if a command is available on the system
 */
export async function checkExecutable(
  command: string,
  args: string[] = ['--version'],
  timeout: number = 5000
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const child = spawn(command, args, {
        shell: true,
        stdio: 'ignore',
        windowsHide: true,
      });

      const timer = setTimeout(() => {
        child.kill();
        resolve(false);
      }, timeout);

      child.on('error', () => {
        clearTimeout(timer);
        resolve(false);
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        resolve(code === 0);
      });
    } catch {
      resolve(false);
    }
  });
}

/**
 * Find Python executable on the system
 * Tries: python3, python, py (Windows)
 */
export async function findPythonExecutable(): Promise<string | null> {
  const platform = getPlatform();

  // Order of preference based on platform
  const candidates = platform === 'windows'
    ? ['python', 'python3', 'py']
    : ['python3', 'python'];

  for (const candidate of candidates) {
    if (await checkExecutable(candidate, ['--version'])) {
      return candidate;
    }
  }

  return null;
}

/**
 * Find pip executable on the system
 * Tries: pip3, pip, py -m pip (Windows)
 */
export async function findPipExecutable(): Promise<string | null> {
  const platform = getPlatform();

  // Check standard pip commands
  const candidates = platform === 'windows'
    ? ['pip', 'pip3']
    : ['pip3', 'pip'];

  for (const candidate of candidates) {
    if (await checkExecutable(candidate, ['--version'])) {
      return candidate;
    }
  }

  // Try 'py -m pip' on Windows as a fallback
  if (platform === 'windows') {
    if (await checkExecutable('py', ['-m', 'pip', '--version'])) {
      return 'py -m pip';
    }
  }

  // Try 'python -m pip' as a last resort
  const python = await findPythonExecutable();
  if (python) {
    if (await checkExecutable(python, ['-m', 'pip', '--version'])) {
      return `${python} -m pip`;
    }
  }

  return null;
}

/**
 * Find LibreOffice executable on the system
 */
export async function findLibreOfficeExecutable(): Promise<string | null> {
  const platform = getPlatform();

  let candidates: string[] = [];

  switch (platform) {
    case 'windows':
      candidates = [
        'soffice.exe',
        'soffice',
        'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
        'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
      ];
      break;

    case 'macos':
      candidates = [
        '/Applications/LibreOffice.app/Contents/MacOS/soffice',
        'libreoffice',
        'soffice',
      ];
      break;

    case 'linux':
      candidates = [
        'libreoffice',
        'soffice',
      ];
      break;
  }

  for (const candidate of candidates) {
    if (await checkExecutable(candidate, ['--version'])) {
      return candidate;
    }
  }

  return null;
}

/**
 * Get platform-specific installation instructions for Python
 */
export function getPythonInstallInstructions(): string {
  const platform = getPlatform();

  switch (platform) {
    case 'windows':
      return `Windows:
  1. Download from https://www.python.org/downloads/
  2. Run installer and check "Add Python to PATH"
  3. Or use chocolatey: choco install python
  4. Or use scoop: scoop install python`;

    case 'macos':
      return `macOS:
  1. Using Homebrew: brew install python3
  2. Or download from https://www.python.org/downloads/`;

    case 'linux':
      return `Linux:
  1. Ubuntu/Debian: sudo apt-get install python3 python3-pip
  2. Fedora/RHEL: sudo yum install python3 python3-pip
  3. Arch: sudo pacman -S python python-pip`;

    default:
      return 'Please install Python 3.8 or higher from https://www.python.org/downloads/';
  }
}

/**
 * Get platform-specific installation instructions for LibreOffice
 */
export function getLibreOfficeInstallInstructions(): string {
  const platform = getPlatform();

  switch (platform) {
    case 'windows':
      return `Windows:
  1. Download from https://www.libreoffice.org/download/
  2. Run installer
  3. Ensure LibreOffice is in PATH or use full path
  4. Or use chocolatey: choco install libreoffice`;

    case 'macos':
      return `macOS:
  1. Download from https://www.libreoffice.org/download/
  2. Or use Homebrew: brew install --cask libreoffice`;

    case 'linux':
      return `Linux:
  1. Ubuntu/Debian: sudo apt-get install libreoffice
  2. Fedora/RHEL: sudo yum install libreoffice
  3. Arch: sudo pacman -S libreoffice-fresh`;

    default:
      return 'Please install LibreOffice from https://www.libreoffice.org/download/';
  }
}

/**
 * Get platform-specific installation instructions for poppler-utils
 */
export function getPopplerInstallInstructions(): string {
  const platform = getPlatform();

  switch (platform) {
    case 'windows':
      return `Windows:
  1. Download from https://github.com/oschwartz10612/poppler-windows/releases/
  2. Extract and add to PATH
  3. Or use chocolatey: choco install poppler
  4. Or use scoop: scoop install poppler`;

    case 'macos':
      return `macOS:
  Using Homebrew: brew install poppler`;

    case 'linux':
      return `Linux:
  1. Ubuntu/Debian: sudo apt-get install poppler-utils
  2. Fedora/RHEL: sudo yum install poppler-utils
  3. Arch: sudo pacman -S poppler`;

    default:
      return 'Please install poppler-utils for your platform';
  }
}

/**
 * Get platform-specific environment variable setting instructions
 */
export function getEnvVarSetInstructions(varName: string, example: string = 'your-value'): string {
  const platform = getPlatform();

  switch (platform) {
    case 'windows':
      return `Windows:
  Command Prompt: set ${varName}=${example}
  PowerShell: $env:${varName}="${example}"

  For permanent setting:
  1. Search "Environment Variables" in Start Menu
  2. Click "Edit the system environment variables"
  3. Click "Environment Variables" button
  4. Add new user or system variable: ${varName}=${example}`;

    case 'macos':
    case 'linux':
      return `Unix/Linux/macOS:
  Temporary: export ${varName}="${example}"

  Permanent (add to ~/.bashrc or ~/.zshrc):
  echo 'export ${varName}="${example}"' >> ~/.bashrc
  source ~/.bashrc`;

    default:
      return `Set environment variable ${varName}=${example}`;
  }
}
