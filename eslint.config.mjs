import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const compat = new FlatCompat({
  baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
});

export default [
  ...compat.config({
    extends: ['next/core-web-vitals', 'prettier'],
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      'react/jsx-props-no-spreading': 'off',
    },
  }),
  {
    ignores: ['docs/specs/**'],
  },
];
