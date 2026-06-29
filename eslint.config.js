const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Plain Node CommonJS tooling scripts (not app code): need Node
    // globals like __dirname/require, and are allowed to use
    // console.log directly since that IS their output mechanism.
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
];
