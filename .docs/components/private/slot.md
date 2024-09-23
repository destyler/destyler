---
layout: docs
component: primitive
---

# Slot

> Merges its props onto its direct child.

## Install

<CodeGroupPackage name="@destyler/primitive" />

## Usage

Using Slot from Destyler, the attributes of the Slot component will pass down to its direct child element, but you won't have access to Scoped Slots.

<CodePreview :tabs="[
  {value: 'comp', label: 'Comp.vue', icon: 'vscode-icons:file-type-vue'},
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #comp>

```vue
<script setup>
import { Slot } from '@destyler/primitive'
</script>

<template>
  <Slot id="destyler-1">
    ...
  </Slot>
</template>
```

</template>

<template #vue>

```vue
<script setup>
import Comp from './Comp.vue'
</script>

<template>
  <Comp>
    <button>
      ...
    </button>
  </Comp>
</template>
```

</template>

</CodePreview>
