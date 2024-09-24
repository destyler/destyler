---
layout: docs
component: primitive
---

# Primitive

> Functionality onto alternative element types or your own Vue components.
>
>When you are building a component, in some cases you might want to allow user to compose some functionalities onto the underlying element, or alternative element. This is where Primitive comes in handy as it expose this capability to the user.

## Install

<CodeGroupPackage name="@destyler/primitive" />

## Usage

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue
// @noErrors
<script setup>
import { Primitive } from '@destyler/primitive'
</script>

<template>
  <Primitive as="span">
    ...
  </Primitive>
</template>
```

</template>

</CodePreview>

## API

<!--@include: ../../../packages/components/primitive/.docs/primitive.md-->
