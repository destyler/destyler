---
layout: docs
component: image
---

# Image

> An image element with a fallback

<Preview name="images" />

## Features

<Features :lists="[
  'Automatic and manual control over when the image renders.',
  'Fallback part accepts any children.',
  'Optionally delay fallback rendering to avoid content flashing.',
]" />

## Install

<CodeGroupPackage name="@destyler/image" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import { Image, ImageFallback, ImageRoot } from '@destyler/image'
</script>

<template>
  <ImageRoot>
    <Image />
    <ImageFallback />
  </ImageRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/image/.docs/root.md-->

### Image

<!--@include: ../../packages/components/image/.docs/image.md-->

### Fallback

<!--@include: ../../packages/components/image/.docs/fallback.md-->
