#!/usr/bin/env node
/**
 * Cross-platform OCR setup verification script
 * Checks all dependencies and provides platform-specific installation instructions
 */
import ora from 'ora';
import { spawn } from 'child_process';
import {
  getPlatform,
  findPythonExecutable,
  findPipExecutable,
  findLibreOfficeExecutable,
  checkExecutable,
  getPythonInstallInstructions,
  getLibreOfficeInstallInstructions,
  getPopplerInstallInstructions,
  getEnvVarSetInstructions,
} from './utils/platform.js';

interface CheckResult {
  name: string;
  passed: boolean;
  message?: string;
  help?: string;
}

/**
 * Check if a Python package is installed
 */
async function checkPythonPackage(packageName: string, python: string): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(python, ['-c', `import ${packageName}`], {
      shell: true,
      stdio: 'ignore',
      windowsHide: true,
    });

    child.on('close', (code) => {
      resolve(code === 0);
    });

    child.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Check Node.js dependencies
 */
async function checkNodeDependencies(): Promise<CheckResult> {
  const spinner = ora('Checking Node.js dependencies...').start();

  try {
    // Try to import required packages
    const requiredPackages = ['commander', 'ora'];

    for (const pkg of requiredPackages) {
      try {
        await import(pkg);
      } catch {
        spinner.fail(`Node.js dependency check failed`);
        return {
          name: 'Node.js Dependencies',
          passed: false,
          message: `Missing package: ${pkg}`,
          help: 'Run: npm install',
        };
      }
    }

    spinner.succeed('Node.js dependencies installed');
    return {
      name: 'Node.js Dependencies',
      passed: true,
    };
  } catch (error) {
    spinner.fail('Node.js dependency check failed');
    return {
      name: 'Node.js Dependencies',
      passed: false,
      message: error instanceof Error ? error.message : String(error),
      help: 'Run: npm install',
    };
  }
}

/**
 * Check Python installation
 */
async function checkPython(): Promise<CheckResult> {
  const spinner = ora('Checking Python...').start();

  const python = await findPythonExecutable();

  if (!python) {
    spinner.fail('Python not found');
    return {
      name: 'Python',
      passed: false,
      message: 'Python 3.8+ not found',
      help: getPythonInstallInstructions(),
    };
  }

  // Get Python version
  const version = await new Promise<string>((resolve) => {
    const child = spawn(python, ['--version'], {
      shell: true,
      windowsHide: true,
    });

    let output = '';
    child.stdout?.on('data', (data) => {
      output += data.toString();
    });
    child.stderr?.on('data', (data) => {
      output += data.toString();
    });

    child.on('close', () => {
      resolve(output.trim());
    });
  });

  spinner.succeed(`Python found: ${version} (${python})`);
  return {
    name: 'Python',
    passed: true,
    message: version,
  };
}

/**
 * Check pip installation
 */
async function checkPip(): Promise<CheckResult> {
  const spinner = ora('Checking pip...').start();

  const pip = await findPipExecutable();

  if (!pip) {
    spinner.fail('pip not found');
    return {
      name: 'pip',
      passed: false,
      message: 'pip not found',
      help: getPythonInstallInstructions() + '\n\nOr install pip separately.',
    };
  }

  spinner.succeed(`pip found: ${pip}`);
  return {
    name: 'pip',
    passed: true,
  };
}

/**
 * Check LibreOffice installation
 */
async function checkLibreOffice(): Promise<CheckResult> {
  const spinner = ora('Checking LibreOffice...').start();

  const libreoffice = await findLibreOfficeExecutable();

  if (!libreoffice) {
    spinner.fail('LibreOffice not found');
    return {
      name: 'LibreOffice',
      passed: false,
      message: 'LibreOffice not found',
      help: getLibreOfficeInstallInstructions(),
    };
  }

  spinner.succeed(`LibreOffice found: ${libreoffice}`);
  return {
    name: 'LibreOffice',
    passed: true,
  };
}

/**
 * Check poppler-utils installation
 */
async function checkPoppler(): Promise<CheckResult> {
  const spinner = ora('Checking poppler-utils...').start();

  const hasPdftoppm = await checkExecutable('pdftoppm', ['-v']);

  if (!hasPdftoppm) {
    spinner.fail('poppler-utils not found');
    return {
      name: 'poppler-utils',
      passed: false,
      message: 'pdftoppm command not found',
      help: getPopplerInstallInstructions(),
    };
  }

  spinner.succeed('poppler-utils found');
  return {
    name: 'poppler-utils',
    passed: true,
  };
}

/**
 * Check Python packages
 */
async function checkPythonPackages(): Promise<CheckResult> {
  const spinner = ora('Checking Python packages...').start();

  const python = await findPythonExecutable();
  if (!python) {
    spinner.fail('Cannot check Python packages (Python not found)');
    return {
      name: 'Python Packages',
      passed: false,
      message: 'Python not available',
    };
  }

  const requiredPackages = [
    { import: 'mistralai', display: 'mistralai' },
    { import: 'PIL', display: 'Pillow' },
    { import: 'pdf2image', display: 'pdf2image' },
  ];

  const missing: string[] = [];

  for (const pkg of requiredPackages) {
    const installed = await checkPythonPackage(pkg.import, python);
    if (!installed) {
      missing.push(pkg.display);
    }
  }

  if (missing.length > 0) {
    spinner.fail('Some Python packages are missing');
    return {
      name: 'Python Packages',
      passed: false,
      message: `Missing: ${missing.join(', ')}`,
      help: 'Run: npm run ocr:install',
    };
  }

  spinner.succeed('All Python packages installed');
  return {
    name: 'Python Packages',
    passed: true,
  };
}

/**
 * Check Mistral API key
 */
async function checkApiKey(): Promise<CheckResult> {
  const spinner = ora('Checking Mistral API key...').start();

  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    spinner.fail('Mistral API key not set');
    return {
      name: 'Mistral API Key',
      passed: false,
      message: 'MISTRAL_API_KEY environment variable not set',
      help: getEnvVarSetInstructions('MISTRAL_API_KEY', 'your-api-key-here'),
    };
  }

  if (apiKey.length < 10) {
    spinner.warn('API key seems too short');
    return {
      name: 'Mistral API Key',
      passed: false,
      message: 'API key seems invalid (too short)',
      help: 'Get your API key from: https://console.mistral.ai/',
    };
  }

  spinner.succeed('Mistral API key configured');
  return {
    name: 'Mistral API Key',
    passed: true,
  };
}

/**
 * Main verification function
 */
async function verifySetup() {
  const platform = getPlatform();

  console.log(`\n🔍 Verifying OCR conversion setup on ${platform}...\n`);

  const results: CheckResult[] = [];

  // Run all checks
  results.push(await checkNodeDependencies());
  results.push(await checkPython());
  results.push(await checkPip());
  results.push(await checkLibreOffice());
  results.push(await checkPoppler());
  results.push(await checkPythonPackages());
  results.push(await checkApiKey());

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('VERIFICATION SUMMARY');
  console.log('='.repeat(60) + '\n');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  for (const result of results) {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}${result.message ? ` - ${result.message}` : ''}`);
  }

  console.log('\n' + '='.repeat(60));

  if (failed === 0) {
    console.log('✅ All checks passed! You are ready to convert PPTX files.\n');
    console.log('Usage:');
    console.log('  npm run ocr:convert -- presentation.pptx -o 2026-01_output\n');
    return 0;
  } else {
    console.log(`❌ ${failed} check(s) failed. Please fix the issues below:\n`);

    for (const result of results) {
      if (!result.passed && result.help) {
        console.log(`\n📋 ${result.name}:`);
        console.log(result.help);
      }
    }

    console.log('\nAfter installing dependencies, run this script again to verify:');
    console.log('  npm run ocr:verify\n');
    return 1;
  }
}

// Run verification
verifySetup()
  .then((code) => process.exit(code))
  .catch((error) => {
    console.error('\n❌ Verification failed with error:', error);
    process.exit(1);
  });
