#!/usr/bin/env node
/**
 * OCR-based PPTX to Marp conversion tool
 *
 * Converts PowerPoint presentations to Marp slide decks using Mistral Vision/OCR API
 */
import { Command } from 'commander';
import { spawn } from 'child_process';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { defaultConfig, validateConfig, ConversionStrategy, OCRConfig } from './utils/ocr/config.js';
import { generateMarpDeck, ProcessedSlide } from './utils/ocr/marp-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ConversionError extends Error {
  constructor(
    message: string,
    public phase: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ConversionError';
  }
}

/**
 * Spawn Python worker and return parsed JSON result
 */
async function runPythonWorker(
  scriptName: string,
  args: string[],
  spinner: ora.Ora
): Promise<any> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'utils', 'ocr', scriptName);
    const python = spawn('python3', [scriptPath, ...args]);

    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    python.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python worker failed: ${stderr || stdout}`));
        return;
      }

      try {
        const result = JSON.parse(stdout);
        if (!result.success) {
          reject(new Error(result.message || 'Unknown error'));
          return;
        }
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse worker output: ${stdout}`));
      }
    });

    python.on('error', (error) => {
      reject(new Error(`Failed to spawn Python worker: ${error.message}`));
    });
  });
}

/**
 * Convert PPTX to PNG images
 */
async function convertToImages(
  pptxPath: string,
  outputDir: string,
  dpi: number,
  spinner: ora.Ora
): Promise<string[]> {
  spinner.text = 'Converting PPTX to images...';

  try {
    const result = await runPythonWorker(
      'pptx-to-images.py',
      [pptxPath, outputDir, dpi.toString()],
      spinner
    );

    spinner.succeed(`Converted ${result.count} slides to images`);
    return result.images;
  } catch (error) {
    spinner.fail('Failed to convert PPTX to images');
    throw new ConversionError(
      error instanceof Error ? error.message : String(error),
      'image-conversion',
      { pptxPath, dpi }
    );
  }
}

/**
 * Process images with Mistral OCR
 */
async function processOCR(
  imagePaths: string[],
  apiKey: string,
  model: string,
  spinner: ora.Ora
): Promise<ProcessedSlide[]> {
  const slides: ProcessedSlide[] = [];

  for (let i = 0; i < imagePaths.length; i++) {
    const imagePath = imagePaths[i];
    spinner.text = `Processing slide ${i + 1}/${imagePaths.length} with OCR...`;

    try {
      const result = await runPythonWorker(
        'mistral-ocr.py',
        [imagePath, apiKey, model],
        spinner
      );

      slides.push({
        index: i,
        imagePath,
        markdown: result.markdown,
        dimensions: result.dimensions,
      });
    } catch (error) {
      spinner.warn(`Failed to process slide ${i + 1}, using image only`);

      // Fallback: use image without OCR text
      slides.push({
        index: i,
        imagePath,
        markdown: '',
        dimensions: { width: 1920, height: 1080 }, // Default dimensions
      });
    }
  }

  spinner.succeed(`Processed ${slides.length} slides with OCR`);
  return slides;
}

/**
 * Main conversion function
 */
async function convertPPTX(
  pptxPath: string,
  deckName: string,
  strategy: ConversionStrategy,
  config: OCRConfig,
  keepTemp: boolean
): Promise<void> {
  const spinner = ora('Starting conversion...').start();

  try {
    // Validate configuration
    validateConfig(config);

    // Verify input file exists
    const pptxAbsPath = path.resolve(pptxPath);
    try {
      await fs.access(pptxAbsPath);
    } catch {
      throw new ConversionError(
        `Input file not found: ${pptxPath}`,
        'validation'
      );
    }

    // Get file size
    const stats = await fs.stat(pptxAbsPath);
    const sizeMB = stats.size / (1024 * 1024);
    if (sizeMB > 100) {
      spinner.warn(`Large file detected (${sizeMB.toFixed(1)}MB). This may take a while...`);
    }

    // Create temporary directory for images
    const tempDir = path.join(
      '/tmp',
      `marp-ocr-${Date.now()}-${Math.random().toString(36).substring(7)}`
    );
    await fs.mkdir(tempDir, { recursive: true });

    spinner.text = 'Temporary directory created';

    try {
      // Step 1: Convert PPTX to images
      const imagePaths = await convertToImages(
        pptxAbsPath,
        tempDir,
        config.conversion.dpi,
        spinner
      );

      if (imagePaths.length === 0) {
        throw new ConversionError(
          'No slides were extracted from the PPTX file',
          'image-conversion'
        );
      }

      // Step 2: Process images with OCR
      const slides = await processOCR(
        imagePaths,
        config.mistral.apiKey,
        config.mistral.model,
        spinner
      );

      // Step 3: Generate Marp deck
      spinner.text = 'Generating Marp deck...';
      const workspaceRoot = path.resolve(__dirname, '..');
      await generateMarpDeck(
        slides,
        deckName,
        workspaceRoot,
        config,
        strategy,
        path.basename(pptxAbsPath)
      );

      spinner.succeed(`Generated Marp deck: decks/${deckName}/`);

      // Cleanup temporary files
      if (!keepTemp) {
        spinner.text = 'Cleaning up temporary files...';
        await fs.rm(tempDir, { recursive: true, force: true });
        spinner.succeed('Conversion complete!');
      } else {
        spinner.succeed(`Conversion complete! Temporary files kept at: ${tempDir}`);
      }

      // Print next steps
      console.log('\nNext steps:');
      console.log(`  cd decks/${deckName}`);
      console.log('  npm run dev          # Preview in browser');
      console.log('  npm run build:all    # Build all formats\n');
    } finally {
      // Ensure cleanup if not keeping temp files
      if (!keepTemp) {
        try {
          await fs.rm(tempDir, { recursive: true, force: true });
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  } catch (error) {
    spinner.fail('Conversion failed');

    if (error instanceof ConversionError) {
      console.error(`\nError in ${error.phase}:`);
      console.error(error.message);

      // Print helpful troubleshooting tips
      switch (error.phase) {
        case 'validation':
          console.error('\nTroubleshooting:');
          console.error('  - Check that the file path is correct');
          console.error('  - Ensure you have read permissions');
          break;
        case 'image-conversion':
          console.error('\nTroubleshooting:');
          console.error('  - Ensure LibreOffice is installed: sudo apt-get install libreoffice');
          console.error('  - Check that the PPTX file is not corrupted');
          console.error('  - Try opening the file in PowerPoint/LibreOffice first');
          break;
        case 'ocr':
          console.error('\nTroubleshooting:');
          console.error('  - Verify your Mistral API key is valid');
          console.error('  - Check your API quota and rate limits');
          console.error('  - Try again in a few moments');
          break;
      }

      if (error.details) {
        console.error('\nDetails:', error.details);
      }
    } else {
      console.error('\nUnexpected error:', error);
    }

    process.exit(1);
  }
}

/**
 * CLI program
 */
const program = new Command();

program
  .name('ocr-convert-pptx')
  .description('Convert PowerPoint presentations to Marp slide decks using OCR')
  .version('1.0.0')
  .argument('<pptx-file>', 'Path to PowerPoint file (.pptx)')
  .requiredOption('-o, --output <deck-name>', 'Output deck name (e.g., 2026-01_presentation)')
  .option(
    '-s, --strategy <type>',
    'Conversion strategy: background, hybrid, or reconstruction',
    'background'
  )
  .option('--dpi <number>', 'Image resolution (DPI)', '300')
  .option('--api-key <key>', 'Mistral API key (overrides MISTRAL_API_KEY env var)')
  .option('--theme <name>', 'Marp theme to use', 'default')
  .option('--keep-temp', 'Keep temporary files for debugging', false)
  .action(async (pptxFile: string, options) => {
    // Build configuration
    const config: OCRConfig = {
      ...defaultConfig,
      mistral: {
        ...defaultConfig.mistral,
        apiKey: options.apiKey || process.env.MISTRAL_API_KEY || '',
      },
      conversion: {
        dpi: parseInt(options.dpi),
        keepTempFiles: options.keepTemp,
      },
      marp: {
        size: '16:9',
        theme: options.theme,
      },
    };

    // Validate strategy
    const validStrategies: ConversionStrategy[] = ['background', 'hybrid', 'reconstruction'];
    if (!validStrategies.includes(options.strategy as ConversionStrategy)) {
      console.error(`Invalid strategy: ${options.strategy}`);
      console.error(`Valid strategies: ${validStrategies.join(', ')}`);
      process.exit(1);
    }

    await convertPPTX(
      pptxFile,
      options.output,
      options.strategy as ConversionStrategy,
      config,
      options.keepTemp
    );
  });

program.parse();
