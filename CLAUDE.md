# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language and Communication

**IMPORTANT**: Always communicate with the user in Japanese. All responses, explanations, and messages must be in Japanese, regardless of the language used in code, documentation, or the user's initial message.

## Project Overview

This is a Marp (Markdown Presentation Ecosystem) environment for creating and managing slide presentations from Markdown files. Marp is a tool that converts Markdown to beautiful slide decks.

Website: https://marp.app/

### Key Features

- **Marp Deck Creation**: Create presentations from Markdown
- **OCR Conversion**: Convert existing PowerPoint files to Marp format using Mistral Vision/OCR API
- **npm Workspaces**: Efficient multi-deck management with shared dependencies
- **AI Context**: Each deck includes context/ directory for AI collaboration

## npm Workspaces Architecture

This workspace uses **npm workspaces** for efficient deck management:

### Structure

- **Workspace root**: Contains `package.json` with `"workspaces": ["decks/*"]` and shared `node_modules/` (~177MB)
- **Individual decks**: Each deck in `decks/` has its own `package.json` with scripts only (no dependencies)
- **Template system**: `templates/default/` provides the base template for new decks

### Key Benefits

- ✅ **Minimal disk usage**: Single `node_modules/` shared by all decks (~177MB total, regardless of deck count)
- ✅ **Independent development**: Each deck supports `npm run dev`, `npm run build`, etc. from within its directory
- ✅ **Centralized management**: One `npm install` at workspace root serves all decks
- ✅ **Version consistency**: All decks use the same Marp CLI version automatically

### How It Works

```
marp-workspace/
├── package.json              # Workspace definition + shared dependencies
├── node_modules/             # Shared by all decks (~177MB)
│   └── .bin/marp            # Marp CLI command
└── decks/
    ├── 000_template/
    │   ├── package.json     # Scripts only (no devDependencies)
    │   ├── .marprc          # Theme configuration
    │   ├── deck.md
    │   ├── context/         # AI collaboration context
    │   └── dist/            # Build output
    └── 2026-01_sample/
        ├── package.json     # Scripts only
        ├── .marprc
        ├── deck.md
        ├── context/
        └── dist/
```

**Important**: Each deck references the workspace root's `node_modules/` - no per-deck installation needed.

## Repository Structure

Each deck is self-contained with:
- **package.json**: Build scripts (dev, build, build:pdf, etc.)
- **.marprc**: Marp configuration (theme paths, settings)
- **deck.md**: Presentation content
- **assets/**: Images and other resources
- **context/**: AI collaboration context (background, notes)
- **dist/**: Build output (gitignored)

## Working with Marp

### Marp Skill

For comprehensive Marp support, use the `/marp` skill, which provides:
- Complete syntax and directive reference
- Pre-built templates for various presentation types
- Build command generation
- Troubleshooting assistance

### Context Creator Skill

Use the `/create-context` skill to create or update the `context/` directory files for your deck:
- **Interactive prompts**: Gather presentation details step by step
- **Two modes**: Quick Mode (fast input) or Detailed Mode (editor-based)
- **Smart updates**: Merge new information with existing context
- **Japanese interface**: Fully localized prompts and templates
- **Non-interactive mode**: AI agents can automate context creation using CLI arguments or JSON config

**Quick start**:
```bash
/create-context          # From Claude Code (interactive)
npm run create-context   # From command line (interactive)

# Non-interactive mode (for AI agents)
npm run create-context -- --deck <name> --purpose <text> --audience <text> --key-messages <items> --yes
npm run create-context -- --config ./context-config.json --yes
```

This helps organize your presentation's purpose, target audience, key messages, and notes - making it easier for AI to assist with slide creation. See `.claude/skills/create-context/SKILL.md` for detailed documentation.

### Deck Generator Skill

Use the `/create-deck` skill to create new Marp decks:
- **Interactive deck creation**: Step-by-step prompts for deck setup
- **Template selection**: Use default template or existing deck as base
- **Script inheritance**: Optionally inherit npm scripts from template
- **Non-interactive mode**: AI agents can automate deck creation using CLI arguments or JSON config

**Quick start**:
```bash
/create-deck          # From Claude Code (interactive)
npm run create-deck   # From command line (interactive)

# Non-interactive mode (for AI agents)
npm run create-deck -- --name <YYYY-MM_name> --title <text> --yes
npm run create-deck -- --config ./deck-config.json --yes
```

See `.claude/skills/create-deck/SKILL.md` for detailed documentation.

### Comprehensive Documentation

Detailed documentation is available in `docs/marp/`:
- **README.md**: Overview and navigation guide
- **01_marp_overview.md**: Marp ecosystem overview
- **02_marp_cli_usage.md**: Detailed CLI usage and options
- **03_markdown_syntax.md**: Marp-specific Markdown extensions
- **04_directives.md**: Complete directives guide
- **05_theme_development.md**: Custom theme creation
- **06_practical_examples.md**: Practical templates and examples

### Quick Reference

#### Basic Commands
```bash
# Preview while developing
marp -p -w slides.md

# Convert to HTML
marp slides.md

# Convert to PDF
marp slides.md --pdf

# Convert to PowerPoint
marp slides.md --pptx

# Convert all markdown files
marp *.md
```

#### Basic Slide Structure
```markdown
---
marp: true
theme: default
paginate: true
---

# First Slide

---

## Second Slide

Content here
```

#### Common Directives
```markdown
<!-- Hide page number on current slide only -->
<!-- _paginate: false -->

<!-- Background image on right 40% -->
![bg right:40%](./image.jpg)

<!-- Invert slide colors -->
<!-- class: invert -->

<!-- Auto-fit heading to slide width -->
# <!--fit--> Large Heading
```

#### Slide Separator
Use `---` (three hyphens) to separate slides

## OCR-Based PPTX Conversion

This workspace includes a powerful OCR conversion tool for transforming PowerPoint presentations into Marp format.

### Quick Start

```bash
# Install Python dependencies
npm run ocr:install

# Set Mistral API key
export MISTRAL_API_KEY="your_api_key_here"

# Convert PPTX to Marp
npm run ocr:convert -- presentation.pptx -o 2026-01_converted
```

### Conversion Strategies

The tool offers three strategies:

1. **Background Mode** (default): Perfect fidelity, preserves slides as background images
   - Use when: Exact visual reproduction needed
   - Editability: None
   - File size: Large

2. **Hybrid Mode**: Background images with editable text overlays
   - Use when: Need to edit content while maintaining visual reference
   - Editability: Medium
   - File size: Large

3. **Reconstruction Mode**: Full Markdown reconstruction
   - Use when: Maximum editability needed
   - Editability: Full
   - File size: Small

### Usage Examples

```bash
# Basic conversion (background mode)
npm run ocr:convert -- slides.pptx -o 2026-01_quarterly

# Hybrid mode with text overlay
npm run ocr:convert -- slides.pptx -o 2026-02_editable --strategy hybrid

# Full reconstruction
npm run ocr:convert -- slides.pptx -o 2026-03_markdown --strategy reconstruction

# Custom settings
npm run ocr:convert -- slides.pptx -o 2026-04_custom --dpi 600 --theme company
```

### Requirements

- **Python 3.8+**: For OCR processing
- **LibreOffice**: For PPTX to PDF conversion
- **poppler-utils**: For PDF to image conversion
- **Mistral API Key**: For OCR processing (~$2 per 1,000 pages)

**Platform Support**: This workspace is fully cross-platform and works on Windows, macOS, and Linux. The tools automatically detect and use the correct executables for your platform.

### Documentation

Comprehensive OCR conversion documentation is available in `docs/ocr-conversion/`:
- **README.md**: Overview and quick start
- **installation.md**: Detailed setup instructions
- **usage.md**: CLI reference and examples
- **strategies.md**: Strategy comparison and selection guide
- **troubleshooting.md**: Common issues and solutions

### Best Practices

1. **Strategy Selection**:
   - Start with background mode for preview
   - Use hybrid for presentations you'll edit
   - Use reconstruction for text-heavy, version-controlled content

2. **Image Quality**:
   - Default 300 DPI is recommended
   - Use 150 DPI for fast previews
   - Use 600 DPI only when high detail is critical

3. **API Costs**:
   - Typical 50-slide deck: ~$0.10
   - Test with small sample first
   - Consider file size before converting large decks

4. **Post-Conversion**:
   - Always review OCR accuracy
   - Edit deck.md as needed
   - Update theme and branding
   - Add speaker notes in context/

## Platform-Specific Setup

### Windows Setup

The workspace fully supports Windows (Command Prompt, PowerShell, and Git Bash). All tools automatically detect and use Windows-compatible commands.

#### System Dependencies

1. **Python 3.8+**
   - Download installer from https://www.python.org/downloads/
   - **Important**: Check "Add Python to PATH" during installation
   - Or use chocolatey: `choco install python`
   - Or use scoop: `scoop install python`
   - Verify: `python --version` or `py --version`

2. **LibreOffice**
   - Download from https://www.libreoffice.org/download/
   - Run the installer (MSI)
   - Ensure it's in PATH or tools will auto-detect common install locations
   - Or use chocolatey: `choco install libreoffice`
   - Verify: `soffice --version`

3. **poppler-utils** (for PDF processing)
   - Download from https://github.com/oschwartz10612/poppler-windows/releases/
   - Extract to a folder (e.g., `C:\Program Files\poppler`)
   - Add the `bin` folder to your PATH:
     1. Search "Environment Variables" in Start Menu
     2. Click "Edit the system environment variables"
     3. Click "Environment Variables" button
     4. Under "User variables", select "Path" and click "Edit"
     5. Click "New" and add the path to poppler's `bin` folder
   - Or use chocolatey: `choco install poppler`
   - Or use scoop: `scoop install poppler`
   - Verify: `pdftoppm -v`

#### Installation Steps

```cmd
# 1. Clone and install Node dependencies
git clone <repository-url>
cd marp-workspace
npm install

# 2. Install Python dependencies
npm run ocr:install

# 3. Set Mistral API key
# For Command Prompt:
set MISTRAL_API_KEY=your-api-key-here

# For PowerShell:
$env:MISTRAL_API_KEY="your-api-key-here"

# For permanent setting:
# Search "Environment Variables" in Start Menu → Add MISTRAL_API_KEY

# 4. Verify setup
npm run ocr:verify
```

#### Common Windows Issues

**"python3 not found"**
- Windows typically installs Python as `python` or `py`, not `python3`
- The tools automatically detect the correct command (no action needed)

**"pip3 not found"**
- Windows uses `pip` or `py -m pip` instead of `pip3`
- The tools automatically detect the correct command (no action needed)

**LibreOffice conversion hangs**
- First run may take 2-3 minutes to initialize
- Subsequent runs are faster
- Make sure no other LibreOffice processes are running

**Path contains spaces**
- Use quotes around paths: `npm run ocr:convert -- "C:\My Documents\presentation.pptx" -o output`
- Or use forward slashes: `npm run ocr:convert -- C:/My Documents/presentation.pptx -o output`

**Permission errors**
- Run terminal as Administrator if you encounter permission issues
- Check that antivirus isn't blocking Python or LibreOffice

#### Environment Variables (Permanent)

To permanently set the Mistral API key:

1. Search "Environment Variables" in Start Menu
2. Click "Edit the system environment variables"
3. Click "Environment Variables" button
4. Under "User variables", click "New"
5. Variable name: `MISTRAL_API_KEY`
6. Variable value: your API key
7. Click OK on all dialogs
8. Restart your terminal

### macOS Setup

```bash
# Install dependencies using Homebrew
brew install python3 libreoffice poppler

# Install Node dependencies
npm install

# Install Python dependencies
npm run ocr:install

# Set API key (add to ~/.zshrc or ~/.bashrc for persistence)
export MISTRAL_API_KEY="your-api-key-here"

# Verify setup
npm run ocr:verify
```

### Linux Setup

```bash
# Ubuntu/Debian
sudo apt-get install python3 python3-pip libreoffice poppler-utils

# Fedora/RHEL
sudo yum install python3 python3-pip libreoffice poppler-utils

# Arch
sudo pacman -S python python-pip libreoffice poppler

# Install Node dependencies
npm install

# Install Python dependencies
npm run ocr:install

# Set API key (add to ~/.bashrc for persistence)
export MISTRAL_API_KEY="your-api-key-here"

# Verify setup
npm run ocr:verify
```

## Creating New Decks

### Recommended Method: Deck Generator

Use the interactive TUI generator:

```bash
npm run create-deck
```

This will:
1. Prompt for deck name (format: `YYYY-MM_description`)
2. Let you choose template source (default template or existing deck)
3. Ask for presentation title
4. Optionally inherit package.json scripts from selected deck
5. Create fully configured deck with all necessary files

### Manual Creation (Not Recommended)

If you need manual creation:

1. Create directory: `decks/YYYY-MM_description/`
2. Copy files from `templates/default/`
3. Customize `package.json` name and `deck.md` content
4. No `npm install` needed - workspace handles it

### Deck Naming Convention

Format: `YYYY-MM_descriptive-name`

Examples:
- `2026-01_quarterly-review`
- `2026-03_product-launch`
- `2026-06_team-offsite`

This ensures chronological sorting in the file system.

## Working with Decks

### Per-Deck Development

Within any deck directory (`decks/my-deck/`), you can run:

```bash
npm run dev           # Preview with watch mode
npm run build         # Build to HTML
npm run build:pdf     # Build to PDF
npm run build:pptx    # Build to PowerPoint
npm run build:all     # Build all formats
```

The deck automatically uses the workspace root's `node_modules/` - no separate installation needed.

### Workspace-Level Build

From workspace root:

```bash
# Build specific deck
npm run build:deck -- 2026-01_sample          # All formats
npm run build:deck -- 2026-01_sample html     # HTML only
npm run build:deck -- 2026-01_sample pdf      # PDF only
```

### Theme Configuration

Each deck has a `.marprc` file that references shared themes:

```yaml
themeSet:
  - ../../shared/themes    # Workspace shared themes
  - ./themes               # Deck-specific themes (optional)
allowLocalFiles: true
```

Shared themes in `shared/themes/company.css` are available to all decks.

## AI Context Directory

Each deck includes a `context/` directory for AI collaboration:

- **context/README.md**: Explains how to use the context directory
- **context/background.md**: Presentation purpose, audience, key messages
- **context/notes.md**: Ideas, TODOs, reference materials

This content is not included in slides but helps AI provide better assistance when creating or editing presentations.

## Templates

Template system structure:
- **templates/default/**: Base template with all necessary files
- **shared/themes/**: Reusable theme CSS files (e.g., `company.css`)
- **shared/assets/**: Shared assets like logos and backgrounds

See `docs/marp/06_practical_examples.md` for complete templates:
- Business presentations
- Technical presentations
- Educational/training presentations

## Best Practices

1. **Always use Front-matter**: Place YAML configuration at the very beginning of the file
2. **Consistent structure**: Keep each presentation in its own directory
3. **Relative paths**: Use relative paths for images and assets
4. **Theme reuse**: Place custom themes in `shared/themes/` for reuse across presentations
5. **Preview during development**: Use `marp -p -w slides.md` for real-time preview

## Troubleshooting

- **Slides not rendering**: Check that `marp: true` is in the Front-matter
- **Directives not working**: Ensure proper syntax with colon and space: `<!-- paginate: true -->`
- **PDF conversion fails**: Check that a browser (Chrome/Edge/Firefox) is installed
- **Images not displaying**: Verify image paths are correct (prefer relative paths)

For detailed troubleshooting, see `docs/marp/README.md` or use the `/marp` skill.
