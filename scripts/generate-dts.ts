import path from 'node:path';
import fs from 'fs-extra';
import signale from 'signale';
import { $ } from 'zx';

async function generateDts() {
  try {
    await $`yarn tsc --project tsconfig.build.json`;
    await fs.copy(
      path.join(process.cwd(), 'dist/types/index.d.ts'),
      path.join(process.cwd(), 'dist/types/index.d.mts')
    );
    await fs.copy(
      path.join(process.cwd(), 'dist/types/index.d.ts'),
      path.join(process.cwd(), 'dist/types/index.d.cts')
    );

    await fs.remove(path.join(process.cwd(), 'dist/types/index.d.ts'));
  } catch (err) {
    signale.error('Failed to generate d.ts files');
    signale.error(err);
    process.exit(1);
  }
}

generateDts();
