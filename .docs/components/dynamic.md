---
layout: docs
component: dynamic
---

# Dynamic

> inputs render tags inside an input, followed by an actual text input.

<Preview name="dynamic" />

## Features

<Features :lists="[
  'Can be controlled or uncontrolled.',
  'Full keyboard navigation.',
  'Limit the number of tags.',
  'Accept value from clipboard.',
  'Clear button to reset all tags values.',
]" />

## Install

<CodeGroupPackage name="@destyler/dynamic" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup>
import {
  DynamicClear,
  DynamicInput,
  DynamicItem,
  DynamicItemDelete,
  DynamicItemText,
  DynamicRoot
} from '@destyler/dynamic'
</script>

<template>
  <DynamicRoot>
    <DynamicItem>
      <DynamicItemText />
      <DynamicItemDelete />
    </DynamicItem>

    <DynamicInput />
    <DynamicClear />
  </DynamicRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/dynamic/.docs/root.md-->

### Item

<!--@include: ../../packages/components/dynamic/.docs/item.md-->

### ItemText

<!--@include: ../../packages/components/dynamic/.docs/itemText.md-->

### ItemDelete

<!--@include: ../../packages/components/dynamic/.docs/itemDelete.md-->

### Input

<!--@include: ../../packages/components/dynamic/.docs/input.md-->

### Clear

<!--@include: ../../packages/components/dynamic/.docs/clear.md-->
