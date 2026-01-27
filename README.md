# Marp Multi-Deck Presentation Workspace

A complete workspace for creating and managing multiple presentation decks using [Marp](https://marp.app/) (Markdown Presentation Ecosystem).

## Features

- **Template System** - Reusable template deck with examples of all major features
- **Custom Theme** - Professional company theme with CSS variables for easy customization
- **Automated Builds** - npm scripts for HTML, PDF, and PowerPoint exports
- **Organized Structure** - Each presentation in its own directory with assets
- **Live Preview** - Watch mode with auto-reload for rapid development
- **Version Control** - Plain Markdown files work perfectly with git

## Prerequisites

### Required

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
  - Verify: `node --version`
  - npm v8+ is included with Node.js
- **Chromium or Chrome** (required for PDF/PPTX export)
  - Usually installed automatically with most systems

### Optional

- **LibreOffice Impress** (required only for `--pptx-editable` option)
  - See [LibreOffice Setup](#libreoffice-impress-setup) section below
- **VS Code** with [Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode) extension
  - Provides in-editor preview and export

## Setup

Install dependencies:

```bash
npm install
```

This will:
- Install `@marp-team/marp-cli`
- Auto-create `dist/` output directories

### LibreOffice Impress Setup

The `--pptx-editable` option requires LibreOffice Impress. **This is optional** - standard PPTX export works without it.

#### Linux (Debian/Ubuntu)

```bash
sudo apt update
sudo apt install libreoffice-impress
```

#### Linux (RHEL/CentOS/Fedora)

```bash
sudo dnf install libreoffice-impress
# or for older systems
sudo yum install libreoffice-impress
```

#### macOS

```bash
# Using Homebrew
brew install --cask libreoffice

# Or download from official website
# https://www.libreoffice.org/download/download/
```

#### Windows

1. Download LibreOffice installer from https://www.libreoffice.org/download/download/
2. Run the installer
3. Ensure "LibreOffice Impress" component is selected
4. Complete installation and restart if prompted

#### Verify Installation

```bash
# Linux/macOS
which libreoffice
soffice --version

# Windows (Command Prompt)
where soffice
"C:\Program Files\LibreOffice\program\soffice.exe" --version
```

## Usage

### Single Deck Commands (Primary Workflow)

| Command | Description |
|---------|-------------|
| `npm run preview <path>` | Live preview with auto-reload |
| `npm run build -- <format> <path>` | Build to specified format |

**Examples:**

```bash
# Preview with live reload
npm run preview decks/2026-01_sample/deck.md

# Build to PDF
npm run build -- --pdf decks/2026-01_sample/deck.md

# Build to PowerPoint
npm run build -- --pptx decks/2026-01_sample/deck.md

# Build to editable PowerPoint (requires LibreOffice)
npm run build -- --pptx --pptx-editable decks/2026-01_sample/deck.md

# Build to HTML with custom output
npm run build -- --html decks/2026-01_sample/deck.md -o dist/custom.html
```

### All Decks Commands

| Command | Description |
|---------|-------------|
| `npm run build:all:html` | Export all decks to HTML |
| `npm run build:all:pdf` | Export all decks to PDF |
| `npm run build:all:pptx` | Export all decks to PowerPoint |
| `npm run build:all:pptx:editable` | Export all decks to editable PPTX |
| `npm run build:all` | Build HTML + PDF + PPTX for all |

**Examples:**

```bash
# Build all decks to PDF
npm run build:all:pdf

# Build all decks to all standard formats
npm run build:all
```

### Utility Commands

| Command | Description |
|---------|-------------|
| `npm run clean` | Remove dist/ and node_modules/ |

## Creating a New Deck

### Step-by-Step Workflow

```bash
# 1. Copy template directory
cp -r decks/000_template decks/2026-02_my-project

# 2. Edit the deck
# Open decks/2026-02_my-project/deck.md in your editor

# 3. Add assets
# Place images in decks/2026-02_my-project/assets/

# 4. Preview with live reload
npm run preview decks/2026-02_my-project/deck.md

# 5. Build to your preferred format
npm run build -- --pdf decks/2026-02_my-project/deck.md
```

### Naming Convention

Format: `YYYY-MM_descriptive-name`

**Examples:**
- `2026-01_quarterly-review`
- `2026-03_product-launch`
- `2026-06_team-offsite`

This keeps decks chronologically sorted in the file system.

## Working with Themes

### Using the Company Theme

The custom `company` theme is already configured in the template. To use it, add to your deck frontmatter:

```yaml
---
marp: true
theme: company
paginate: true
size: 16:9
---
```

### Customizing Colors

Edit `shared/themes/company.css` and modify the CSS variables in `:root`:

```css
:root {
  --color-background: #ffffff;
  --color-foreground: #24292e;
  --color-highlight: #0366d6;
  --color-dimmed: #6a737d;
}
```

### Adding New Themes

1. Create `shared/themes/mytheme.css`
2. Add theme identifier at the top: `/* @theme mytheme */`
3. Define your styles
4. Use in deck: `theme: mytheme`

### Built-in Themes

Marp includes these themes (no CSS file needed):
- `default` - Clean and simple
- `gaia` - Modern and colorful
- `uncover` - Minimalist reveal style

## Output Formats Comparison

| Format | Use Case | Pros | Cons |
|--------|----------|------|------|
| **HTML** | Web sharing, interactive | Smallest file, works everywhere | Requires browser |
| **PDF** | Printing, archival | Universal, preserves layout | Large file size |
| **PPTX** | Further editing in PowerPoint | Editable in Office | May have layout differences |
| **PPTX (editable)** | Heavy editing needed | More editable layers | Requires LibreOffice, layout issues |

### Editable PPTX Notes

- Requires LibreOffice Impress installed on system
- Uses `--pptx-editable` flag
- May have layout/styling inconsistencies
- Best for starting point that will be heavily modified in PowerPoint
- **Standard PPTX recommended for most use cases**

## Tips & Best Practices

### Images
- Optimize before adding (recommend < 1MB each)
- Use relative paths: `assets/image.png`
- Supported formats: PNG, JPG, SVG, GIF

### Assets
- Keep per-deck for portability
- Use descriptive filenames
- Document image sources for licensing

### Version Control
- Commit source `.md` files
- Don't commit `dist/` outputs (already in `.gitignore`)
- Include meaningful commit messages

### Slide Design
- Aim for 10-20 slides for 20-minute presentations
- One main idea per slide
- Use visuals to support text
- Limit text to 6 lines per slide

### Code Blocks
Use syntax highlighting:

````markdown
```javascript
function example() {
  console.log('Hello, Marp!');
}
```
````

Supported languages: JavaScript, Python, Java, Go, Rust, and many more.

### Two-Column Layouts

Use HTML grid:

```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
<div>

Left content here

</div>
<div>

Right content here

</div>
</div>
```

### Speaker Notes

Add after slide separator (not visible in presentation):

```markdown
---

# Slide Title

Content here

<!--
Speaker notes here
- Remember to mention X
- Emphasize Y
-->
```

## Troubleshooting

### Installation Issues

**Error: Cannot find module '@marp-team/marp-cli'**

Solution:
```bash
npm install
```

### Build Issues

**Error: PDF/PPTX generation fails**

Solutions:
- Ensure `--allow-local-files` is in build script (already configured)
- Check that assets use relative paths: `assets/image.png` not `/assets/image.png`
- Verify Chromium/Chrome is installed
- Check file paths for typos

**Images not showing in PDF/PPTX**

Solutions:
- Use relative paths from deck.md location
- Verify image file exists at specified path
- Ensure `--allow-local-files` flag is present (already in scripts)
- Try absolute paths as last resort

### Theme Issues

**Theme not applying**

Solutions:
- Check theme name matches `/* @theme name */` in CSS file
- Verify frontmatter has correct `theme: name`
- Ensure `--theme-set ./shared/themes` is in npm script (already configured)
- Clear browser cache if using preview

**Custom styles not working**

Solutions:
- CSS must be in `shared/themes/` directory
- Theme file must start with `/* @theme themename */`
- Check CSS syntax for errors
- Restart preview after CSS changes

### Editable PPTX Issues

**Error: "LibreOffice is required for editable PPTX"**

Solutions:
- Install LibreOffice Impress (see [Setup](#libreoffice-impress-setup))
- Verify: `soffice --version`
- Ensure LibreOffice is in system PATH

**Error: "Cannot find LibreOffice" (even though installed)**

Solutions:
- **Linux:** Create symlink: `sudo ln -s /usr/bin/libreoffice /usr/bin/soffice`
- **macOS:** Add to PATH: `export PATH="/Applications/LibreOffice.app/Contents/MacOS:$PATH"`
- **Windows:** Add to system PATH:
  1. Search "Environment Variables" in Start menu
  2. Edit "Path" variable
  3. Add `C:\Program Files\LibreOffice\program\`

**Editable PPTX has layout/formatting issues**

Expected behavior:
- Editable PPTX prioritizes editability over fidelity
- Complex CSS may not translate perfectly
- Use standard `--pptx` for better layout preservation
- Editable PPTX best for heavy PowerPoint modifications

**LibreOffice process hangs during conversion**

Solutions:
- Kill stuck processes:
  - Linux/macOS: `pkill soffice`
  - Windows: Task Manager → End LibreOffice processes
- Try again (occasional timing issue)
- Ensure LibreOffice not already running

### Preview Issues

**Preview server not auto-reloading**

Solutions:
- Save file to trigger reload
- Check terminal for error messages
- Restart: `npm run preview decks/your-deck/deck.md`
- Clear browser cache
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**Preview shows blank page**

Solutions:
- Check terminal for errors
- Verify Markdown syntax (missing frontmatter?)
- Ensure file has `.md` extension
- Try building to HTML to see detailed errors

### Platform-Specific Issues

**Windows: Path issues in commands**

Solutions:
- npm scripts use forward slashes (works on Windows)
- Use forward slashes in your commands too
- Avoid backslashes: `decks/myproject/deck.md` not `decks\myproject\deck.md`

**Linux: Permission denied**

Solutions:
- Don't use `sudo` with npm commands
- Fix npm permissions: https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

## Advanced Configuration

### Custom Marp Configuration

Create `.marprc.yml` in root for global settings:

```yaml
options:
  allowLocalFiles: true
  themeSet: ./shared/themes
```

### PDF Export Options

Add quality settings:

```bash
npm run build -- --pdf --pdf-options.preset=default decks/mydeck/deck.md
```

Available presets: `default`, `screen`, `ebook`, `printer`, `prepress`

### Custom Slide Sizes

In frontmatter:

```yaml
# Standard ratios
size: 4:3
size: 16:9

# Custom dimensions (pixels)
size: 1920x1080
```

### HTML with Local Assets

Already configured in scripts with `--html --allow-local-files`. This allows:
- Local image references
- Custom fonts
- Embedded assets

### Background Images

Per-slide backgrounds:

```markdown
<!-- _backgroundImage: "url('assets/background.jpg')" -->

# Slide with Background
```

## Directory Structure

```
marp-workspace/
├── .gitignore                   # Git ignore rules
├── .vscode/
│   └── settings.json           # VS Code Marp settings
├── package.json                # npm scripts and dependencies
├── README.md                   # This file
├── CLAUDE.md                   # AI assistant instructions
├── decks/                      # All presentation decks
│   ├── 000_template/           # Reusable template
│   │   ├── deck.md            # Template with examples
│   │   └── assets/            # Template assets
│   └── 2026-01_sample/        # Sample deck
│       ├── deck.md            # Sample presentation
│       └── assets/            # Sample assets
├── shared/                     # Shared resources
│   ├── themes/                # Custom themes
│   │   └── company.css        # Company theme
│   └── assets/                # Shared assets (logos, etc.)
└── dist/                       # Build outputs (gitignored)
    ├── html/                  # HTML exports
    ├── pdf/                   # PDF exports
    ├── pptx/                  # PowerPoint exports
    └── pptx-editable/         # Editable PPTX exports
```

## Resources

- **Marp Official Site:** [marp.app](https://marp.app/)
- **Marp CLI Documentation:** [github.com/marp-team/marp-cli](https://github.com/marp-team/marp-cli)
- **Marpit Markdown:** [marpit.marp.app/markdown](https://marpit.marp.app/markdown)
- **Theme CSS Guide:** [marpit.marp.app/theme-css](https://marpit.marp.app/theme-css)
- **Marp for VS Code:** [marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)
- **LibreOffice Download:** [libreoffice.org/download](https://www.libreoffice.org/download/download/)

## License

This workspace is provided as-is for creating presentations. Individual presentations created with this workspace are owned by their respective authors.
