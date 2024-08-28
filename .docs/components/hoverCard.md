---
layout: docs
component: hoverCard
---

# Hover Card

> For sighted users to preview content available behind a link.

<Preview name="hoverCard" />

## Features

<Features :lists="[
  'Can be controlled or uncontrolled.',
  'Customize side, alignment, offsets, collision handling.',
  'Optionally render a pointing arrow.',
  'Supports custom open and close delays.',
  'Ignored by screen readers.',
]" />

## Install

<CodeGroupPackage name="@destyler/hover-card" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
} from '@destyler/hover-card'
</script>

<template>
  <HoverCardRoot>
    <HoverCardTrigger />
    <HoverCardPortal>
      <HoverCardContent />
    </HoverCardPortal>
  </HoverCardRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/hoverCard/.docs/root.md-->

### Trigger

<!--@include: ../../packages/components/hoverCard/.docs/trigger.md-->

### Portal

<!--@include: ../../packages/components/hoverCard/.docs/portal.md-->

### Content

<!--@include: ../../packages/components/hoverCard/.docs/content.md-->

### Arrow

<!--@include: ../../packages/components/hoverCard/.docs/arrow.md-->
