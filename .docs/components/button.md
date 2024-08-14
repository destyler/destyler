---
layout: docs
component: button
---

# Button

> Button is used to trigger some actions.

<Preview name="buttons" />

## Features

<Features :lists="[
'Native HTML <button> element support.',
'<a> and custom element type support via the WAI ARIA Button design pattern.',
'Keyboard event support for Space and Enter keys.',
]" />

## Install

<CodeGroupPackage name="@destyler/button" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
<script setup lang="ts">
import { Button } from '@destyler/button'
</script>

<template>
  <Button />
</template>
```

</template>

</CodePreview>

## API

### Button

<!--@include: ../../packages/components/button/.docs/button.md-->
