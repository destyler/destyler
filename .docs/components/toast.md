---
layout: docs
component: toast
---

# Toast

> A succinct message that is displayed temporarily.

<Preview name="toast" />

## Features

<Features :lists="[
  'Automatically closes.',
  'Pauses closing on hover, focus and window blur.',
  'Supports hotkey to jump to toast viewport.',
  'Supports closing via swipe gesture.',
  'Exposes CSS variables for swipe gesture animations.',
  'Can be controlled or uncontrolled.',
]" />

## Install

<CodeGroupPackage name="@destyler/toast" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport
} from '@destyler/toast'
</script>

<template>
  <ToastProvider>
    <ToastRoot>
      <ToastTitle />
      <ToastDescription />
      <ToastAction />
      <ToastClose />
    </ToastRoot>

    <ToastViewport />
  </ToastProvider>
</template>
```

</template>

</CodePreview>

## API

### Provider

<!--@include: ../../packages/components/toast/.docs/provider.md-->

### Viewport

<!--@include: ../../packages/components/toast/.docs/viewport.md-->

### Root

<!--@include: ../../packages/components/toast/.docs/root.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' | \'closed\'`
    },
    {
      name: '[data-swipe]',
      value:`\'start\' | \'move\' | \'cancel\' | \'end\'`
    },
    {
      name: '[data-swipe-direction]',
      value:`\'up\' | \'down\' | \'left\' | \'right\'`
    },
  ]"
/>

### Title

<!--@include: ../../packages/components/toast/.docs/title.md-->

### Description

<!--@include: ../../packages/components/toast/.docs/description.md-->

### Action

<!--@include: ../../packages/components/toast/.docs/action.md-->

### Close

<!--@include: ../../packages/components/toast/.docs/close.md-->
