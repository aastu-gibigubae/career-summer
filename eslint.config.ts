import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import type { Linter } from 'eslint';
import tseslint from 'typescript-eslint';
const config: Linter.Config[] = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['./src/**/*.{ts,ts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  prettier,
];

export default config;
