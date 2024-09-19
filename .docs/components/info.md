---
layout: docs
component: info
---

# Info

> Displays a callout for user attention.

<Preview name="info" />

## Features

<Features :lists="[
  'Completely controllable to display and turn off.',
]" />

## Install

<CodeGroupPackage name="@destyler/info" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  InfoClose,
  InfoRoot
} from '@destyler/info'
</script>

<template>
  <InfoRoot>
    <InfoClose />
  </InfoRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/info/.docs/root.md-->

### Close

<!--@include: ../../packages/components/info/.docs/close.md-->
