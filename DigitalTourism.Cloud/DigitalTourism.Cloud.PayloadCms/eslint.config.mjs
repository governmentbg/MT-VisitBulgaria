import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@next/next/no-img-element': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    ignores: ['.next/', 'src/migrations/'],
  },
  {
    files: [
      'src/migrations/**/*.ts',
      'src/endpoints/seed/**/*.ts',
      'tools/importer/**/*.ts',
      'tests/**/*.ts',
      'src/i18n/**/*.ts',
      'src/plugins/**/*.{ts,tsx}',
      'src/globals/**/*.{ts,tsx}',
      'src/lib/**/*.{ts,tsx}',
      'src/components/admin/**/*.{ts,tsx}',
      'src/utilities/**/*.{ts,tsx}',
      'src/collections/**/*.{ts,tsx}',
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
]

export default eslintConfig
