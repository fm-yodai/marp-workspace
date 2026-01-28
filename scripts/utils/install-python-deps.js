#!/usr/bin/env node
/**
 * Cross-platform Python dependencies installer
 * Automatically detects pip and installs requirements
 */
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Check if a command is available
 */
async function checkCommand(cmd, args = ['--version']) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      shell: true,
      stdio: 'ignore',
      windowsHide: true,
    });

    child.on('error', () => resolve(false));
    child.on('close', (code) => resolve(code === 0));
  });
}

/**
 * Find pip executable
 */
async function findPip() {
  const platform = process.platform;

  // Try different pip commands based on platform
  const candidates =
    platform === 'win32'
      ? ['pip', 'pip3', 'py -m pip']
      : ['pip3', 'pip', 'python3 -m pip'];

  for (const candidate of candidates) {
    const [cmd, ...args] = candidate.split(' ');
    if (await checkCommand(cmd, [...args, '--version'])) {
      return candidate;
    }
  }

  return null;
}

/**
 * Install Python packages from requirements.txt
 */
async function installPackages() {
  console.log('🔍 Searching for pip...\n');

  const pip = await findPip();

  if (!pip) {
    console.error('❌ Error: pip not found\n');
    console.error('Please install Python 3.8+ with pip:');

    if (process.platform === 'win32') {
      console.error('  Windows:');
      console.error('    - Download from https://www.python.org/downloads/');
      console.error('    - Run installer and check "Add Python to PATH"');
      console.error('    - Or use chocolatey: choco install python');
    } else if (process.platform === 'darwin') {
      console.error('  macOS:');
      console.error('    - Using Homebrew: brew install python3');
    } else {
      console.error('  Linux:');
      console.error('    - Ubuntu/Debian: sudo apt-get install python3 python3-pip');
      console.error('    - Fedora: sudo yum install python3 python3-pip');
    }

    process.exit(1);
  }

  console.log(`✅ Found pip: ${pip}\n`);

  // Read requirements.txt
  const requirementsPath = join(__dirname, '..', 'utils', 'ocr', 'requirements.txt');
  let requirements;

  try {
    requirements = readFileSync(requirementsPath, 'utf-8');
  } catch (error) {
    console.error(`❌ Error: Could not read requirements.txt at ${requirementsPath}\n`);
    console.error(error.message);
    process.exit(1);
  }

  const packages = requirements
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));

  console.log('📦 Installing Python packages:');
  packages.forEach((pkg) => console.log(`   - ${pkg}`));
  console.log();

  // Build pip install command
  const [pipCmd, ...pipArgs] = pip.split(' ');
  const installArgs = [...pipArgs, 'install', ...packages];

  return new Promise((resolve, reject) => {
    console.log(`Running: ${pipCmd} ${installArgs.join(' ')}\n`);

    const child = spawn(pipCmd, installArgs, {
      shell: true,
      stdio: 'inherit',
      windowsHide: true,
    });

    child.on('error', (error) => {
      console.error('\n❌ Failed to run pip:', error.message);
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Python packages installed successfully!\n');
        console.log('Next steps:');
        console.log('  1. Set your Mistral API key:');

        if (process.platform === 'win32') {
          console.log('     CMD: set MISTRAL_API_KEY=your-key');
          console.log('     PowerShell: $env:MISTRAL_API_KEY="your-key"');
        } else {
          console.log('     export MISTRAL_API_KEY=your-key');
        }

        console.log('  2. Verify setup: npm run ocr:verify');
        console.log('  3. Convert PPTX: npm run ocr:convert -- slides.pptx -o output-name\n');
        resolve();
      } else {
        console.error(`\n❌ pip install failed with code ${code}\n`);
        reject(new Error(`pip exited with code ${code}`));
      }
    });
  });
}

// Run installer
installPackages().catch((error) => {
  console.error('Installation failed:', error);
  process.exit(1);
});
