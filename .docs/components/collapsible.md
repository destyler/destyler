---
layout: docs
component: collapsible
---

# Collapsible

> An interactive component which expands/collapses a panel.

<Preview name="collapsible" />

## Features

<Features :lists="[
'Full keyboard navigation.',
'Can be controlled or uncontrolled.'
]" />

## Install

<CodeGroupPackage name="@destyler/collapse" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
<script setup lang="ts">
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from '@destyler/collapsible'
</script>

<template>
  <CollapsibleRoot>
    <CollapsibleTrigger />
    <CollapsibleContent />
  </CollapsibleRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/collapsible/.docs/root.md-->

### Trigger

<!--@include: ../../packages/components/collapsible/.docs/trigger.md-->

### Content

<!--@include: ../../packages/components/collapsible/.docs/content.md-->
