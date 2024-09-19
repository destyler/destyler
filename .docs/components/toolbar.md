---
layout: docs
component: toolbar
---

# Toolbar

> A container for grouping a set of controls, such as buttons, Toolbar groups or dropdown menus.

<Preview name="toolbar" />

## Features

<Features :lists="[
  'Full keyboard navigation.',
]" />

## Install

<CodeGroupPackage name="@destyler/toolbar" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  ToolbarButton,
  ToolbarLink,
  ToolbarRoot,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from '@destyler/toolbar'
</script>

<template>
  <ToolbarRoot>
    <ToolbarButton />
    <ToolbarSeparator />
    <ToolbarLink />
    <ToolbarToggleGroup>
      <ToolbarToggleItem />
    </ToolbarToggleGroup>
  </ToolbarRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/toolbar/.docs/root.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
  ]"
/>

### Button

<!--@include: ../../packages/components/toolbar/.docs/button.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
  ]"
/>

### Link

<!--@include: ../../packages/components/toolbar/.docs/link.md-->

### Separator

<!--@include: ../../packages/components/toolbar/.docs/separator.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
  ]"
/>

### ToggleGroup

<!--@include: ../../packages/components/toolbar/.docs/toggleGroup.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
  ]"
/>

### ToggleItem

<!--@include: ../../packages/components/toolbar/.docs/toggleItem.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
    {
      name: '[data-state]',
      value:`\'on\' | \'off\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>
