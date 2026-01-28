import fs from 'fs/promises';
import path from 'path';

export async function getExistingDecks(decksDir: string): Promise<string[]> {
  const entries = await fs.readdir(decksDir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
}

export async function hasCustomThemes(deckPath: string): Promise<boolean> {
  const themesPath = path.join(deckPath, 'themes');
  return fs.access(themesPath).then(() => true).catch(() => false);
}

export async function copyDirectory(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}
