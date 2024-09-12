---
layout: docs
desc: A quick tutorial to get you up and running with Destyler.
---

# Getting Started

> A quick tutorial to get you up and running with Destyler.

## Implementing a Popover

In this quick tutorial, we will install and style the [Popover](/components/popover) component.

### 1. Install the package

Install the component from your command line.

<CodeGroupPackage name="@destyler/popover" />

### 2. Import the parts

Import and structure the parts.

<CodePreview :tabs="[
  {value: 'vue', label: 'Popover.vue', icon: 'vscode-icons:file-type-vue'}
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
    <PopoverTrigger>More info</PopoverTrigger>
    <PopoverPortal>
      <PopoverContent>
        Some more info...
        <PopoverClose />
        <PopoverArrow />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
```

</template>

</CodePreview>

### 3. Add your styles

Add styles where desired.

<CodePreview :tabs="[
  {value: 'vue', label: 'Popover.vue', icon: 'vscode-icons:file-type-vue'}
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
    <PopoverTrigger class="popover-trigger">
      More info
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        class="popover-content"
        :side-offset="5"
      >
        Some more info...
        <PopoverClose />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style>
.popover-trigger {
  display: inline-block;
  cursor: pointer;
  border-radius: 4px;
  background-color: rgb(13 148 136);
  padding: 4px 16px;
  color: rgb(255 255 255);
}

.popover-content {
  border-radius: 4px;
  padding: 8px;
  width: 260px;
  background-color: rgb(13 148 136);
  color: rgb(255 255 255);
}
</style>
```

</template>

</CodePreview>

### Demo

Here's a complete demo.

<Preview name="started" />

## Summary

The steps above outline briefly what's involved in using a Destyler in your application.

These components are low-level enough to give you control over how you want to wrap them. You're free to introduce your own high-level API to better suit the needs of your team and product.

In a few simple steps, we've implemented a fully accessible Popover component, without having to worry about many of its complexities.

<Features :lists="[
  'Adheres to WAI-ARIA design pattern.',
  'Can be controlled or uncontrolled.',
  'Customize side, alignment, offsets, collision handling.',
  'Optionally render a pointing arrow.',
  'Focus is fully managed and customizable.',
  'Dismissing and layering behavior is highly customizable.',
]" />
