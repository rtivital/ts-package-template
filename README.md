# ts-package-template

A template to publish a TypeScript package to npm.

Included tools:

- Yarn v4
- Rollup
- esbuild
- jest
- prettier
- ESLint
- GitHub workflow for tests

## Usage

- Click "Use this template" button to create a new repository from this template
- Clone the new repository
- Change `package.json` to your own package name, description, etc. **!important**: change `repository.url` and other repository links to your own repository url
- Install dependencies: `yarn` (other package managers are not supported)
- Write your code in `src/` directory
- Run `npm run release` to build and publish your package to npm

## Publishing to npm

Use `release` script to publish the package:

- `npm run release` – release a new patch version to npm
- `npm run release minor` – release a new minor version to npm
- `npm run release major` – release a new major version to npm
- `npm run release minor -- --stage alpha` – release a new minor alpha version to npm (for example, `1.1.0-alpha.0`)

Note that release script will always publish public packages to npm. If you want to publish a private package, change release script in `scripts/release.ts`.

## Publishing with GitHub Actions

1. Create [npm authentication token](https://docs.npmjs.com/creating-and-viewing-authentication-tokens) and add it as `NPM_TOKEN` to your repository secrets (Settings -> Secrets and variables -> Actions -> New repository secret).

2. Create `.github/workflows/publish.yml` with the following content. _Note that if your default branch is main, you should change it in the publish action_.

```yaml
on:
  push:
    branches: master

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version-file: '.nvmrc'
          cache: 'yarn'
          cache-dependency-path: '**/yarn.lock'
      - run: yarn
      - run: npm test
      - uses: JS-DevTools/npm-publish@v3
        with:
          token: ${{ secrets.NPM_TOKEN }}
```

3. To create a new release, use commands from the previous section but with `--no-publish` flag, for example: `npm run release minor -- --no-publish`.

## License

MIT
