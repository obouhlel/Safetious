import js from '@eslint/js';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import prettierPlugin from 'eslint-plugin-prettier';

const baseConfig = {
  plugins: {
    '@typescript-eslint': tseslint,
    import: importPlugin,
    'simple-import-sort': simpleImportSortPlugin,
    'unused-imports': unusedImportsPlugin,
    prettier: prettierPlugin,
  },
  languageOptions: {
    parser: tsparser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    globals: {
      ...globals.es2022, // Base ES2022 globals
    },
  },
  rules: {
    // Prettier integration
    'prettier/prettier': 'error',

    // TypeScript strict rules - disable native rule to avoid conflicts
    '@typescript-eslint/no-unused-vars': 'off', // Handled by unused-imports
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' },
    ],

    // Import sorting and organization
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],

    // General code quality
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
  },
};

export default [
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.expo/**',
      '**/android/**',
      '**/ios/**',
      '**/target/**',
    ],
  },

  // Web app specific configuration
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    plugins: {
      ...baseConfig.plugins,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      ...baseConfig.languageOptions,
      globals: {
        ...baseConfig.languageOptions.globals,
        ...globals.browser, // Add browser globals (includes console, window, document, etc.)
      },
      parserOptions: {
        ...baseConfig.languageOptions.parserOptions,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...baseConfig.rules,
      // React specific rules
      'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      // Allow console in development/debugging (warning level)
      'no-console': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // API app specific configuration
  {
    files: ['apps/api/**/*.{ts,js}'],
    ...js.configs.recommended,
    plugins: baseConfig.plugins,
    languageOptions: {
      ...baseConfig.languageOptions,
      globals: {
        ...baseConfig.languageOptions.globals,
        ...globals.node, // Add Node.js globals
        console: 'writable', // Node.js console is writable, not readonly
        Bun: 'readonly', // Bun-specific global
      },
    },
    rules: {
      ...js.configs.recommended.rules, // Apply JS recommended first
      ...baseConfig.rules, // Then apply our base rules
      // Node.js/API specific rules - override no-console for server-side code
      'no-console': 'off', // Allow console.log in API/server code
      '@typescript-eslint/no-var-requires': 'off',
      // API handlers often have unused parameters (req, res, next)
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used', // More lenient for API handlers
          argsIgnorePattern: '^_|req|res|next|context|c',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // Mobile app specific configuration
  {
    files: ['apps/mobile/**/*.{ts,tsx}'],
    plugins: {
      ...baseConfig.plugins,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      ...baseConfig.languageOptions,
      globals: {
        ...baseConfig.languageOptions.globals,
        // React Native specific globals
        __DEV__: 'readonly',
        global: 'readonly',
        window: 'readonly',
        console: 'readonly', // Mobile console
      },
      parserOptions: {
        ...baseConfig.languageOptions.parserOptions,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...baseConfig.rules,
      // React Native specific rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'no-console': 'off', // Allow console in mobile dev
      // React Native often has unused props parameters
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_|props|navigation|route',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
