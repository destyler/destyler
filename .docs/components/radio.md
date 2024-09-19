---
layout: docs
component: radio
---

# Radio

> A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.

<Preview name="radio" />

## Features

<Features :lists="[
  'Full keyboard navigation.',
  'Supports horizontal/vertical orientation.',
  'Can be controlled or uncontrolled.',
]" />

## Install

<CodeGroupPackage name="@destyler/radio" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupRoot,
} from '@destyler/radio'
</script>

<template>
  <RadioGroupRoot>
    <RadioGroupItem>
      <RadioGroupIndicator />
    </RadioGroupItem>
  </RadioGroupRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/radio/.docs/groupRoot.md-->

<Attribute
  :value="[
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Item

<!--@include: ../../packages/components/radio/.docs/groupItem.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'checked\' | \'unchecked\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Indicator

<!--@include: ../../packages/components/radio/.docs/groupIndicator.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'checked\' | \'unchecked\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>
