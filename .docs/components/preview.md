---
layout: docs
component: preview
---

# Preview

> Preview any element in slot.

<Preview name="preview" />

## Features

<Features :lists="[
  'Can be controlled or uncontrolled.',
  'Manages screen reader announcements with Title and Description components.',
]" />

## Install

<CodeGroupPackage name="@destyler/preview" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  PreviewDialog,
  PreviewRoot,
} from '@destyler/preview'
</script>

<template>
  <PreviewRoot>
    <PreviewDialog />
  </PreviewRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/preview/.docs/root.md-->

### Dialog

<!--@include: ../../packages/components/preview/.docs/dialog.md-->
