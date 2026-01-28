import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs/promises';

export async function promptDeckCreation(existingDecks: string[]) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'deckName',
      message: 'Deck name (format: YYYY-MM_description):',
      validate: async (input: string) => {
        if (!/^\d{4}-\d{2}_[\w-]+$/.test(input)) {
          return 'Format must be YYYY-MM_description (e.g., 2026-01_my-deck)';
        }
        const deckPath = path.join(process.cwd(), 'decks', input);
        const exists = await fs.access(deckPath).then(() => true).catch(() => false);
        if (exists) {
          return `Deck "${input}" already exists`;
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'templateSource',
      message: 'Select template source:',
      choices: [
        { name: 'Default template', value: 'default' },
        new inquirer.Separator('--- Existing Decks ---'),
        ...existingDecks.map(deck => ({ name: deck, value: deck }))
      ]
    },
    {
      type: 'input',
      name: 'deckTitle',
      message: 'Presentation title:',
      default: (answers: any) =>
        answers.deckName.replace(/[-_]/g, ' ').replace(/^\d{4}-\d{2}_/, '')
    },
    {
      type: 'confirm',
      name: 'inheritScripts',
      message: 'Inherit package.json scripts from template?',
      default: false,
      when: (answers: any) => answers.templateSource !== 'default'
    }
  ]);
}
