const globals = require("globals");
const js = require('@eslint/js');
const tsESLint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const prettier = require('eslint-plugin-prettier');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tsESLint,
      'import': importPlugin,
      'prettier': prettier
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true
      },
      globals: {
        ...globals.node, // Подключает стандартные Node.js глобалы (console, process, etc.)
      },
    },
    rules: {
      ...tsESLint.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-unused-vars': 'warn',
      'import/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          'newlines-between': 'always',
          'alphabetize': {
            'order': 'asc',
            'caseInsensitive': true
          }
        }
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      'object-curly-spacing': ['error', 'always'],
      'quotes': ['error', 'single', { 'avoidEscape': true }]
    },
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.d.ts',
      '**/webpack.config.cjs',
    ]
  }
];
