---
layout: docs
component: aspectRadio
---

# AspectRadio

> Displays content within a desired ratio.

<Preview name="aspectRadio" />

## Features

<Features :lists="[
'Accepts any custom ratio.',
]" />

## Install

<CodeGroupPackage name="@destyler/aspect-radio" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue
<script setup lang="ts">
import { AspectRadio } from '@destyler/aspect-radio'
</script>

<template>
  <AspectRadio />
</template>
```

</template>

</CodePreview>

## API Reference

### Root

Contains the content you want to constrain to a given ratio.

<!--@include: ../../packages/components/aspectRadio/.docs/aspectRadio.md-->
