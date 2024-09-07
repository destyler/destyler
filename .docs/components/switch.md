---
layout: docs
component: switch
---

# Switch

> A control that allows the user to toggle between checked and not checked.

<Preview name="switchs" />

## Features

<Features :lists="[
  'Full keyboard navigation.',
  'Can be controlled or uncontrolled.',
]" />

## Install

<CodeGroupPackage name="@destyler/switch" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  SwitchRoot,
  SwitchThumb,
} from '@destyler/switch'
</script>

<template>
  <SwitchRoot>
    <SwitchThumb />
  </SwitchRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/switch/.docs/root.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'checked\' | \'unchecked\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Thumb

<!--@include: ../../packages/components/switch/.docs/thumb.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'checked\' | \'unchecked\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>
