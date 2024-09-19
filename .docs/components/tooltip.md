---
layout: docs
component: tooltip
---

# Tooltip

> A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

<Preview name="tooltip" />

## Features

<Features :lists="[
  'Provider to control display delay globally.',
  'Opens when the trigger is focused or hovered.',
  'Closes when the trigger is activated or when  pressing escape.',
  'Supports custom timings.',
]" />

## Install

<CodeGroupPackage name="@destyler/tooltip" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger
} from '@destyler/tooltip'
</script>

<template>
  <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger />
      <TooltipPortal>
        <TooltipContent>
          <TooltipArrow />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
```

</template>

</CodePreview>

## API

### Provider

<!--@include: ../../packages/components/tooltip/.docs/provider.md-->

### Root

<!--@include: ../../packages/components/tooltip/.docs/root.md-->

### Trigger

<!--@include: ../../packages/components/tooltip/.docs/trigger.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'closed\' | \'delayed-open\' | \'instant-open\'`
    },
  ]"
/>

### Portal

<!--@include: ../../packages/components/tooltip/.docs/portal.md-->

### Content

<!--@include: ../../packages/components/tooltip/.docs/content.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'closed\' | \'delayed-open\' | \'instant-open\'`
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
      name: '--destyler-tooltip-content-transform-origin',
      description:`The <code>transform-origin</code> computed from the content and arrow positions/offsets`
    },
    {
      name: '--destyler-tooltip-content-available-width',
      description:`The remaining width between the trigger and the boundary edge`
    },
    {
      name: '--destyler-tooltip-content-available-height',
      description:`The remaining height between the trigger and the boundary edge`
    },
    {
      name: '--destyler-tooltip-trigger-width',
      description:`The width of the trigger`
    },
    {
      name: '--destyler-tooltip-trigger-height',
      description:`The height of the trigger`
    },
  ]"
/>

### Arrow

<!--@include: ../../packages/components/tooltip/.docs/arrow.md-->
