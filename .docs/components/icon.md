---
layout: docs
component: icon
---

# Icon

> Icon module with 200,000+ ready to use icons from Iconify.

<Preview name="icon" />

## Features

<Features :lists="[
  'Support 200,000 open-source vector icons via Iconify',
  'Support both CSS mode / SVG mode',
]" />

## Install

<CodeGroupPackage name="@destyler/icon" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  Icon
} from '@destyler/icon'
</script>

<template>
  <Icon />
</template>
```

</template>

</CodePreview>

## API

### Icon

<!--@include: ../../packages/components/icon/.docs/icon.md-->
