---
layout: docs
component: tabs
---

# Tabs

> A set of layered sections of content—known as tab panels—that are displayed one at a time.

<Preview name="tabs" />

## Features

<Features :lists="[
  'Can be controlled or uncontrolled.',
  'Supports horizontal/vertical orientation.',
  'Supports automatic/manual activation.',
  'Full keyboard navigation.',
]" />

## Install

<CodeGroupPackage name="@destyler/tabs" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger
} from '@destyler/tabs'
</script>

<template>
  <TabsRoot>
    <TabsList>
      <TabsIndicator />
      <TabsTrigger />
    </TabsList>
    <TabsContent />
  </TabsRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/tabs/.docs/root.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
  ]"
/>

### List

<!--@include: ../../packages/components/tabs/.docs/list.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
  ]"
/>

### Indicator

<!--@include: ../../packages/components/tabs/.docs/indicator.md-->

<Variable
  :value="[
    {
      name: '--destyler-tabs-indicator-size',
      description:`The size of the indicator.`
    },
    {
      name: '--destyler-tabs-indicator-position',
      description:`The position of the indicator`
    },
  ]"
/>

### Trigger

<!--@include: ../../packages/components/tabs/.docs/trigger.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
    {
      name: '[data-state]',
      value:`\'active\' | \'inactive\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Content

<!--@include: ../../packages/components/tabs/.docs/content.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
    {
      name: '[data-state]',
      value:`\'active\' | \'inactive\'`
    },
  ]"
/>
