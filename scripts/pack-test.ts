import { execa } from 'execa';
import signale from 'signale';

const ALLOWED_FILES = ['LICENSE', 'README.md', 'package.json'];

async function packCheck() {
  const { stdout } = await execa('npm', ['pack', '--dry-run', '--json']);
  const files: { path: string }[] = JSON.parse(stdout)[0].files;
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
