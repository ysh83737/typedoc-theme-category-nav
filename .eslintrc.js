/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'import/extensions': 'off',
  },
};
