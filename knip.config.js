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

  // Uncomment below if you need to ignore specific dependencies
  // ignoreDependencies: [],
  // ignoreBinaries: [],

  // Plugin configuration
  // Knip auto-detects these, but you can customize if needed
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
