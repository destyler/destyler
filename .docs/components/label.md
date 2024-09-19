---
layout: docs
component: label
---

# Label

> Renders an accessible label associated with controls.

<Preview name="labels" />

## Features

<Features :lists="[
  'Text selection is prevented when double clicking label.',
  'Supports nested controls.',
]" />

## Install

<CodeGroupPackage name="@destyler/label" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import { Label } from '@destyler/label'
</script>

<template>
  <Label />
</template>
```

</template>

</CodePreview>

## API

### Label

<!--@include: ../../packages/components/label/.docs/label.md-->
