'use strict';

module.exports = {
  ignorePatterns: ['build/', 'src/generated/'],
  extends: ['airbnb-base'],
  plugins: ['@typescript-eslint', 'prettier-vue'],
  overrides: [
    {
      files: ['./.eslintrc.js'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier-vue/recommended',
      ],
      files: ['src/**/*.ts', 'src/**/*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: 'tsconfig.json',
        extraFileExtensions: ['.vue'],
      },
      rules: {
        'import/extensions': 0,
        'import/no-unresolved': 0,
        'import/order': ['error', { alphabetize: { order: 'asc' } }],
        'sort-imports': ['error', { ignoreDeclarationSort: true }],
      },
    },
  ],
  rules: {
    'max-len': ['error', { code: 120 }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    strict: ['error', 'global'],
  },
};
