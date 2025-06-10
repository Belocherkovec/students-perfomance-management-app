import globals from "globals";
import js from '@eslint/js';
import tsESLint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';

export default [
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
    }
  }
];