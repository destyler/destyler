---
layout: docs
component: modal
---

# Modal

> A modal dialog that interrupts the user with important content and expects a response.

<Preview name="modal" />

## Features

<Features :lists="[
  'Focus is automatically trapped.',
  'Can be controlled or uncontrolled.',
  'Manages screen reader announcements with Title and Description components.',
  'Esc closes the component automatically.',
]" />

## Install

<CodeGroupPackage name="@destyler/modal" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  ModalAction,
  ModalCancel,
  ModalContent,
  ModalDescription,
  ModalOverlay,
  ModalPortal,
  ModalRoot,
  ModalTitle,
  ModalTrigger,
} from '@destyler/modal'
</script>

<template>
  <ModalRoot>
    <ModalTrigger />
    <ModalPortal>
      <ModalOverlay />
      <ModalContent>
        <ModalTitle />
        <ModalDescription />
        <ModalCancel />
        <ModalAction />
      </ModalContent>
    </ModalPortal>
  </ModalRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/modal/.docs/root.md-->

### Trigger

<!--@include: ../../packages/components/modal/.docs/trigger.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' | \'closed\'`
    }
  ]"
/>

### Portal

<!--@include: ../../packages/components/modal/.docs/portal.md-->

### Overlay

<!--@include: ../../packages/components/modal/.docs/overlay.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' | \'closed\'`
    }
  ]"
/>

### Content

<!--@include: ../../packages/components/modal/.docs/content.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' | \'closed\'`
    }
  ]"
/>

### Title

<!--@include: ../../packages/components/modal/.docs/title.md-->

### Description

<!--@include: ../../packages/components/modal/.docs/description.md-->

### Cancel

<!--@include: ../../packages/components/modal/.docs/cancel.md-->

### Action

<!--@include: ../../packages/components/modal/.docs/action.md-->
