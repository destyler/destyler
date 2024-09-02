---
layout: docs
component: divider
---

# Divider

> Visually or semantically separates content.

<Preview name="divider" />

## Features

<Features :lists="[
'Supports horizontal and vertical orientations.'
]" />

## Install

<CodeGroupPackage name="@destyler/divider" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import { Divider } from '@destyler/divider'
</script>

<template>
  <Divider />
</template>
```

</template>

</CodePreview>

## API

### Divider

<!--@include: ../../packages/components/divider/.docs/divider.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' \| \'horizontal\'`
    },
  ]"
/>
