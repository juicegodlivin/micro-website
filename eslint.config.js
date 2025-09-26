// ESLint v9+ configuration for Erevos Dark Ops project
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        navigator: 'readonly',
        performance: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        requestAnimationFrame: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        getComputedStyle: 'readonly',
        IntersectionObserver: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'no-console': 'off', // Allow console for development
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'strict': ['error', 'global']
    }
  },
  {
    files: ['script.js'],
    languageOptions: {
      sourceType: 'script'
    }
  }
];
