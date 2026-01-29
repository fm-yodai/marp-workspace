#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { promptDeckCreation } from './utils/prompts.js';
import { getExistingDecks, hasCustomThemes, copyDirectory } from './utils/template.js';
import { parseFrontMatter, stringifyFrontMatter } from './utils/frontmatter.js';
import {
  createDeckCommand,
  parseArgs,
  isNonInteractiveMode,
} from './utils/cli-parser.js';
import {
  DeckCliArgs,
  loadDeckFromConfig,
  parseDeckFromArgs,
  validateDeckNotExists,
  validateTemplateExists,
  formatDeckErrorMessage,
  formatDeckSuccessMessage,
} from './utils/non-interactive-deck.js';

const WORKSPACE_ROOT = process.cwd();
const DECKS_DIR = path.join(WORKSPACE_ROOT, 'decks');
const TEMPLATES_DIR = path.join(WORKSPACE_ROOT, 'templates');

/**
 * インタラクティブモードの実行
 */
async function runInteractive() {
  console.log('🎨 Marp Deck Generator\n');

  // Get existing decks (excluding 000_template)
  const allDecks = await getExistingDecks(DECKS_DIR);
  const existingDecks = allDecks.filter(deck => deck !== '000_template');

  // Prompt user for deck configuration
  const answers = await promptDeckCreation(existingDecks);
  const { deckName, templateSource, deckTitle, inheritScripts } = answers;

  const deckPath = path.join(DECKS_DIR, deckName);
  const templatePath = templateSource === 'default'
    ? path.join(TEMPLATES_DIR, 'default')
    : path.join(DECKS_DIR, templateSource);

  console.log(`\n📁 Creating deck: ${deckName}`);
  console.log(`📋 Template source: ${templateSource}`);
  console.log(`📝 Title: ${deckTitle}\n`);

  try {
    // 1. Create deck directory
    await fs.mkdir(deckPath, { recursive: true });

    // 2. Copy template files
    if (templateSource === 'default') {
      // Copy from default template
      await copyTemplateFiles(templatePath, deckPath, deckName, deckTitle);
    } else {
      // Copy from existing deck
      await copyFromExistingDeck(templatePath, deckPath, deckName, deckTitle, inheritScripts);
    }

    // 3. Create context directory
    await createContextDirectory(deckPath);

    console.log('\n✅ Deck created successfully!\n');
    console.log('Next steps:');
    console.log(`  cd decks/${deckName}`);
    console.log(`  npm run dev           # Start development with preview`);
    console.log(`  npm run build:all     # Build all formats\n`);
    console.log('Or from workspace root:');
    console.log(`  npm run build:deck -- ${deckName}\n`);

  } catch (error) {
    console.error('\n❌ Error creating deck:', error);
    process.exit(1);
  }
}

async function copyTemplateFiles(
  templatePath: string,
  deckPath: string,
  deckName: string,
  deckTitle: string
) {
  // Copy .marprc
  const marprcContent = await fs.readFile(path.join(templatePath, '.marprc'), 'utf-8');
  await fs.writeFile(path.join(deckPath, '.marprc'), marprcContent);

  // Copy .gitignore
  const gitignoreContent = await fs.readFile(path.join(templatePath, '.gitignore'), 'utf-8');
  await fs.writeFile(path.join(deckPath, '.gitignore'), gitignoreContent);

  // Create package.json with replaced deck name
  const packageJsonContent = await fs.readFile(path.join(templatePath, 'package.json'), 'utf-8');
  const packageJson = packageJsonContent.replace(/{{DECK_NAME}}/g, deckName);
  await fs.writeFile(path.join(deckPath, 'package.json'), packageJson);

  // Copy and customize deck.md
  const deckMdContent = await fs.readFile(path.join(templatePath, 'deck.md'), 'utf-8');
  const customizedDeck = deckMdContent
    .replace(/{{DECK_TITLE}}/g, deckTitle)
    .replace(/{{DATE}}/g, new Date().toLocaleDateString('ja-JP'));
  await fs.writeFile(path.join(deckPath, 'deck.md'), customizedDeck);

  // Copy assets directory
  const assetsPath = path.join(deckPath, 'assets');
  await fs.mkdir(assetsPath, { recursive: true });
  const assetsReadme = await fs.readFile(path.join(templatePath, 'assets/README.md'), 'utf-8');
  await fs.writeFile(path.join(assetsPath, 'README.md'), assetsReadme);

  // Create dist directory
  await fs.mkdir(path.join(deckPath, 'dist'), { recursive: true });
}

async function copyFromExistingDeck(
  templatePath: string,
  deckPath: string,
  deckName: string,
  deckTitle: string,
  inheritScripts: boolean
) {
  // Copy package.json (with or without script inheritance)
  if (inheritScripts && await fileExists(path.join(templatePath, 'package.json'))) {
    const packageJsonContent = await fs.readFile(path.join(templatePath, 'package.json'), 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    packageJson.name = `@marp-workspace/${deckName}`;
    delete packageJson.devDependencies; // Remove dependencies (inherited from workspace)
    await fs.writeFile(path.join(deckPath, 'package.json'), JSON.stringify(packageJson, null, 2));
  } else {
    // Use default package.json
    const defaultPackageJson = await fs.readFile(
      path.join(TEMPLATES_DIR, 'default/package.json'),
      'utf-8'
    );
    const packageJson = defaultPackageJson.replace(/{{DECK_NAME}}/g, deckName);
    await fs.writeFile(path.join(deckPath, 'package.json'), packageJson);
  }

  // Copy .marprc if exists, otherwise use default
  if (await fileExists(path.join(templatePath, '.marprc'))) {
    await fs.copyFile(path.join(templatePath, '.marprc'), path.join(deckPath, '.marprc'));
  } else {
    const defaultMarprc = await fs.readFile(path.join(TEMPLATES_DIR, 'default/.marprc'), 'utf-8');
    await fs.writeFile(path.join(deckPath, '.marprc'), defaultMarprc);
  }

  // Copy .gitignore
  const defaultGitignore = await fs.readFile(path.join(TEMPLATES_DIR, 'default/.gitignore'), 'utf-8');
  await fs.writeFile(path.join(deckPath, '.gitignore'), defaultGitignore);

  // Copy and customize deck.md with inherited front matter
  const templateDeckMd = await fs.readFile(path.join(templatePath, 'deck.md'), 'utf-8');
  const frontMatter = parseFrontMatter(templateDeckMd);

  // Read default template content
  const defaultDeckMd = await fs.readFile(path.join(TEMPLATES_DIR, 'default/deck.md'), 'utf-8');
  const defaultContent = defaultDeckMd.split('---').slice(2).join('---').trim();

  // Customize content
  const customizedContent = defaultContent
    .replace(/{{DECK_TITLE}}/g, deckTitle)
    .replace(/{{DATE}}/g, new Date().toLocaleDateString('ja-JP'));

  const newDeckMd = stringifyFrontMatter(frontMatter, customizedContent);
  await fs.writeFile(path.join(deckPath, 'deck.md'), newDeckMd);

  // Copy assets if exists
  if (await fileExists(path.join(templatePath, 'assets'))) {
    await copyDirectory(path.join(templatePath, 'assets'), path.join(deckPath, 'assets'));
  } else {
    await fs.mkdir(path.join(deckPath, 'assets'), { recursive: true });
    const assetsReadme = await fs.readFile(
      path.join(TEMPLATES_DIR, 'default/assets/README.md'),
      'utf-8'
    );
    await fs.writeFile(path.join(deckPath, 'assets/README.md'), assetsReadme);
  }

  // Copy custom themes if exists
  if (await hasCustomThemes(templatePath)) {
    await copyDirectory(path.join(templatePath, 'themes'), path.join(deckPath, 'themes'));
  }

  // Create dist directory
  await fs.mkdir(path.join(deckPath, 'dist'), { recursive: true });
}

async function createContextDirectory(deckPath: string) {
  const contextPath = path.join(deckPath, 'context');
  await fs.mkdir(contextPath, { recursive: true });

  // Copy context files from default template
  const contextTemplatePath = path.join(TEMPLATES_DIR, 'default/context');

  const readmeContent = await fs.readFile(path.join(contextTemplatePath, 'README.md'), 'utf-8');
  await fs.writeFile(path.join(contextPath, 'README.md'), readmeContent);

  const backgroundContent = await fs.readFile(path.join(contextTemplatePath, 'background.md'), 'utf-8');
  await fs.writeFile(path.join(contextPath, 'background.md'), backgroundContent);

  const notesContent = await fs.readFile(path.join(contextTemplatePath, 'notes.md'), 'utf-8');
  await fs.writeFile(path.join(contextPath, 'notes.md'), notesContent);
}

async function fileExists(filePath: string): Promise<boolean> {
  return fs.access(filePath).then(() => true).catch(() => false);
}

/**
 * 非インタラクティブモードの実行
 */
async function runNonInteractive(args: DeckCliArgs) {
  const isConfigMode = !!args.config;

  try {
    let config: {
      name: string;
      title: string;
      template: string;
      inheritScripts: boolean;
    };

    // 設定ファイルまたはコマンドライン引数からデータを読み込み
    if (isConfigMode) {
      console.log(`📄 設定ファイルを読み込み中: ${args.config}\n`);
      const loadedConfig = await loadDeckFromConfig(args.config!);
      config = {
        name: loadedConfig.name,
        title: loadedConfig.title,
        template: loadedConfig.template || 'default',
        inheritScripts: loadedConfig.inheritScripts || false,
      };
    } else {
      const parsedConfig = parseDeckFromArgs(args);
      config = {
        name: parsedConfig.name,
        title: parsedConfig.title,
        template: parsedConfig.template || 'default',
        inheritScripts: parsedConfig.inheritScripts || false,
      };
    }

    // デッキの重複確認
    await validateDeckNotExists(config.name);

    // テンプレートの存在確認
    const templatePath = await validateTemplateExists(config.template);

    const deckPath = path.join(DECKS_DIR, config.name);

    console.log(`📁 デッキを作成中: ${config.name}`);
    console.log(`📋 テンプレート: ${config.template}`);
    console.log(`📝 タイトル: ${config.title}\n`);

    // デッキディレクトリを作成
    await fs.mkdir(deckPath, { recursive: true });

    // テンプレートファイルをコピー
    if (config.template === 'default') {
      await copyTemplateFiles(templatePath, deckPath, config.name, config.title);
    } else {
      await copyFromExistingDeck(
        templatePath,
        deckPath,
        config.name,
        config.title,
        config.inheritScripts
      );
    }

    // contextディレクトリを作成
    await createContextDirectory(deckPath);

    console.log(formatDeckSuccessMessage(config.name));
  } catch (error) {
    console.error(formatDeckErrorMessage(error as Error, isConfigMode));
    process.exit(1);
  }
}

/**
 * メイン処理
 */
async function main() {
  // コマンドライン引数をパース
  const command = createDeckCommand();
  const args: DeckCliArgs = parseArgs(command);

  // 非インタラクティブモードかどうかを判定
  const requiredFields = ['name', 'title'];
  const nonInteractive = isNonInteractiveMode(args, requiredFields);

  if (nonInteractive) {
    await runNonInteractive(args);
  } else {
    await runInteractive();
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
