/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ['src'],
  tsconfig: './tsconfig.json',
  name: 'Demo Docs',
  plugin: ['./dist/index.js'],
  theme: 'navigation',
};
