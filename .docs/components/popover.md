---
layout: docs
component: popover
---

# Popover

> Displays rich content in a portal, triggered by a button.

<Preview name="popover" />

## Features

<Features :lists="[
  'Can be controlled or uncontrolled.',
  'Customize side, alignment, offsets, collision handling.',
  'Optionally render a pointing arrow.',
  'Focus is fully managed and customizable.',
  'Supports modal and non-modal modes.',
  'Dismissing and layering behavior is highly customizable.',
]" />

## Install

<CodeGroupPackage name="@destyler/popover" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger
} from '@destyler/popover'
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger />
    <PopoverPortal>
      <PopoverContent>
        <PopoverClose />
        <PopoverArrow />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/popover/.docs/root.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' | \'closed\'`
    }
  ]"
/>

### Trigger

<!--@include: ../../packages/components/popover/.docs/trigger.md-->

### Portal

<!--@include: ../../packages/components/popover/.docs/portal.md-->

### Content

<!--@include: ../../packages/components/popover/.docs/content.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' | \'closed\'`
    },
    {
      name: '[data-side]',
      value:`\'left\' | \'right\' | \'bottom\' | \'top\'`
    },
    {
      name: '[data-align]',
      value:`\'start\' | \'end\' | \'center\'`
    },
  ]"
/>

<Variable
  :value="[
    {
      name: '--destyler-popover-content-transform-origin',
      description:`The <code>transform-origin</code> computed from the content and arrow positions/offsets`
    },
    {
      name: '--destyler-popover-content-available-width',
      description:`The remaining width between the trigger and the boundary edge`
    },
    {
      name: '--destyler-popover-content-available-height',
      description:`The remaining height between the trigger and the boundary edge`
    },
    {
      name: '--destyler-popover-trigger-width',
      description:`The width of the trigger`
    },
    {
      name: '--destyler-popover-trigger-height',
      description:`The height of the trigger`
    },
  ]"
/>

### Arrow

<!--@include: ../../packages/components/popover/.docs/arrow.md-->

### Close

<!--@include: ../../packages/components/popover/.docs/close.md-->
