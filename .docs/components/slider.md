---
layout: docs
component: slider
---

# Slider

> An input where the user selects a value from within a given range.

<Preview name="slider" />

## Features

<Features :lists="[
  'Can be controlled or uncontrolled.',
  'Supports multiple thumbs.',
  'Supports a minimum value between thumbs.',
  'Supports touch or click on track to update value.',
  'Supports Right to Left direction.',
  'Full keyboard navigation.',
]" />

## Install

<CodeGroupPackage name="@destyler/slider" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from '@destyler/slider'
</script>

<template>
  <SliderRoot>
    <SliderTrack>
      <SliderRange />
    </SliderTrack>
    <SliderThumb />
  </SliderRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/slider/.docs/root.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Track

<!--@include: ../../packages/components/slider/.docs/track.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Range

<!--@include: ../../packages/components/slider/.docs/range.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Thumb

<!--@include: ../../packages/components/slider/.docs/thumb.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>
