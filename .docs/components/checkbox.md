---
layout: docs
component: checkbox
---

# Checkbox

> A control that allows the user to toggle between checked and not checked.

<Preview name="checkbox" />

## Features

<Features :lists="[
'Supports indeterminate state.',
'Full keyboard navigation.',
'Can be controlled or uncontrolled.',
]" />

## Install

<CodeGroupPackage name="@destyler/checkbox" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from '@destyler/checkbox'
</script>

<template>
  <CheckboxRoot>
    <CheckboxIndicator />
  </CheckboxRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/checkbox/.docs/root.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'checked\' \| \'unchecked\' \| \'indeterminate\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    }
  ]"
/>

### Indicator

<!--@include: ../../packages/components/checkbox/.docs/indicator.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'checked\' \| \'unchecked\' \| \'indeterminate\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    }
  ]"
/>
