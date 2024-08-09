---
layout: docs
component: contextMenu
---

# Context Menu

> Displays a menu located at the pointer, triggered by a right click or a long press.

<Preview name="contextMenu" />

## Features

<Features :lists="[
'Supports submenus with configurable reading direction.',
'Supports items, labels, groups of items.',
'Supports checkable items (single or multiple) with optional indeterminate state.',
'Supports modal and non-modal modes.',
'Customize side, alignment, offsets, collision handling.',
'Focus is fully managed.',
'Full keyboard navigation.',
'Typeahead support.',
'Dismissing and layering behavior is highly customizable.',
'Triggers with a long press on touch devices',
]" />

## Install

<CodeGroupPackage name="@destyler/context-menu" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import { ContextMenuArrow, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuItemIndicator, ContextMenuLabel, ContextMenuPortal, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuRoot, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from '@destyler/context-menu'
</script>

<template>
  <ContextMenuRoot>
    <ContextMenuTrigger />

    <ContextMenuPortal>
      <ContextMenuContent>
        <ContextMenuLabel />
        <ContextMenuItem />

        <ContextMenuGroup>
          <ContextMenuItem />
        </ContextMenuGroup>

        <ContextMenuCheckboxItem>
          <ContextMenuItemIndicator />
        </ContextMenuCheckboxItem>

        <ContextMenuRadioGroup>
          <ContextMenuRadioItem>
            <ContextMenuItemIndicator />
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>

        <ContextMenuSub>
          <ContextMenuSubTrigger />
          <ContextMenuPortal>
            <ContextMenuSubContent />
          </ContextMenuPortal>
        </ContextMenuSub>

        <ContextMenuSeparator />
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
```

</template>

</CodePreview>

## API
