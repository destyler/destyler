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

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' \| \'closed\'`
    },
    {
      name:'[data-disabled]',
      value:'Present when disabled'
    }
  ]"
/>

### Portal

<!--@include: ../../packages/components/dropdown/.docs/portal.md-->

### Content

<!--@include: ../../packages/components/dropdown/.docs/content.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' | \'closed\'`
    },
    {
      name: '[data-side]',
      value:`\'left\' | \'right\' | \'bottom\' | \'top\'`
    },
    {
      name: '[data-align]',
      value:`\'start\' | \'end\' | \'center\'`
    },
    {
      name: '[data-align]',
      value:`\'vertical\' | \'horizontal\'`
    },
  ]"
/>

<Variable
  :value="[
    {
      name: '--destyler-dropdown-content-transform-origin',
      description:`The <code>transform-origin</code> computed from the content and arrow positions/offsets`
    },
    {
      name: '--destyler-dropdown-content-available-width',
      description:`The remaining width between the trigger and the boundary edge`
    },
    {
      name: '--destyler-dropdown-content-available-height',
      description:`The remaining height between the trigger and the boundary edge`
    },
    {
      name: '--destyler-dropdown-trigger-width',
      description:`The width of the trigger`
    },
    {
      name: '--destyler-dropdown-trigger-height',
      description:`The height of the trigger`
    },
  ]"
/>

### Label

<!--@include: ../../packages/components/dropdown/.docs/label.md-->

### Group

<!--@include: ../../packages/components/dropdown/.docs/group.md-->

### Item

<!--@include: ../../packages/components/dropdown/.docs/item.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
    {
      name: '[data-highlighted]',
      value:`Present when highlighted`
    },
    {
      name:'[data-disabled]',
      value:'Present when disabled'
    }
  ]"
/>

### ItemIndicator

<!--@include: ../../packages/components/dropdown/.docs/itemIndicator.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'checked\' | \'checked\' | \'| \'indeterminate\'\'`
    },
  ]"
/>

### CheckboxItem

<!--@include: ../../packages/components/dropdown/.docs/checkboxItem.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'checked\' | \'checked\' | \'| \'indeterminate\'\'`
    },
    {
      name: '[data-highlighted]',
      value:`Present when highlighted`
    },
    {
      name:'[data-disabled]',
      value:'Present when disabled'
    }
  ]"
/>

### RadioGroup

<!--@include: ../../packages/components/dropdown/.docs/radioGroup.md-->

### RadioItem

<!--@include: ../../packages/components/dropdown/.docs/radioItem.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'checked\' | \'checked\' | \'| \'indeterminate\'\'`
    },
    {
      name: '[data-highlighted]',
      value:`Present when highlighted`
    },
    {
      name:'[data-disabled]',
      value:'Present when disabled'
    }
  ]"
/>

### Sub

<!--@include: ../../packages/components/dropdown/.docs/sub.md-->

### SubTrigger

<!--@include: ../../packages/components/dropdown/.docs/subTrigger.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' | \'closed\'`
    },
    {
      name: '[data-highlighted]',
      value:`Present when highlighted`
    },
    {
      name:'[data-disabled]',
      value:'Present when disabled'
    }
  ]"
/>

### SubContent

<!--@include: ../../packages/components/dropdown/.docs/subContent.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' | \'closed\'`
    },
    {
      name: '[data-side]',
      value:`\'left\' | \'right\' | \'bottom\' | \'top\'`
    },
    {
      name: '[data-align]',
      value:`\'start\' | \'end\' | \'center\'`
    },
    {
      name: '[data-align]',
      value:`\'vertical\' | \'horizontal\'`
    },
  ]"
/>

<Variable
  :value="[
    {
      name: '--destyler-dropdown-content-transform-origin',
      description:`The <code>transform-origin</code> computed from the content and arrow positions/offsets`
    },
    {
      name: '--destyler-dropdown-content-available-width',
      description:`The remaining width between the trigger and the boundary edge`
    },
    {
      name: '--destyler-dropdown-content-available-height',
      description:`The remaining height between the trigger and the boundary edge`
    },
    {
      name: '--destyler-dropdown-trigger-width',
      description:`The width of the trigger`
    },
    {
      name: '--destyler-dropdown-trigger-height',
      description:`The height of the trigger`
    },
  ]"
/>

### Separator

<!--@include: ../../packages/components/dropdown/.docs/separator.md-->

### Arrow

<!--@include: ../../packages/components/dropdown/.docs/arrow.md-->
