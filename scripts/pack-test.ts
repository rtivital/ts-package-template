import signale from 'signale';
import { $ } from 'zx';

const ALLOWED_FILES = ['LICENSE', 'README.md', 'package.json'];

async function packCheck() {
  let result;

  try {
    result = await $`npm pack --dry-run --json`;
  } catch (error) {
    signale.error('Failed to run npm pack --dry-run');
    signale.error(error);
    process.exit(1);
  }

  let files;
  try {
    files = JSON.parse(result.stdout)[0].files;
  } catch (error) {
    signale.error('Failed to parse npm pack output');
    signale.error(error);
    process.exit(1);
  }

  const extraFiles = files
    .filter(
      (file: { path: string }) =>
        !file.path.startsWith('dist/') && !ALLOWED_FILES.includes(file.path)
    )
    .map((file: { path: string }) => file.path);

  if (extraFiles.length > 0) {
    signale.error(
      'The packed package contains unexpected extra files. Add these files to the .npmignore file to exclude them from the published package.'
    );
    extraFiles.forEach((file: string) => signale.log(file));
    process.exit(1);
  }

  signale.success('Package validation passed - no unexpected files found');
}

packCheck();
