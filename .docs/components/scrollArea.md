---
layout: docs
component: scrollArea
---

# Scroll Area

> Augments native scroll functionality for custom, cross-browser styling.

<Preview name="scrollArea" />

## Features

<Features :lists="[
  'Scrollbar sits on top of the scrollable content, taking up no space.',
  'Scrolling is native; no underlying position movements via CSS transformations.',
  'Shims pointer behaviors only when interacting with the controls, so keyboard controls are unaffected.',
  'Supports Right to Left direction.',
]" />

## Install

<CodeGroupPackage name="@destyler/scroll-area" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '@destyler/scroll-area'
</script>

<template>
  <ScrollAreaRoot>
    <ScrollAreaViewport />
    <ScrollAreaScrollbar>
      <ScrollAreaThumb />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/scrollArea/.docs/root.md-->

### Viewport

<!--@include: ../../packages/components/scrollArea/.docs/viewport.md-->

### Scrollbar

<!--@include: ../../packages/components/scrollArea/.docs/scrollbar.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'visible\' | \'hidden\'`
    },
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
  ]"
/>

### Thumb

<!--@include: ../../packages/components/scrollArea/.docs/thumb.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'visible\' | \'hidden\'`
    },
  ]"
/>

### Corner

<!--@include: ../../packages/components/scrollArea/.docs/corner.md-->
