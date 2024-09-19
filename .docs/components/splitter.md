---
layout: docs
component: splitter
---

# Splitter

> A component that divides your layout into resizable sections.

<Preview name="splitter" />

## Features

<Features :lists="[
  'Supports keyboard interaction.',
  'Supports horizontal/vertical layout.',
  'Supports nested layout.',
  'Supports Right to Left direction.',
  'Can resize across another panel.',
  'Can be mounted conditionally.',
]" />

## Install

<CodeGroupPackage name="@destyler/splitter" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  SplitterGroup,
  SplitterPanel,
  SplitterResizeHandle
} from '@destyler/splitter'
</script>

<template>
  <SplitterGroup>
    <SplitterPanel />
    <SplitterResizeHandle />
  </SplitterGroup>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/splitter/.docs/root.md-->

### Group

<!--@include: ../../packages/components/splitter/.docs/group.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
    {
      name: '[data-state]',
      value:`\'collapsed\' | \'expanded\' | \'Present when collapsbile\'`
    },
  ]"
/>

### Panel

<!--@include: ../../packages/components/splitter/.docs/panel.md-->

### ResizeHandle

<!--@include: ../../packages/components/splitter/.docs/resizeHandle.md-->

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
    {
      name: '[data-state]',
      value:`\'drag\' | \'hover\' | \'inactive\'`
    },
  ]"
/>
