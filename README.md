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

## License

MIT
