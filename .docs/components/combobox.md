---
layout: docs
component: combobox
---

# Combobox

> Autocomplete input and command palette with a list of suggestions.

<Preview name="combobox" />

## Features

<Features :lists="[
'Can be controlled or uncontrolled.',
'Offers 2 positioning modes.',
'Supports items, labels, groups of items.',
'Focus is fully managed.',
'Full keyboard navigation.',
'Supports custom placeholder.',
'Supports Right to Left direction.',
]" />

## Install

<CodeGroupPackage name="@destyler/combobox" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  ComboboxAnchor,
  ComboboxCancel,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxViewport
} from '@destyler/combobox'
</script>

<template>
  <ComboboxRoot>
    <ComboboxAnchor>
      <ComboboxInput />
      <ComboboxTrigger />
      <ComboboxCancel />
    </ComboboxAnchor>
    <ComboboxPortal>
      <ComboboxContent>
        <ComboboxViewport>
          <ComboboxEmpty />

          <ComboboxGroup>
            <ComboboxLabel />
            <ComboboxItem>
              <ComboboxItemIndicator />
            </ComboboxItem>
          </ComboboxGroup>

          <ComboboxSeparator />
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/combobox/.docs/root.md-->

### Anchor

<!--@include: ../../packages/components/combobox/.docs/anchor.md-->

### Input

<!--@include: ../../packages/components/combobox/.docs/input.md-->

### Trigger

<!--@include: ../../packages/components/combobox/.docs/trigger.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' \| \'closed\'`
    },
    {
      name: '[data-disableds]',
      value:`Present when disabled`
    },
  ]"
/>

### Cancel

<!--@include: ../../packages/components/combobox/.docs/cancel.md-->

### Portal

<!--@include: ../../packages/components/combobox/.docs/portal.md-->

### Content

<!--@include: ../../packages/components/combobox/.docs/content.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' \| \'closed\'`
    },
    {
      name: '[data-side]',
      value:`\'left\' \| \'right\' \| \'bottom\' \| \'top\'`
    },
    {
      name: '[data-align]',
      value:`\'start\' \| \'end\' \| \'center\'`
    },
  ]"
/>

<Variable
  :value="[
    {
      name: '--destyler-combobox-content-transform-origin',
      description:`The <code>transform-origin</code> computed from the content and arrow positions/offsets.<br /> Only present when <code>position=\'popper\'</code>.`
    },
    {
      name: '--destyler-combobox-content-available-width',
      description:`The remaining width between the trigger and the boundary edge. Only present when <code>position=\'popper\'</code>.`
    },
    {
      name: '--destyler-combobox-content-available-height',
      description:`The remaining height between the trigger and the boundary edge. Only present when <code>position=\'popper\'</code>.`
    },
    {
      name: '--destyler-combobox-trigger-width',
      description:`The width of the trigger. Only present when <code>position=\'popper\'</code>.`
    },
    {
      name: '--destyler-combobox-trigger-height',
      description:`The height of the trigger. Only present when <code>position=\'popper\'</code>.`
    },
  ]"
/>

### Viewport

<!--@include: ../../packages/components/combobox/.docs/viewport.md-->

### Empty

<!--@include: ../../packages/components/combobox/.docs/empty.md-->

### Item

<!--@include: ../../packages/components/combobox/.docs/item.md-->

<Attribute
  :value="[
    {
      name: '[data-highlighted]',
      value:`Present when highlighted`
    },
    {
      name: '[data-state]',
      value:`\'checked\' \| \'unchecked\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
    {
      name: '[data-hidden]',
      value:`Present when hidden`
    },
  ]"
/>

### ItemIndicator

<!--@include: ../../packages/components/combobox/.docs/itemIndicator.md-->

### Group

<!--@include: ../../packages/components/combobox/.docs/group.md-->

### Label

<!--@include: ../../packages/components/combobox/.docs/label.md-->

### Separator

<!--@include: ../../packages/components/combobox/.docs/separator.md-->

### Arrow

<!--@include: ../../packages/components/combobox/.docs/arrow.md-->
