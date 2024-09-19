---
layout: docs
component: rangeCalendar
---

# Range Calendar

> Presents a calendar view tailored for selecting date ranges.

<Preview name="rangeCalendar" />

## Features

<Features :lists="[
  'Full keyboard navigation',
  'Can be controlled or uncontrolled',
  'Focus is fully managed',
  'Localization support',
  'Highly composable',
]" />

## Install

<CodeGroupPackage name="@destyler/range-calendar @internationalized/date" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot
} from '@destyler/range-calendar'
</script>

<template>
  <RangeCalendarRoot>
    <RangeCalendarHeader>
      <RangeCalendarPrev />
      <RangeCalendarHeading />
      <RangeCalendarNext />
    </RangeCalendarHeader>
    <RangeCalendarGrid>
      <RangeCalendarGridHead>
        <RangeCalendarGridRow>
          <RangeCalendarHeadCell />
        </RangeCalendarGridRow>
      </RangeCalendarGridHead>
      <RangeCalendarGridBody>
        <RangeCalendarGridRow>
          <RangeCalendarCell>
            <RangeCalendarCellTrigger />
          </RangeCalendarCell>
        </RangeCalendarGridRow>
      </RangeCalendarGridBody>
    </RangeCalendarGrid>
  </RangeCalendarRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/rangeCalendar/.docs/root.md-->

<Attribute
  :value="[
    {
      name: '[data-readonly]',
      value:`Present when readonly`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
    {
      name: '[data-invalid]',
      value:`Present when invalid`
    },
  ]"
/>

### Header

<!--@include: ../../packages/components/rangeCalendar/.docs/header.md-->

### Heading

<!--@include: ../../packages/components/rangeCalendar/.docs/heading.md-->

<Attribute
  :value="[
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Prev

<!--@include: ../../packages/components/rangeCalendar/.docs/prev.md-->

<Attribute
  :value="[
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Next

<!--@include: ../../packages/components/rangeCalendar/.docs/next.md-->

<Attribute
  :value="[
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Grid

<!--@include: ../../packages/components/rangeCalendar/.docs/grid.md-->

<Attribute
  :value="[
    {
      name: '[data-readonly]',
      value:`Present when readonly`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Grid Head

<!--@include: ../../packages/components/rangeCalendar/.docs/gridHead.md-->

### Grid Body

<!--@include: ../../packages/components/rangeCalendar/.docs/gridBody.md-->

### Grid Row

<!--@include: ../../packages/components/rangeCalendar/.docs/gridRow.md-->

### Head Cell

<!--@include: ../../packages/components/rangeCalendar/.docs/headCell.md-->

### Cell

<!--@include: ../../packages/components/rangeCalendar/.docs/cell.md-->

<Attribute
  :value="[
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Cell Trigger

<!--@include: ../../packages/components/rangeCalendar/.docs/cellTrigger.md-->

<Attribute
  :value="[
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
    {
      name: '[data-selected]',
      value:`Present when selected`
    },
    {
      name: '[data-value]',
      value:`The ISO string value of the date.`
    },
    {
      name: '[data-unavailable]',
      value:`Present when unavailable`
    },
    {
      name: '[data-today]',
      value:`Present when today`
    },
    {
      name: '[data-outside-view]',
      value:`Present when the date is outside the current month it is displayed in.`
    },
    {
      name: '[data-outside-visible-view]',
      value:`Present when the date is outside the months that are visible on the calendar.`
    },
    {
      name:'[data-selection-start]',
      value:'Present when the date is the start of the selection.',
    },
    {
      name:'[data-selection-end]',
      value:'Present when the date is the end of the selection.',
    },
    {
      name:'[data-highlighted]',
      value:'Present when the date is highlighted by the user as they select a range.',
    },
    {
      name:'[data-highlighted-start]',
      value:'Present when the date is the start of the range that is highlighted by the user.',
    },
    {
      name:'[data-highlighted-end]',
      value:'Present when the date is the end of the range that is highlighted by the user.',
    },
    {
      name: '[data-focused]',
      value:`Present when focused`
    },
  ]"
/>
s
