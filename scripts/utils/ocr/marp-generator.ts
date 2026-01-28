/**
 * Generate Marp deck from OCR results
 */
import fs from 'fs/promises';
import path from 'path';
import { OCRConfig, ConversionStrategy } from './config.js';

export interface ProcessedSlide {
  index: number;
  imagePath: string;
  markdown: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface MarpDeckMetadata {
  originalFile: string;
  conversionDate: string;
  strategy: ConversionStrategy;
  slideCount: number;
  model: string;
}

/**
 * Generate Marp deck from processed slides
 */
export async function generateMarpDeck(
  slides: ProcessedSlide[],
  deckName: string,
  outputDir: string,
  config: OCRConfig,
  strategy: ConversionStrategy,
  originalFile: string
): Promise<void> {
  // Create deck directory structure
  const deckDir = path.join(outputDir, 'decks', deckName);
  const assetsDir = path.join(deckDir, 'assets');
  const contextDir = path.join(deckDir, 'context');

  await fs.mkdir(assetsDir, { recursive: true });
  await fs.mkdir(contextDir, { recursive: true });

  // Copy images to assets directory
  for (const slide of slides) {
    const filename = path.basename(slide.imagePath);
    const destPath = path.join(assetsDir, filename);
    await fs.copyFile(slide.imagePath, destPath);
  }

  // Generate deck.md based on strategy
  let deckContent: string;
  switch (strategy) {
    case 'background':
      deckContent = generateBackgroundDeck(slides, config);
      break;
    case 'hybrid':
      deckContent = generateHybridDeck(slides, config);
      break;
    case 'reconstruction':
      deckContent = generateReconstructionDeck(slides, config);
      break;
    default:
      throw new Error(`Unknown strategy: ${strategy}`);
  }

  await fs.writeFile(path.join(deckDir, 'deck.md'), deckContent, 'utf-8');

  // Generate package.json
  const packageJson = {
    name: deckName,
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'marp -p -w deck.md',
      build: 'marp deck.md -o dist/deck.html',
      'build:pdf': 'marp deck.md --pdf -o dist/deck.pdf',
      'build:pptx': 'marp deck.md --pptx -o dist/deck.pptx',
      'build:all': 'npm run build && npm run build:pdf && npm run build:pptx',
    },
  };

  await fs.writeFile(
    path.join(deckDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf-8'
  );

  // Generate .marprc
  const marprc = `themeSet:
  - ../../shared/themes
  - ./themes
allowLocalFiles: true
`;

  await fs.writeFile(path.join(deckDir, '.marprc'), marprc, 'utf-8');

  // Generate .gitignore
  const gitignore = `dist/
node_modules/
*.log
`;

  await fs.writeFile(path.join(deckDir, '.gitignore'), gitignore, 'utf-8');

  // Save OCR metadata
  const metadata: MarpDeckMetadata = {
    originalFile,
    conversionDate: new Date().toISOString(),
    strategy,
    slideCount: slides.length,
    model: config.mistral.model,
  };

  await fs.writeFile(
    path.join(contextDir, 'ocr-metadata.json'),
    JSON.stringify({ metadata, slides }, null, 2),
    'utf-8'
  );

  // Generate context files
  const backgroundMd = `# Presentation Background

This presentation was automatically converted from a PowerPoint file using OCR technology.

## Conversion Details

- **Original File:** ${originalFile}
- **Conversion Date:** ${new Date().toLocaleDateString()}
- **Strategy:** ${strategy}
- **Number of Slides:** ${slides.length}
- **OCR Model:** ${config.mistral.model}

## Editing Notes

${
  strategy === 'background'
    ? 'This deck uses background images only. To make text editable, re-convert using the "hybrid" or "reconstruction" strategy.'
    : strategy === 'hybrid'
      ? 'This deck combines background images with text overlays. You can edit the text while maintaining visual reference to the original design.'
      : 'This deck is fully reconstructed in Markdown. All text is editable, and layout has been interpreted from the original slides.'
}

## Next Steps

1. Review the generated slides for accuracy
2. Edit and refine the content as needed
3. Customize the theme if desired
4. Add speaker notes in this directory
`;

  await fs.writeFile(
    path.join(contextDir, 'background.md'),
    backgroundMd,
    'utf-8'
  );

  const notesMd = `# Presentation Notes

Add your speaker notes and additional context here.

## Ideas

-

## TODOs

- [ ] Review all slides for OCR accuracy
- [ ] Update branding/theme if needed
- [ ] Add speaker notes
- [ ] Test PDF export

## References

-
`;

  await fs.writeFile(path.join(contextDir, 'notes.md'), notesMd, 'utf-8');
}

/**
 * Generate deck with background images only (Strategy A)
 */
function generateBackgroundDeck(
  slides: ProcessedSlide[],
  config: OCRConfig
): string {
  const frontMatter = `---
marp: true
theme: ${config.marp.theme}
size: ${config.marp.size}
paginate: true
---

`;

  const slideContents = slides
    .map((slide, idx) => {
      const filename = path.basename(slide.imagePath);
      // First slide shouldn't have separator
      const separator = idx === 0 ? '' : '---\n\n';
      return `${separator}![bg](./assets/${filename})`;
    })
    .join('\n\n');

  return frontMatter + slideContents + '\n';
}

/**
 * Generate deck with hybrid overlay (Strategy B)
 */
function generateHybridDeck(
  slides: ProcessedSlide[],
  config: OCRConfig
): string {
  const frontMatter = `---
marp: true
theme: ${config.marp.theme}
size: ${config.marp.size}
paginate: true
---

`;

  const slideContents = slides
    .map((slide, idx) => {
      const filename = path.basename(slide.imagePath);
      const separator = idx === 0 ? '' : '---\n\n';

      // If slide has extracted text, add it as overlay
      if (slide.markdown.trim()) {
        return `${separator}![bg opacity:0.3](./assets/${filename})

<!-- _class: overlay-slide -->

${slide.markdown}`;
      } else {
        // No text extracted, use background only
        return `${separator}![bg](./assets/${filename})`;
      }
    })
    .join('\n\n');

  return frontMatter + slideContents + '\n';
}

/**
 * Generate fully reconstructed deck (Strategy C)
 */
function generateReconstructionDeck(
  slides: ProcessedSlide[],
  config: OCRConfig
): string {
  const frontMatter = `---
marp: true
theme: ${config.marp.theme}
size: ${config.marp.size}
paginate: true
---

`;

  const slideContents = slides
    .map((slide, idx) => {
      const separator = idx === 0 ? '' : '---\n\n';

      // Use extracted markdown directly
      if (slide.markdown.trim()) {
        return `${separator}${slide.markdown}`;
      } else {
        // Empty slide
        return `${separator}<!-- Empty slide -->`;
      }
    })
    .join('\n\n');

  return frontMatter + slideContents + '\n';
}
