import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/bundle/**',
      '**/out/**',
      '**/webpack.config.js',
      '**/commitlint.config.js',
      '**/next.config.*',
      '**/postcss.config.*',
      '**/tailwind.config.*',
      '**/eslint.config.*',
    ],
  },
  // Frontend (Next.js) overrides
  {
    files: ['apps/frontend/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Next.js specific rules
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react/prop-types': 'off', // Using TypeScript
      'react/no-unknown-property': 'off', // Allow Three.js properties
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Backend (Node.js) overrides
  {
    files: ['apps/realtime-api/**/*.{js,ts}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        node: true,
        module: true,
        require: true,
        __dirname: true,
        __filename: true,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-require-imports': 'off', // Allow require in config files
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  // Root level TypeScript files
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      globals: {
        module: true,
        require: true,
        __dirname: true,
        __filename: true,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off', // Allow require in config files
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
