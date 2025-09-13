import path from 'node:path';
import { run } from './run';
import { updateVersion } from './update-version';
import chalk from 'chalk';
import fs from 'fs-extra';
import githubRelease from 'new-github-release-url';
import open from 'open';
import signale from 'signale';
import SimpleGit from 'simple-git';
import { getNextVersion, VersionIncrement, VersionStage } from 'version-next';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { $ } from 'zx';

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = fs.readJsonSync(packageJsonPath);
const { argv } = yargs(hideBin(process.argv)) as any;
const git = SimpleGit();

const versionIncrement: VersionIncrement = argv._[0] || 'patch';
const versionStage: VersionStage | undefined = argv.stage;

function parseRepo(repository: any): { user: string; repo: string } | null {
  if (!repository) return null;
  const url: string = typeof repository === 'string' ? repository : repository.url || '';

  if (!url) {
    return null;
  }

  const cleaned = url.replace('git+https://github.com/', '').replace(/\.git$/i, '');
  const parts = cleaned.split('/').filter(Boolean);
  if (parts.length >= 2) {
    return { user: parts[0], repo: parts[1] };
  }

  return null;
}

async function release() {
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

  await run($`yarn`, {
    info: 'Installing fresh dependencies',
    success: 'Fresh dependencies have been installed',
    error: 'Failed to install fresh dependencies',
  });

  await run($`yarn run clean`, {
    info: 'Removing dist directory',
    success: 'dist directory has been removed',
    error: 'Failed to remove dist directory',
  });

  await run($`yarn run build`, {
    info: 'Building the package',
    success: 'The package has been built',
    error: 'Failed to build the package',
  });

  const revertVersion = await updateVersion(nextVersion);

  await run(
    $`npm publish --access public --tag ${versionStage || 'latest'}`,
    {
      info: 'Publishing the package to npm',
      success: 'The package has been published to npm',
      error: 'Failed to publish the package to npm',
    },
    revertVersion
  );

  await git.add([packageJsonPath]);
  await git.commit(`Release ${nextVersion}`);
  await git.push();

  const parsedRepo = parseRepo(packageJson.repository);
  if (!parsedRepo) {
    signale.warn(
      'Could not parse repository from package.json, skipping opening GitHub release page.'
    );
    return;
  }

  open(
    githubRelease({
      user: parsedRepo.user,
      repo: parsedRepo.repo,
      tag: nextVersion,
      title: nextVersion,
    })
  );
}

release();
