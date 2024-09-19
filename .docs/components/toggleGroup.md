---
layout: docs
component: toggle
---

# Toggle Group

> A set of two-state buttons that can be toggled on or off.

<Preview name="toggleGroup" />

## Features

<Features :lists="[
  'Full keyboard navigation.',
  'Supports horizontal/vertical orientation.',
  'Support single and multiple pressed buttons.',
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
import {
  ToggleGroupItem,
  ToggleGroupRoot
} from '@destyler/toggle'
</script>

<template>
  <ToggleGroupRoot>
    <ToggleGroupItem />
  </ToggleGroupRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/toggle/.docs/groupRoot.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
  ]"
/>

### Item

<!--@include: ../../packages/components/toggle/.docs/groupItem.md-->

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
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
  ]"
/>
