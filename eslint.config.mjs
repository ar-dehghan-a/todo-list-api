import globals from 'globals'
import pluginJs from '@eslint/js'

export default [
  {files: ['**/*.js'], languageOptions: {sourceType: 'commonjs'}},
  {languageOptions: {globals: globals.node}},
  pluginJs.configs.recommended,
  {
    rules: {
      'no-console': ['warn', {allow: ['warn', 'error']}],
      'no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
    },
  },
]
