---
layout: content
---

# Vue

> Install and configure Vue

<div style="margin-bottom: 3rem;margin-left: 1rem;border-left-width: 1px;padding-left: 2rem;border-color:rgb(156 163 175 / 0.2);" class="[&>h3]:step steps  [counter-reset:step]">

### Create project

Start by creating a new Vue project using vite:

::package

#npm
```bash
npm create vite@latest
```

#yarn
```bash
yarn create vite@latest
```

#pnpm
```bash
pnpm create vite@latest
```

::

### Add dependencies

Install Destyler and unplugin-vue-components :

::package

#npm
```bash
npm install destyler unplugin-vue-components
```

#yarn
```bash
yarn add destyler unplugin-vue-components
```

#pnpm
```bash
pnpm add destyler unplugin-vue-components
```

::

### Edit vite.config.ts file

Add plugin to vite.config.ts file:

::custom-code{icon="vscode-icons:file-type-vite" name="vite.config"}

```ts
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { DestylerUIResolver } from 'destyler/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // ...otherPlugins
    Components({
      resolvers: [
        DestylerUIResolver(),
      ]
    }),
  ],
})
```

::

</div>
