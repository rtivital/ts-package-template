/**
 * Knip configuration for detecting unused files, dependencies, and exports
 * @see https://knip.dev/reference/configuration
 */

export default {
  // Entry points for the package
  entry: [
    'src/index.ts', // Main package entry
    'scripts/**/*.ts', // Release and build scripts
  ],

  // Project files to analyze
  project: ['src/**/*.ts', 'scripts/**/*.ts'],

  // Ignore patterns
  ignore: [
    'dist/**', // Build output
    'coverage/**', // Test coverage reports
    '**/*.test.ts', // Test files (often have unused exports for testing)
    '**/*.test.tsx',
  ],

  // Uncomment below if you need to ignore specific dependencies
  // ignoreDependencies: [],
  // ignoreBinaries: [],

  // Plugin configuration
  // Knip auto-detects these, but you can customize if needed
  jest: {
    config: 'jest.config.js',
  },

  eslint: {
    config: 'eslint.config.js',
  },

  prettier: {
    config: '.prettierrc.js',
  },

  // Enable stricter checks (optional - uncomment to enable)
  // includeEntryExports: true, // Report unused exports in entry files
  // ignoreDependencies: [],
};
