import path from 'node:path';
import fs from 'fs-extra';
import { execa } from 'execa';

async function generateDts() {
  await execa('yarn', ['tsc', '--project', 'tsconfig.build.json']);
  await fs.copy(
    path.join(process.cwd(), 'dist/types/index.d.ts'),
    path.join(process.cwd(), 'dist/types/index.d.mts')
  );
}

generateDts();
