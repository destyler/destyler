---
layout: docs
component: navigation
---

# Navigation

> A collection of links for navigating websites.

<Preview name="navigation" />

## Features

<Features :lists="[
  'Can be controlled or uncontrolled.',
  'Flexible layout structure with managed tab focus.',
  'Supports submenus.',
  'Optional active item indicator.',
  'Full keyboard navigation.',
  'Exposes CSS variables for advanced animation.',
  'Supports custom timings.',
]" />

## Install

<CodeGroupPackage name="@destyler/navigation" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  NavigationContent,
  NavigationIndicator,
  NavigationItem,
  NavigationLink,
  NavigationList,
  NavigationRoot,
  NavigationSub,
  NavigationTrigger,
  NavigationViewport,
} from '@destyler/navigation'
</script>

<template>
  <NavigationRoot>
    <NavigationList>
      <NavigationItem>
        <NavigationTrigger />
        <NavigationContent>
          <NavigationLink />
        </NavigationContent>
      </NavigationItem>

      <NavigationItem>
        <NavigationLink />
      </NavigationItem>

      <NavigationItem>
        <NavigationTrigger />
        <NavigationContent>
          <NavigationSub>
            <NavigationList />
            <NavigationViewport />
          </NavigationSub>
        </NavigationContent>
      </NavigationItem>

      <NavigationIndicator />
    </NavigationList>

    <NavigationViewport />
  </NavigationRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/navigation/.docs/root.md-->

### List

<!--@include: ../../packages/components/navigation/.docs/list.md-->

### Item

<!--@include: ../../packages/components/navigation/.docs/item.md-->

### Trigger

<!--@include: ../../packages/components/navigation/.docs/trigger.md-->

### Content

<!--@include: ../../packages/components/navigation/.docs/content.md-->

### Link

<!--@include: ../../packages/components/navigation/.docs/link.md-->

### Sub

<!--@include: ../../packages/components/navigation/.docs/sub.md-->

### Viewport

<!--@include: ../../packages/components/navigation/.docs/viewport.md-->

### Indicator

<!--@include: ../../packages/components/navigation/.docs/indicator.md-->
