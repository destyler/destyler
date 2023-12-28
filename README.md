<h1 align=center>Destyler</h1>

<p align=center>unstyled component for vue.</p>

## Features

- On demand Import - Provide resolver to automatically import only used components.
- Typescript Supported - Support TypeScript & type checked & type inference.
- Unstyled - easily customizable and great for building design system and web apps.

## Install

```bash
pnpm install destyler
```

## On-demand Import

You need to use an additional plugin to import components you used. First you need to install [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) and [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import).

```bash
pnpm install -D unplugin-vue-components unplugin-auto-import
```

Then add the code below into your Vite config file.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { DestylerUIPresets, DestylerUIResolver } from 'destyler'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      imports: [
        DestylerUIPresets,
      ],
    }),
    Components({
      resolvers: [
        DestylerUIResolver(),
      ],
    }),
  ],
})
```
