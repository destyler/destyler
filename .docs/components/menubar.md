---
layout: docs
component: menubar
---

# Menubar

> A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.

<Preview name="menubar" />

## Features

<Features :lists="[
  'Can be controlled or uncontrolled.',
  'Supports submenus with configurable reading direction.',
  'Supports items, labels, groups of items.',
  'Supports checkable items (single or multiple).',
  'Customize side, alignment, offsets, collision handling.',
  'Optionally render a pointing arrow.',
  'Focus is fully managed.',
  'Full keyboard navigation.',
  'Typeahead support.',
]" />

## Install

<CodeGroupPackage name="@destyler/menubar" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  MenubarArrow,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarItemIndicator,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarRoot,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@destyler/menubar'
</script>

<template>
  <MenubarRoot>
    <MenubarMenu>
      <MenubarTrigger />
      <MenubarPortal>
        <MenubarContent>
          <MenubarLabel />
          <MenubarItem />

          <MenubarGroup>
            <MenubarItem />
          </MenubarGroup>

          <MenubarCheckboxItem>
            <MenubarItemIndicator />
          </MenubarCheckboxItem>

          <MenubarRadioGroup>
            <MenubarRadioItem>
              <MenubarItemIndicator />
            </MenubarRadioItem>
          </MenubarRadioGroup>

          <MenubarSub>
            <MenubarSubTrigger />
            <MenubarPortal>
              <MenubarSubContent />
            </MenubarPortal>
          </MenubarSub>

          <MenubarSeparator />
          <MenubarArrow />
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  </MenubarRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/menubar/.docs/root.md-->

### Menu

<!--@include: ../../packages/components/menubar/.docs/menu.md-->

### Trigger

<!--@include: ../../packages/components/menubar/.docs/trigger.md-->

### Portal

<!--@include: ../../packages/components/menubar/.docs/portal.md-->

### Content

<!--@include: ../../packages/components/menubar/.docs/content.md-->

### Label

<!--@include: ../../packages/components/menubar/.docs/label.md-->

### Group

<!--@include: ../../packages/components/menubar/.docs/group.md-->

### Item

<!--@include: ../../packages/components/menubar/.docs/item.md-->

### ItemIndicator

<!--@include: ../../packages/components/menubar/.docs/itemIndicator.md-->

### CheckboxItem

<!--@include: ../../packages/components/menubar/.docs/checkboxItem.md-->

### RadioGroup

<!--@include: ../../packages/components/menubar/.docs/radioGroup.md-->

### RadioItem

<!--@include: ../../packages/components/menubar/.docs/radioItem.md-->

### Sub

<!--@include: ../../packages/components/menubar/.docs/sub.md-->

### SubTrigger

<!--@include: ../../packages/components/menubar/.docs/subTrigger.md-->

### SubContent

<!--@include: ../../packages/components/menubar/.docs/subContent.md-->

### Separator

<!--@include: ../../packages/components/menubar/.docs/separator.md-->

### Arrow

<!--@include: ../../packages/components/menubar/.docs/arrow.md-->
