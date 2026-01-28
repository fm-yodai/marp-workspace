import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const deckName = process.argv[2];
const format = process.argv[3] || 'all';

if (!deckName) {
  console.error('Usage: npm run build:deck -- <deck-name> [format]');
  console.error('');
  console.error('Formats:');
  console.error('  html      - Build HTML only');
  console.error('  pdf       - Build PDF only');
  console.error('  pptx      - Build PowerPoint only');
  console.error('  editable  - Build editable PowerPoint only');
  console.error('  all       - Build all formats (default)');
  console.error('');
  console.error('Example:');
  console.error('  npm run build:deck -- 2026-01_sample');
  console.error('  npm run build:deck -- 2026-01_sample pdf');
  process.exit(1);
}

// Check if deck exists
const deckPath = path.join(process.cwd(), 'decks', deckName);
if (!fs.existsSync(deckPath)) {
  console.error(`Error: Deck "${deckName}" does not exist`);
  console.error(`Path: ${deckPath}`);
  process.exit(1);
}

const formatMap: Record<string, string> = {
  html: 'build',
  pdf: 'build:pdf',
  pptx: 'build:pptx',
  editable: 'build:editable',
  all: 'build:all'
};

const script = formatMap[format];
if (!script) {
  console.error(`Error: Unknown format "${format}"`);
  console.error('Available formats: html, pdf, pptx, editable, all');
  process.exit(1);
}

console.log(`Building deck "${deckName}" (format: ${format})...`);

try {
  execSync(`npm run ${script} --workspace=decks/${deckName}`, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log(`✓ Build completed successfully`);
} catch (error) {
  console.error(`✗ Build failed`);
  process.exit(1);
}
