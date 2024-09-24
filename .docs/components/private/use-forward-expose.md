---
layout: docs
composition: true
---

# useForwardExpose

> Forward component is exposed value, props and `$el`.

When constructing a component with multiple root nodes, template refs won't return the DOM element via [$el](https://vuejs.org/api/component-instance.html#el). Therefore, we must manually forward the `$el` in the template ref for this component. Alternatively, you can specify a particular element as the exposed element.

Additionally, this composable utility supplements the missing exposed `props` from template refs.

## Install

<CodeGroupPackage name="@destyler/composition" />

## Usage

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'},
]">

<template #vue>

```vue
<script setup lang="ts">
import { useForwardExpose } from '@destyler/composition'

const selectedElementId = ref(1)
const { forwardRef } = useForwardExpose()
</script>

<template>
  <span>
    <!-- We want to expose div as the template ref's element -->
    <div :ref="forwardRef">
      ...
    </div>
  </span>
</template>
```

</template>

</CodePreview>
