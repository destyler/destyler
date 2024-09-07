---
layout: docs
component: select
---

# Select

> Displays a list of options for the user to pick from—triggered by a button.

<Preview name="selects" />

## Features

<Features :lists="[
  'Can be controlled or uncontrolled.',
  'Offers 2 positioning modes.',
  'Supports items, labels, groups of items.',
  'Focus is fully managed.',
  'Full keyboard navigation.',
  'Supports custom placeholder.',
  'Typeahead support.',
  'Supports Right to Left direction.',
]" />

## Install

<CodeGroupPackage name="@destyler/select" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from '@destyler/select'
</script>

<template>
  <SelectRoot>
    <SelectTrigger>
      <SelectValue />
      <SelectIcon />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent>
        <SelectScrollUpButton />
        <SelectViewport>
          <SelectItem>
            <SelectItemText />
            <SelectItemIndicator />
          </SelectItem>
          <SelectGroup>
            <SelectLabel />
            <SelectItem>
              <SelectItemText />
              <SelectItemIndicator />
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
        </SelectViewport>
        <SelectScrollDownButton />
        <SelectArrow />
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/select/.docs/root.md-->

### Trigger

<!--@include: ../../packages/components/select/.docs/trigger.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' | \'closed\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
    {
      name: '[data-placeholder]',
      value:`Present when has placeholder`
    },
  ]"
/>

### Portal

<!--@include: ../../packages/components/select/.docs/portal.md-->

### Content

<!--@include: ../../packages/components/select/.docs/content.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' | \'closed\'`
    },
    {
      name: '[data-side]',
      value:`\'left\' | \'right\' | \'top\' | \'bottom\'`
    },
    {
      name: '[data-align]',
      value:`\'start\' | \'end\' | \'center\'`
    },
  ]"
/>

### ScrollUpButton

<!--@include: ../../packages/components/select/.docs/scrollUpButton.md-->

### ScrollDownButton

<!--@include: ../../packages/components/select/.docs/scrollDownButton.md-->

### Viewport

<!--@include: ../../packages/components/select/.docs/viewport.md-->

### Item

<!--@include: ../../packages/components/select/.docs/item.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' | \'closed\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
    {
      name: '[data-placeholder]',
      value:`Present when has placeholder`
    },
  ]"
/>

### Group

<!--@include: ../../packages/components/select/.docs/group.md-->

### Label

<!--@include: ../../packages/components/select/.docs/label.md-->

### Separator

<!--@include: ../../packages/components/select/.docs/separator.md-->

### Value

<!--@include: ../../packages/components/select/.docs/value.md-->

### ItemIndicator

<!--@include: ../../packages/components/select/.docs/itemIndicator.md-->

### ItemText

<!--@include: ../../packages/components/select/.docs/itemText.md-->

### Icon

<!--@include: ../../packages/components/select/.docs/icon.md-->

### Arrow

<!--@include: ../../packages/components/select/.docs/arrow.md-->
