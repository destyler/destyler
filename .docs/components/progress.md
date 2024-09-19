---
layout: docs
component: progress
---

# Progress

> Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.

<Preview name="progresses" />

## Features

<Features :lists="[
  'Provides context for assistive technology to read the progress of a task.',
]" />

## Install

<CodeGroupPackage name="@destyler/progress" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  ProgressIndicator,
  ProgressRoot
} from '@destyler/progress'
</script>

<template>
  <ProgressRoot>
    <ProgressIndicator />
  </ProgressRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/progress/.docs/root.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'complete\' | \'indeterminate\'  | \'loading\'`
    },
    {
      name: '[data-value]',
      value:`The current value`
    },
    {
      name: '[data-max]',
      value:`The max value`
    }
  ]"
/>

### Indicator

<!--@include: ../../packages/components/progress/.docs/indicator.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'complete\' | \'indeterminate\'  | \'loading\'`
    },
    {
      name: '[data-value]',
      value:`The current value`
    },
    {
      name: '[data-max]',
      value:`The max value`
    }
  ]"
/>
