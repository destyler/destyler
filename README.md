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

- [radix-ui](https://github.com/radix-ui/primitives)
- [radix-vue](https://github.com/radix-vue/radix-vue)
- [naive-ui](https://github.com/tusen-ai/naive-ui)
- [kobalte](https://github.com/kobaltedev/kobalte)
- [oku-ui](https://github.com/oku-ui/primitives)
- [headlessui](https://github.com/tailwindlabs/headlessui)
- [melt-ui](https://github.com/melt-ui/melt-ui)
- [vueuse](https://github.com/vueuse/vueuse)
- [anu](https://github.com/jd-solanki/anu)
- [floating-ui](https://github.com/floating-ui/floating-ui)
- [primevue](https://github.com/primefaces/primevue)
- [shadcn-ui](https://github.com/shadcn-ui/ui)
- [nuxt-ui](https://github.com/nuxt/ui)
- [nuxt-ui-pro](https://github.com/nuxt-ui-pro)
