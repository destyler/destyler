---
layout: docs
desc: Install and configure Destyler.
---

# Install

> How to install dependencies and structure your app.

## Installing the package

<CodeGroupPackage name="destyler @internationalized/date" />

## unplugin-vue-components

Destyker also has resolver for the popular [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components).

In `vite.config.ts`, import `destyler/resolver`, and configure as such and it will auto-imports all the components from Destyler.

<CodePreview :tabs="[
  {value: 'vite', label: 'vite.config.ts', icon: 'vscode-icons:file-type-vite'}
]">

<template #vite>

```ts twoslash
// @noErrors
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import DestylerResolver from 'destyler/resolver'

export default defineConfig({
  plugins: [
    Vue(),
    Components({
      dts: true,
      resolvers: [
        DestylerResolver()
      ]
    })
  ]
})
```

</template>

</CodePreview>
