---
layout: docs
component: collapse
---

# Collapse

> A vertically stacked set of interactive headings that each reveal a section of content.

<Preview name="collapse" />

## Features

<Features :lists="[
'Full keyboard navigation.',
'Supports horizontal/vertical orientation.',
'Supports Right to Left direction.',
'Can expand one or multiple items.',
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
import { CollapseContent, CollapseHeader, CollapseItem, CollapseRoot, CollapseTrigger } from '@destyler/collapse'
</script>

<template>
  <CollapseRoot>
    <CollapseItem value="string">
      <CollapseHeader>
        <CollapseTrigger />
      </CollapseHeader>
      <CollapseContent />
    </CollapseItem>
  </CollapseRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/collapse/.docs/root.md-->

### Item

<!--@include: ../../packages/components/collapse/.docs/item.md-->

### Header

<!--@include: ../../packages/components/collapse/.docs/header.md-->

### Trigger

<!--@include: ../../packages/components/collapse/.docs/trigger.md-->

### Content

<!--@include: ../../packages/components/collapse/.docs/content.md-->
