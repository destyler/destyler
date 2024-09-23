---
layout: docs
component: visuallyHidden
---

# Visually Hidden

> Hides content from the screen in an accessible way.

## Features

<Features :lists="[
'Visually hides content while preserving it for assistive technology.',
]" />

## Install

<CodeGroupPackage name="@destyler/visually-hidden" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue
<script setup lang="ts">
import { VisuallyHidden } from '@destyler/visually-hidden'
</script>

<template>
  <VisuallyHidden>
    <slot />
  </VisuallyHidden>
</template>
```

</template>

</CodePreview>

## API

### VisuallyHidden

<!--@include: ../../../packages/components/visuallyHidden/.docs/visuallyHidden.md-->
