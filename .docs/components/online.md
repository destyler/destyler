---
layout: docs
component: online
---

# Online

> A reactive offline indicator component

<Preview name="online" />

## Features

<Features :lists="[
  'Reactive online state.',
]" />

## Install

<CodeGroupPackage name="@destyler/online" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  Online
} from '@destyler/online'
</script>

<template>
  <Online />
</template>
```

</template>

</CodePreview>

## API

### Online

<!--@include: ../../packages/components/online/.docs/online.md-->
