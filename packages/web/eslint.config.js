import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig([
  globalIgnores(['dist']),
  // JS/JSX rules
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': 'off',
      'no-debugger': isProd ? 'error' : 'off',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  // TS/TSX + base configs
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    rules: {
      // turn off both variants
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-debugger': isProd ? 'error' : 'off',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
