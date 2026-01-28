#!/usr/bin/env node
/**
 * Cross-platform compatibility test suite
 * Tests platform detection, executable finding, and path handling
 */
import {
  getPlatform,
  getTempDir,
  findPythonExecutable,
  findPipExecutable,
  findLibreOfficeExecutable,
  checkExecutable,
} from './utils/platform.js';
import { isPythonAvailable, getPythonVersion } from './utils/python-worker.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
  error?: string;
}

const results: TestResult[] = [];

/**
 * Run a test and record the result
 */
async function test(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`✅ ${name}`);
  } catch (error) {
    results.push({
      name,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
    });
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Assert that a condition is true
 */
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Main test suite
 */
async function runTests() {
  console.log('🧪 Running cross-platform compatibility tests\n');

  // Test 1: Platform detection
  await test('Platform detection', async () => {
    const platform = getPlatform();
    assert(
      ['windows', 'macos', 'linux'].includes(platform),
      `Expected platform to be windows/macos/linux, got ${platform}`
    );
    console.log(`   Detected platform: ${platform}`);
  });

  // Test 2: Temp directory access
  await test('Temp directory access', async () => {
    const tempDir = getTempDir();
    assert(typeof tempDir === 'string' && tempDir.length > 0, 'Temp directory path is empty');

    // Verify it exists
    const stats = await fs.stat(tempDir);
    assert(stats.isDirectory(), 'Temp directory is not a directory');

    // Verify we can write to it
    const testFile = path.join(tempDir, `test-${Date.now()}.txt`);
    await fs.writeFile(testFile, 'test');
    await fs.unlink(testFile);

    console.log(`   Temp directory: ${tempDir}`);
  });

  // Test 3: Path handling
  await test('Path handling', async () => {
    const platform = getPlatform();

    // Test that path.join works correctly
    const joined = path.join('a', 'b', 'c');
    assert(joined.includes('a') && joined.includes('b') && joined.includes('c'), 'path.join failed');

    // Test temp directory with path.join
    const tempPath = path.join(getTempDir(), 'test-dir', 'test-file.txt');
    assert(typeof tempPath === 'string' && tempPath.length > 0, 'Combined path is empty');

    console.log(`   Path separator: ${path.sep}`);
    console.log(`   Sample path: ${tempPath}`);
  });

  // Test 4: Python detection
  await test('Python executable detection', async () => {
    const python = await findPythonExecutable();
    assert(python !== null, 'Python executable not found');
    console.log(`   Found Python: ${python}`);
  });

  // Test 5: Python availability check
  await test('Python availability', async () => {
    const available = await isPythonAvailable();
    assert(available, 'Python not available');
  });

  // Test 6: Python version
  await test('Python version', async () => {
    const version = await getPythonVersion();
    assert(version !== null, 'Could not get Python version');
    console.log(`   Python version: ${version}`);
  });

  // Test 7: pip detection
  await test('pip executable detection', async () => {
    const pip = await findPipExecutable();
    assert(pip !== null, 'pip executable not found');
    console.log(`   Found pip: ${pip}`);
  });

  // Test 8: LibreOffice detection (optional, may not be installed)
  await test('LibreOffice executable detection (optional)', async () => {
    const libreoffice = await findLibreOfficeExecutable();
    if (libreoffice) {
      console.log(`   Found LibreOffice: ${libreoffice}`);
    } else {
      console.log('   LibreOffice not found (optional dependency)');
    }
    // Don't fail test if not found
  });

  // Test 9: Command execution
  await test('Command execution', async () => {
    const platform = getPlatform();
    const testCmd = platform === 'windows' ? 'cmd' : 'echo';
    const testArgs = platform === 'windows' ? ['/c', 'echo test'] : ['test'];

    const result = await checkExecutable(testCmd, testArgs);
    assert(result, `Failed to execute test command: ${testCmd}`);
  });

  // Test 10: Environment variables
  await test('Environment variable access', async () => {
    const testVar = 'TEST_CROSS_PLATFORM_VAR';
    const testValue = 'test-value-12345';

    // Set test environment variable
    process.env[testVar] = testValue;

    // Read it back
    const readValue = process.env[testVar];
    assert(readValue === testValue, 'Environment variable read/write failed');

    // Clean up
    delete process.env[testVar];
  });

  // Test 11: File system operations
  await test('File system operations', async () => {
    const tempDir = getTempDir();
    const testDir = path.join(tempDir, `test-fs-${Date.now()}`);

    // Create directory
    await fs.mkdir(testDir, { recursive: true });

    // Write file
    const testFile = path.join(testDir, 'test.txt');
    await fs.writeFile(testFile, 'test content');

    // Read file
    const content = await fs.readFile(testFile, 'utf-8');
    assert(content === 'test content', 'File content mismatch');

    // Clean up
    await fs.rm(testDir, { recursive: true, force: true });
  });

  // Test 12: OS information
  await test('OS information', async () => {
    const platform = os.platform();
    const arch = os.arch();
    const release = os.release();

    assert(typeof platform === 'string', 'OS platform is not a string');
    assert(typeof arch === 'string', 'OS arch is not a string');
    assert(typeof release === 'string', 'OS release is not a string');

    console.log(`   OS: ${platform} ${release} (${arch})`);
  });

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  console.log(`\nTotal:  ${total} tests`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);

  if (failed > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('FAILED TESTS');
    console.log('='.repeat(60));

    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`\n❌ ${r.name}`);
        if (r.error) {
          console.log(`   ${r.error}`);
        }
      });
  }

  console.log('\n' + '='.repeat(60));

  if (failed === 0) {
    console.log('✅ All tests passed! Cross-platform compatibility verified.\n');
    return 0;
  } else {
    console.log('❌ Some tests failed. Please review the errors above.\n');
    return 1;
  }
}

// Run tests
runTests()
  .then((exitCode) => {
    process.exit(exitCode);
  })
  .catch((error) => {
    console.error('\n❌ Test suite failed with error:', error);
    process.exit(1);
  });
