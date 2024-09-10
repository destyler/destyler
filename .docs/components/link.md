---
layout: docs
component: link
---

# Link

> Allows a user to navigate to another page or resource within a web page or application.

<Preview name="links" />

## Features

<Features :lists="[
  'Native HTML <a /> element support.',
  'Custom element type support via the WAI ARIA Link design pattern.',
  'Support for disabled links.'
]" />

## Install

<CodeGroupPackage name="@destyler/link" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import { Link } from '@destyler/link'
</script>

<template>
  <Link />
</template>
```

</template>

</CodePreview>

## API

### Link

<!--@include: ../../packages/components/link/.docs/link.md-->

<Attribute
  :value="[
    {
      name:'[data-disabled]',
      value:'Present when disabled'
    }
  ]"
/>
