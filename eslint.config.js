const js = require('@eslint/js')
const eslintConfigPrettier = require('eslint-config-prettier')
const globals = require('globals')

module.exports = [
  {
    ignores: ['node_modules/**']
  },
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
]
