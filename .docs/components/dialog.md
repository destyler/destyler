---
layout: docs
component: dialog
---

# Dialog

> Before taking action, please confirm.

<Preview name="dialogs" />

## Features

<Features :lists="[
'Supports modal and non-modal modes.',
'Focus is automatically trapped when modal.',
'Can be controlled or uncontrolled.',
'Manages screen reader announcements with Title and Description components.',
'Esc closes the component automatically.'
]" />

## Install

<CodeGroupPackage name="@destyler/dialog" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@destyler/dialog'
</script>

<template>
  <DialogRoot>
    <DialogTrigger />
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle />
        <DialogDescription />
        <DialogClose />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/dialog/.docs/root.md-->

### Trigger

<!--@include: ../../packages/components/dialog/.docs/trigger.md-->

### Portal

<!--@include: ../../packages/components/dialog/.docs/portal.md-->

### Overlay

<!--@include: ../../packages/components/dialog/.docs/overlay.md-->

### Content

<!--@include: ../../packages/components/dialog/.docs/content.md-->

### Title

<!--@include: ../../packages/components/dialog/.docs/title.md-->

### Description

<!--@include: ../../packages/components/dialog/.docs/description.md-->

### Close

<!--@include: ../../packages/components/dialog/.docs/close.md-->
