'use strict';

module.exports = {
  ignorePatterns: ['dist/', 'src/generated/'],
  extends: [
    'airbnb-base',
  ],
  overrides: [{
    files: ['./.eslintrc.js', './snowpack.config.js'],
    parserOptions: {
      sourceType: 'script',
    },
  }, {
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:vue/recommended',
    ],
    files: ['src/**/*.ts', 'src/**/*.vue'],
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser',
      project: 'tsconfig.json',
      extraFileExtensions: ['.vue'],
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': ['warn', { allowedNames: ['setup'] }],
      'import/extensions': 0,
      'import/no-unresolved': 0,
      'import/order': ['error', { alphabetize: { order: 'asc' } }],
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
    },
  }],
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'max-len': ['error', { code: 120 }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    strict: ['error', 'global'],
  },
};
