---
layout: docs
component: countdown
---

# Countdown

> A second is passed after a second has passed.

<Preview name="countdown" />

## Features

<Features :lists="[
'Supports countdown feature.',
'Customizable countdown duration.',
]" />

## Install

<CodeGroupPackage name="@destyler/countdown" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import { Countdown } from '@destyler/countdown'
</script>

<template>
  <Countdown />
</template>
```

</template>

</CodePreview>

## API

### Countdown

<!--@include: ../../packages/components/countdown/.docs/countdown.md-->
