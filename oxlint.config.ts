import type { OxlintConfig } from 'oxlint';

export default {
  plugins: ['typescript', 'jest'],
  env: {
    jest: true,
    node: true,
  },
  ignorePatterns: ['coverage/**', 'dist/**'],
  rules: {
    'typescript/no-explicit-any': 'off',
  },
} satisfies OxlintConfig;
