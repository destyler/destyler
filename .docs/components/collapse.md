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
// @noErrors
<script setup lang="ts">
import { CollapseContent, CollapseHeader, CollapseItem, CollapseRoot, CollapseTrigger } from '@destyler/collapse'
</script>

<template>
  <CollapseRoot>
    <CollapseItem>
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

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' \| \'horizontal\'`
    }
  ]"
/>

### Item

<!--@include: ../../packages/components/collapse/.docs/item.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' \| \'horizontal\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
    {
      name: '[data-state]',
      value:`\'open\' \| \'closed\'`
    }
  ]"
/>

### Header

<!--@include: ../../packages/components/collapse/.docs/header.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' \| \'horizontal\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
    {
      name: '[data-state]',
      value:`\'open\' \| \'closed\'`
    }
  ]"
/>

### Trigger

<!--@include: ../../packages/components/collapse/.docs/trigger.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' \| \'horizontal\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
    {
      name: '[data-state]',
      value:`\'open\' \| \'closed\'`
    }
  ]"
/>

### Content

<!--@include: ../../packages/components/collapse/.docs/content.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' \| \'horizontal\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
    {
      name: '[data-state]',
      value:`\'open\' \| \'closed\'`
    }
  ]"
/>

<Variable
  :value="[
    {
      name: '--destyler-collapse-content-width',
      description:`The width of the content when it opens/closes`
    },
    {
      name: '--destyler-collapsible-content-width',
      description:`The height of the content when it opens/closes`
    }
  ]"
/>
