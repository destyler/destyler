---
layout: docs
component: dropdown
---

# Dropdown

> When you have some functions to trigger.

<Preview name="dropdown" />

## Features

<Features :lists="[
  'Can be controlled or uncontrolled.',
  'Supports submenus with configurable reading direction.',
  'Supports items, labels, groups of items.',
  'Supports checkable items (single or multiple) with optional indeterminate state.',
  'Supports modal and non-modal modes.',
  'Customize side, alignment, offsets, collision handling.',
  'Optionally render a pointing arrow.',
  'Focus is fully managed.',
  'Full keyboard navigation.',
  'Typeahead support.',
  'Dismissing and layering behavior is highly customizable.',
]" />

## Install

<CodeGroupPackage name="@destyler/dropdown" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  DropdownArrow,
  DropdownCheckboxItem,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownItemIndicator,
  DropdownLabel,
  DropdownPortal,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownRoot,
  DropdownSeparator,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownTrigger,
} from '@destyler/dropdown'
</script>

<template>
  <DropdownRoot>
    <DropdownTrigger />

    <DropdownPortal>
      <DropdownContent>
        <DropdownLabel />

        <DropdownItem />

        <DropdownGroup>
          <DropdownItem />
        </DropdownGroup>

        <DropdownCheckboxItem>
          <DropdownItemIndicator />
        </DropdownCheckboxItem>

        <DropdownRadioGroup>
          <DropdownRadioItem>
            <DropdownItemIndicator />
          </DropdownRadioItem>
        </DropdownRadioGroup>

        <DropdownSub>
          <DropdownSubTrigger />
          <DropdownPortal>
            <DropdownSubContent />
          </DropdownPortal>
        </DropdownSub>

        <DropdownSeparator />
        <DropdownArrow />
      </DropdownContent>
    </DropdownPortal>
  </DropdownRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/dropdown/.docs/root.md-->

### Trigger

<!--@include: ../../packages/components/dropdown/.docs/trigger.md-->

### Portal

<!--@include: ../../packages/components/dropdown/.docs/portal.md-->

### Content

<!--@include: ../../packages/components/dropdown/.docs/content.md-->

### Label

<!--@include: ../../packages/components/dropdown/.docs/label.md-->

### Group

<!--@include: ../../packages/components/dropdown/.docs/group.md-->

### Item

<!--@include: ../../packages/components/dropdown/.docs/item.md-->

### ItemIndicator

<!--@include: ../../packages/components/dropdown/.docs/itemIndicator.md-->

### CheckboxItem

<!--@include: ../../packages/components/dropdown/.docs/checkboxItem.md-->

### RadioGroup

<!--@include: ../../packages/components/dropdown/.docs/radioGroup.md-->

### RadioItem

<!--@include: ../../packages/components/dropdown/.docs/radioItem.md-->

### Sub

<!--@include: ../../packages/components/dropdown/.docs/sub.md-->

### SubTrigger

<!--@include: ../../packages/components/dropdown/.docs/subTrigger.md-->

### SubContent

<!--@include: ../../packages/components/dropdown/.docs/subContent.md-->

### Separator

<!--@include: ../../packages/components/dropdown/.docs/separator.md-->

### Arrow

<!--@include: ../../packages/components/dropdown/.docs/arrow.md-->
