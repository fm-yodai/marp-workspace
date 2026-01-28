import { spawn } from 'child_process';
import { findPythonExecutable } from './platform.js';

/**
 * Result from running a Python worker script
 */
export interface PythonWorkerResult {
  success: boolean;
  data?: any;
  error?: string;
  stdout?: string;
  stderr?: string;
}

/**
 * Options for running Python worker scripts
 */
export interface PythonWorkerOptions {
  /**
   * Timeout in milliseconds (default: 300000 = 5 minutes)
   */
  timeout?: number;

  /**
   * Working directory for the Python script
   */
  cwd?: string;

  /**
   * Environment variables to pass to the Python process
   */
  env?: NodeJS.ProcessEnv;

  /**
   * Whether to log stdout/stderr (default: false)
   */
  verbose?: boolean;
}

/**
 * Run a Python worker script with JSON communication
 *
 * The Python script should output JSON to stdout in the format:
 * {"success": true, "data": {...}} or {"success": false, "error": "..."}
 *
 * @param scriptPath - Path to the Python script
 * @param args - Arguments to pass to the script
 * @param options - Additional options
 * @returns Promise with the result
 */
export async function runPythonWorker(
  scriptPath: string,
  args: string[] = [],
  options: PythonWorkerOptions = {}
): Promise<PythonWorkerResult> {
  const {
    timeout = 300000, // 5 minutes default
    cwd,
    env = process.env,
    verbose = false,
  } = options;

  // Find Python executable
  const python = await findPythonExecutable();

  if (!python) {
    return {
      success: false,
      error: 'Python executable not found. Please install Python 3.8 or higher.',
    };
  }

  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const child = spawn(python, [scriptPath, ...args], {
      cwd,
      env,
      shell: true,
      windowsHide: true,
    });

    // Set timeout
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
      resolve({
        success: false,
        error: `Python worker timed out after ${timeout}ms`,
        stdout,
        stderr,
      });
    }, timeout);

    // Collect stdout
    child.stdout?.on('data', (data) => {
      const chunk = data.toString();
      stdout += chunk;
      if (verbose) {
        process.stdout.write(chunk);
      }
    });

    // Collect stderr
    child.stderr?.on('data', (data) => {
      const chunk = data.toString();
      stderr += chunk;
      if (verbose) {
        process.stderr.write(chunk);
      }
    });

    // Handle process exit
    child.on('close', (code) => {
      clearTimeout(timer);

      if (timedOut) {
        return; // Already resolved with timeout error
      }

      // Try to parse JSON output from stdout
      let result: PythonWorkerResult;

      try {
        // Look for the last valid JSON object in stdout
        // (Python scripts might have debug output before the final JSON)
        const lines = stdout.trim().split('\n');
        let jsonOutput: any = null;

        // Try to find JSON from the last line backwards
        for (let i = lines.length - 1; i >= 0; i--) {
          const line = lines[i].trim();
          if (line.startsWith('{') && line.endsWith('}')) {
            try {
              jsonOutput = JSON.parse(line);
              break;
            } catch {
              // Not valid JSON, try previous line
              continue;
            }
          }
        }

        if (jsonOutput) {
          result = {
            success: jsonOutput.success ?? false,
            data: jsonOutput.data,
            error: jsonOutput.error,
            stdout,
            stderr,
          };
        } else if (code === 0) {
          // No JSON found but exit code is 0
          result = {
            success: true,
            data: stdout.trim(),
            stdout,
            stderr,
          };
        } else {
          // No JSON and non-zero exit code
          result = {
            success: false,
            error: stderr || stdout || `Python worker exited with code ${code}`,
            stdout,
            stderr,
          };
        }
      } catch (parseError) {
        // JSON parsing failed
        result = {
          success: false,
          error: `Failed to parse Python worker output: ${parseError}\nOutput: ${stdout}`,
          stdout,
          stderr,
        };
      }

      resolve(result);
    });

    // Handle spawn errors
    child.on('error', (error) => {
      clearTimeout(timer);
      resolve({
        success: false,
        error: `Failed to spawn Python worker: ${error.message}`,
        stdout,
        stderr,
      });
    });
  });
}

/**
 * Check if Python is available on the system
 */
export async function isPythonAvailable(): Promise<boolean> {
  const python = await findPythonExecutable();
  return python !== null;
}

/**
 * Get the Python version string
 */
export async function getPythonVersion(): Promise<string | null> {
  const python = await findPythonExecutable();

  if (!python) {
    return null;
  }

  return new Promise((resolve) => {
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

    child.on('close', (code) => {
      if (code === 0) {
        // Extract version number from output like "Python 3.10.5"
        const match = output.match(/Python\s+(\d+\.\d+\.\d+)/);
        resolve(match ? match[1] : output.trim());
      } else {
        resolve(null);
      }
    });

    child.on('error', () => {
      resolve(null);
    });
  });
}
