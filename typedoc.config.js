/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ['src'],
  tsconfig: './tsconfig.json',
  name: 'Demo Docs',
  plugin: [
    'typedoc-theme-category-nav',
  ],
  theme: 'navigation',
};
