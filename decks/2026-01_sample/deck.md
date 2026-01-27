---
marp: true
theme: company
paginate: true
size: 16:9
---

<!-- _class: lead -->

# Welcome to Marp

Building Beautiful Presentations from Markdown

January 2026

---

## What is Marp?

**Marp** (Markdown Presentation Ecosystem) lets you create slide decks using simple Markdown syntax.

Benefits:
- Write presentations like documentation
- Version control friendly (plain text)
- Multiple export formats (HTML, PDF, PowerPoint)
- Custom themes with CSS
- Fast workflow with live preview

Learn more: [marp.app](https://marp.app/)

---

## This Workspace Features

This multi-deck workspace provides:

- **Template system** - Start new presentations quickly
- **Custom themes** - Branded company theme ready to use
- **Automated builds** - npm scripts for all export formats
- **Organized structure** - Each deck in its own directory
- **Live preview** - See changes as you type

---

## Getting Started

```bash
# Install dependencies
npm install

# Preview a deck with live reload
npm run preview decks/2026-01_sample/deck.md

# Build to PDF
npm run build -- --pdf decks/2026-01_sample/deck.md

# Build to PowerPoint
npm run build -- --pptx decks/2026-01_sample/deck.md

# Build all decks to all formats
npm run build:all
```

---

## Creating Your First Deck

1. **Copy the template:**
   ```bash
   cp -r decks/000_template decks/2026-02_my-project
   ```

2. **Edit the Markdown:**
   Open `decks/2026-02_my-project/deck.md`

3. **Add your content:**
   - Use `---` to separate slides
   - Add images to `assets/` directory
   - Apply custom classes like `<!-- _class: lead -->`

4. **Preview and build:**
   ```bash
   npm run preview decks/2026-02_my-project/deck.md
   ```

---

## Export Formats Compared

| Format | Best For | File Size | Editable |
|--------|----------|-----------|----------|
| **HTML** | Web sharing | Smallest | No |
| **PDF** | Printing, archival | Medium | No |
| **PPTX** | PowerPoint editing | Largest | Yes |

All formats preserve your theme and styling.

---

<!-- _class: invert -->

## Start Creating!

Everything you need is ready:

- Template deck with examples
- Custom company theme
- Build scripts configured
- Documentation in README.md

**Next step:** Copy the template and start writing!

---

<!-- _paginate: false -->

## Resources

- **Marp Documentation:** [marp.app](https://marp.app/)
- **Markdown Guide:** [Marpit Markdown](https://marpit.marp.app/markdown)
- **Theme Customization:** [Theme CSS](https://marpit.marp.app/theme-css)
- **VS Code Extension:** [Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)

Questions? Check the README.md in the workspace root.
