# typedoc-theme-category-nav

> 

A typedoc theme that override navigation by categories.

## Installation

```bash
npm install typedoc-theme-category-nav
```

## Usage

```bash
typedoc [TARGET] --plugin typedoc-theme-category-nav --theme navigation
```

Or typedoc options

```js
// typedoc.config.js

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  // ...
  plugin: ['typedoc-theme-category-nav'],
  theme: 'navigation',
};
```