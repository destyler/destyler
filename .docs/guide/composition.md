---
layout: docs
desc: unstyled component for vue.
---

# Composition

> Use the `asChild` prop to compose Destyler functionality onto alternative element types or your own Vue components.
>
> All Destyler Components parts that render a DOM element accept an `asChild` prop. When `asChild` is set to `true`, Destyler will not render a default DOM element, instead passing the props and behavior required to make it functional to the first child of the slots.

## Changing the element type

In the majority of cases you shouldn’t need to modify the element type as Destyler has been designed to provide the most appropriate defaults. However, there are cases where it is helpful to do so.

A good example is with `TooltipTrigger`. By default this part is rendered as a `button`, though you may want to add a tooltip to a link (`a` tag) as well. Let's see how you can achieve this using `asChild`:

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import { TooltipPortal, TooltipRoot, TooltipTrigger } from 'destyler'
</script>

<template>
  <TooltipRoot>
    <TooltipTrigger as-child>
      <a href="https://vuejs.org/">Vue.js</a>
    </TooltipTrigger>
    <TooltipPortal>…</TooltipPortal>
  </TooltipRoot>
</template>
```

</template>

</CodePreview>

::: tip
If you do decide to change the underlying element type, it is your responsibility to ensure it remains accessible and functional. In the case of `TooltipTrigger` for example, it must be a focusable element that can respond to pointer and keyboard events. If you were to switch it to a `div`, it would no longer be accessible.
:::

In reality, you will rarely modify the underlying DOM element like we've seen above. Instead it's more common to use your own Vue components. This is especially true for most `Trigger` parts, as you usually want to compose the functionality with the custom buttons and links in your design system.

## Composing multiple components

> `asChild` can be used as deeply as you need to. This means it is a great way to compose multiple components's behavior together. Here is an example of how you can compose `TooltipTrigger` and `DialogTrigger` together with your own button:

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  DialogPortal,
  DialogRoot,
  DialogTrigger,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger
} from 'destyler'
import MyButton from '~/components/MyButton.vue'
</script>

<template>
  <DialogRoot>
    <TooltipRoot>
      <TooltipTrigger as-child>
        <DialogTrigger as-child>
          <MyButton>Open dialog</MyButton>
        </DialogTrigger>
      </TooltipTrigger>
      <TooltipPortal>…</TooltipPortal>
    </TooltipRoot>

    <DialogPortal>...</DialogPortal>
  </DialogRoot>
</template>
```

</template>

</CodePreview>
