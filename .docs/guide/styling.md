---
layout: docs
desc: unstyled component for vue.
---

# Styling

> Destyler are unstyled and compatible with any styling solution—giving you complete control over styling.

## Overview

### Functional styles

You are in control of all aspects of styling, including functional styles. For example, by default, a [Dialog Overlay](../components/dialog) won't cover the entire viewport. You're responsible for adding those styles, plus any presentation styles.

### Classes

All components accept `class` attributes, just like normal component. This class will be passed through to the DOM element. You can use it in CSS as expected.

#### Teleported elements

Some elements, such as modals or popovers, are teleported to the `body`. When using scoped style to apply CSS, you will need to use [deep selectors](https://vuejs.org/api/sfc-css-features.html#deep-selectors) to target them.

### Data attributes

When components are stateful, their state will be exposed in a `data-state` attribute. For example, when an [Collapse Item](../components/collapse) is opened, it includes a `data-state="open"` attribute.

## Styling with CSS

### Styling a part

You can style a component part by targeting the `class` that you provide.

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue
<script setup lang="ts">
import { CollapseItem, CollapseRoot, ... } from 'destyler'
</script>

<template>
  <CollapseRoot>
    <CollapseItem class="collapse-item" value="item-1" />
    <!-- ... -->
  </CollapseRoot>
</template>

<style>
.collapse-item {
  /* ... */
}
</style>
```

</template>

</CodePreview>

### Styling a state

You can style a component state by targeting its `data-state` attribute.

<CodePreview :tabs="[
  {value: 'css', label: 'style.css', icon: 'vscode-icons:file-type-css'}
]">

<template #css>

```css
.collapse-item {
  border-bottom: 1px solid gainsboro;
}

.collapse-item[data-state="open"] {
  border-bottom-width: 2px;
}
```

</template>

</CodePreview>

### Scoped style

You can style a component using scoped style. Be wary of teleported elements, as they require the use of deep selectors to be targeted.

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue
<script setup lang="ts">
import { DropdownRoot, DropdownItem, ... } from 'destyler'
</script>

<template>
  <DropdownRoot>
    <!-- ... -->
    <DropdownPortal>
      <DropdownContent class="dropdown-content">
        <DropdownItem class="dropdown-item">An item</DropdownItem>
      </DropdownContent>
    </DropdownPortal>
  </DropdownRoot>
</template>

<style scoped>
:deep(.dropdown-content) {
  /* ... */
}

.dropdown-item {
  /* ... */
}
</style>
```

</template>

</CodePreview>

## Styling with Atomic CSS

The examples below are using [UnoCSS](https://unocss.dev/), but you can use any library of your choice.

### Styling a part

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue
<script setup lang="ts">
import { CollapseRoot, CollapseItem, ... } from 'destyler'
</script>

<template>
  <CollapseRoot>
    <CollapseItem class="border border-gray-400 rounded-2xl" value="item-1" />
    <!-- ... -->
  </CollapseRoot>
</template>
```

</template>

</CodePreview>

### Styling a state

With UnoCSS powerful variant selector, you can style a component state by targeting its data-state attribute.

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue
<script setup lang="ts">
import { CollapseRoot, CollapseItem, ... } from 'destyler'
</script>

<template>
  <CollapseRoot>
    <CollapseItem
      class="
        border border-gray-400 rounded-2xl
        data-[state=open]:border-b-2 data-[state=open]:border-gray-800
      "
      value="item-1"
    />
    <!-- ... -->
  </CollapseRoot>
</template>
```

</template>

</CodePreview>

## Summary

Destyler is components were designed to encapsulate accessibility concerns and other complex functionalities, while ensuring you retain complete control over styling.

For convenience, stateful components include a `data-state` attribute.
