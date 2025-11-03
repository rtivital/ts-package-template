import path from 'node:path';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import esbuild from 'rollup-plugin-esbuild';
import nodeExternals from 'rollup-plugin-node-externals';

export default {
  input: path.join(process.cwd(), './src/index.ts'),
  output: [
    { format: 'es', file: './dist/esm/index.mjs' },
    { format: 'cjs', file: './dist/cjs/index.cjs' },
  ],
  plugins: [
    commonjs(),
    nodeExternals(),
    nodeResolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
    esbuild({
      sourceMap: false,
      tsconfig: path.resolve(process.cwd(), 'tsconfig.build.json'),
    }),
    replace({ preventAssignment: true }),
    alias({ entries: [{ find: /^@\//, replacement: path.resolve(process.cwd(), 'src') + '/' }] }),
  ],
};
