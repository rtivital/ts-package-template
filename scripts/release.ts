import path from 'node:path';
import chalk from 'chalk';
import fs from 'fs-extra';
import yargs from 'yargs';
import SimpleGit from 'simple-git';
import { hideBin } from 'yargs/helpers';
import { execa } from 'execa';
import signale from 'signale';
import { getNextVersion, VersionStage, VersionIncrement } from 'version-next';
import { run } from './run';

const { argv } = yargs(hideBin(process.argv)) as any;
const git = SimpleGit();

const versionIncrement: VersionIncrement = argv._[0] || 'patch';
const versionStage: VersionStage | undefined = argv.stage;

async function publish() {
  await run(git.pull(), {
    info: 'Pulling the latest changes from the remote repository',
    success: 'The latest changes have been pulled from the remote repository',
    error: 'Failed to pull the latest changes from the remote repository',
  });

  const gitStatus = await git.status();

  if (gitStatus.files.length > 0) {
    signale.error(
      'Working directory is not clean, commit all changes before publishing the package.'
    );
    process.exit(1);
  }

  const packageJson = await fs.readJson(path.join(process.cwd(), 'package.json'));
  const nextVersion = getNextVersion(packageJson.version, {
    type: versionIncrement,
    stage: versionStage,
  });

  signale.info(
    `Publishing next ${chalk.cyan(versionIncrement)} version of ${chalk.cyan(
      packageJson.name
    )} to npm.`
  );

  signale.info(
    `Current version: ${chalk.cyan(packageJson.version)}, next version: ${chalk.cyan(nextVersion)}`
  );

  await run(execa('yarn'), {
    info: 'Installing fresh dependencies',
    success: 'Fresh dependencies have been installed',
    error: 'Failed to install fresh dependencies',
  });

  await run(execa('yarn', ['run', 'clean']), {
    info: 'Removing dist directory',
    success: 'dist directory has been removed',
    error: 'Failed to remove dist directory',
  });

  await run(execa('yarn', ['run', 'build']), {
    info: 'Building the package',
    success: 'The package has been built',
    error: 'Failed to build the package',
  });

  packageJson.version = nextVersion;
  await fs.writeJson(path.join(process.cwd(), 'package.json'), packageJson, { spaces: 2 });
}

publish();
