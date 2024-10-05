<h1 align=center>Destyler</h1>

<p align=center>unstyled component for vue.</p>

<p align="center">
<a href="https://www.npmjs.com/package/destyler" target="__blank"><img src="https://img.shields.io/npm/v/destyler?color=a1b858&label=" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/destyler" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/destyler?color=50a36f&label="></a>
<a href="https://destyler.org/" target="__blank"><img src="https://img.shields.io/static/v1?label=&message=docs%20%26%20demos&color=1e8a7a" alt="Docs & Demos"></a>
<a href="https://destyler-dev.zeabur.app/components/checkbox" target="__blank"><img src="https://destyler.org/component-count-number.svg" alt="Components Count"></a>
<br>
<a href="https://github.com/destyler/destyler/stargazers" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/destyler/destyler?style=social"></a>
</p>

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
import Components from 'unplugin-vue-components/vite'
import { DestylerUIResolver } from 'destyler/resolver'

export default defineConfig({
  // ...
  plugins: [

    Components({
      resolvers: [
        DestylerUIResolver(),
      ],
    }),
  ],
})
```

## Credits

> All credits go to these open-source works and resources

- Radix UI - https://github.com/radix-ui/primitives
- Radix Vue - https://github.com/radix-vue/radix-vue
- Naïve UI - https://github.com/tusen-ai/naive-ui
- Kobalte - https://github.com/kobaltedev/kobalte
- Oku UI - https://github.com/oku-ui/primitives
- Headless UI - https://github.com/tailwindlabs/headlessui
- Melt UI - https://github.com/melt-ui/melt-ui
- vueuse - https://github.com/vueuse/vueuse
- Anu - https://github.com/jd-solanki/anu
- Floating UI - https://github.com/floating-ui/floating-ui
- primevue - https://github.com/primefaces/primevue
- Shadcn UI - https://github.com/shadcn-ui/ui
- nuxt-ui - https://github.com/nuxt/ui
- nuxt-ui-pro - https://github.com/nuxt-ui-pro

## License

[MIT](./LICENSE)

Copyright (c) 2023-present, Elone Hoo
