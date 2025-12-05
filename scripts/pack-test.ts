import signale from 'signale';
import { $ } from 'zx';

const ALLOWED_FILES = ['LICENSE', 'README.md', 'package.json'];

async function packCheck() {
  const result = await $`npm pack --dry-run --json`;
  const output = result.stdout.trim();

  let jsonData = null;

  try {
    jsonData = JSON.parse(output);
  } catch {
    const lines = output.split('\n');
    const arrayStartIndex = lines.findIndex((line) => line.trim() === '[');
    if (arrayStartIndex !== -1) {
      const jsonString = lines.slice(arrayStartIndex).join('\n');
      try {
        jsonData = JSON.parse(jsonString);
      } catch {
        // Ignore parse errors
      }
    }
  }

  if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
    signale.error('Failed to parse npm pack output');
    process.exit(1);
  }

  const files: { path: string }[] = jsonData[0].files;
  const extraFiles = files
    .filter((file) => !file.path.startsWith('dist/') && !ALLOWED_FILES.includes(file.path))
    .map((file) => file.path);

  if (extraFiles.length > 0) {
    signale.error(
      'The packed package contains unexpected extra files. Add these files to the .npmignore file to exclude them from the published package.'
    );
    extraFiles.forEach((file) => signale.log(file));
    process.exit(1);
  }
}

packCheck();
