import path from 'node:path';
import { defineConfig } from 'rolldown';
import { visualizer } from 'rollup-plugin-visualizer';
import pkg from './package.json' with { type: 'json' };

const allowedDependencies = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]);

export default defineConfig({
  input: path.resolve(process.cwd(), 'src/index.ts'),
  tsconfig: path.resolve(process.cwd(), 'tsconfig.build.json'),
  output: {
    dir: './dist',
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: 'src',
    sourcemap: true,
  },
  plugins: [visualizer({ output: 'stats.html' })],
  external(id) {
    if (id.startsWith('.') || path.isAbsolute(id)) return false;
    if (id.startsWith('@/')) return false;
    if (id.startsWith('node:')) return true;

    const dependency = id.split('/')[0].startsWith('@')
      ? id.split('/').slice(0, 2).join('/')
      : id.split('/')[0];

    if (!allowedDependencies.has(dependency)) {
      throw new Error(
        `Dependency "${dependency}" is used but not listed in dependencies/peerDependencies`
      );
    }

    return true;
  },
});
