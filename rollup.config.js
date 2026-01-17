import path from 'node:path';
import pkg from './package.json' with { type: 'json' };
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import esbuild from 'rollup-plugin-esbuild';
import nodeExternals from 'rollup-plugin-node-externals';
import { visualizer } from 'rollup-plugin-visualizer';

const allowedDependencies = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]);

export default {
  input: path.join(process.cwd(), './src/index.ts'),
  output: [{ format: 'es', dir: './dist', preserveModules: true, sourcemap: true }],
  plugins: [
    commonjs(),
    nodeExternals(),
    nodeResolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
    esbuild({
      sourceMap: true,
      tsconfig: path.resolve(process.cwd(), 'tsconfig.build.json'),
    }),
    replace({ preventAssignment: true }),
    alias({ entries: [{ find: /^@\//, replacement: path.resolve(process.cwd(), 'src') + '/' }] }),
    visualizer({ output: 'stats.html' }),
  ],

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
};
