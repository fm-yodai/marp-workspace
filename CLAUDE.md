# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Marp (Markdown Presentation Ecosystem) environment for creating and managing slide presentations from Markdown files. Marp is a tool that converts Markdown to beautiful slide decks.

Website: https://marp.app/

## Repository Structure

The repository follows this organizational pattern:

- **Individual presentation directories**: Each subdirectory under the root contains a specific slide deck/presentation
- **Template directory**: A dedicated directory for managing reusable presentation templates (to be created)

Each presentation directory is self-contained with its own Markdown files and assets.

## Working with Marp

### Marp CLI Commands

Marp uses the `@marp-team/marp-cli` package. Common commands:

```bash
# Convert Markdown to HTML slides
marp slides.md

# Convert to PDF
marp slides.md --pdf

# Convert to PowerPoint
marp slides.md --pptx

# Watch mode for development
marp -w slides.md

# Serve with live reload
marp -s slides.md

# Convert all markdown files in a directory
marp *.md
```

### Marp Markdown Syntax

Marp extends standard Markdown with presentation-specific features:

- **Slide separator**: Use `---` to separate slides
- **Frontmatter directives**: Use YAML frontmatter to configure themes, size, and other presentation settings
- **Directives**: Use `<!-- directiveName: value -->` for per-slide or global settings

Example:
```markdown
---
marp: true
theme: default
paginate: true
---

# First Slide

---

# Second Slide
```

## Directory Organization

When creating new presentations:

1. Create a new directory with a descriptive name (e.g., `project-kickoff`, `quarterly-review`)
2. Place the main Markdown file(s) in that directory
3. Store any images or assets in the same directory or a subdirectory
4. Keep each presentation self-contained for portability

## Templates

The template directory (to be created) should contain:
- Reusable theme CSS files
- Common slide layouts
- Shared assets (logos, backgrounds)
- Template starter files for different presentation types
