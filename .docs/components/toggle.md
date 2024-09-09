---
layout: docs
component: toggle
---

# Toggle

> A two-state button that can be either on or off.

<Preview name="toggle" />

## Features

<Features :lists="[
  'Full keyboard navigation.',
  'Can be controlled or uncontrolled.',
]" />

## Install

<CodeGroupPackage name="@destyler/toggle" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import { Toggle } from '@destyler/toggle'
</script>

<template>
  <Toggle />
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/toggle/.docs/toggle.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'on\' | \'off\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>
