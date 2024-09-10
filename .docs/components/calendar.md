---
layout: docs
component: calendar
---

# Calendar

> Displays dates and days of the week, facilitating date-related interactions.

<Preview name="calendar" />

## Features

<Features :lists="[
  'Full keyboard navigation',
  'Can be controlled or uncontrolled',
  'Focus is fully managed',
  'Localization support',
  'Highly composable',
]" />

## Install

<CodeGroupPackage name="@destyler/calendar @internationalized/date" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot
} from '@destyler/calendar'
</script>

<template>
  <CalendarRoot>
    <CalendarHeader>
      <CalendarPrev />
      <CalendarHeading />
      <CalendarNext />
    </CalendarHeader>
    <CalendarGrid>
      <CalendarGridHead>
        <CalendarGridRow>
          <CalendarHeadCell />
        </CalendarGridRow>
      </CalendarGridHead>
      <CalendarGridBody>
        <CalendarGridRow>
          <CalendarCell>
            <CalendarCellTrigger />
          </CalendarCell>
        </CalendarGridRow>
      </CalendarGridBody>
    </CalendarGrid>
  </CalendarRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/calendar/.docs/root.md-->

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

<!--@include: ../../packages/components/calendar/.docs/header.md-->

### Heading

<!--@include: ../../packages/components/calendar/.docs/heading.md-->

<Attribute
  :value="[
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Prev

<!--@include: ../../packages/components/calendar/.docs/prev.md-->

<Attribute
  :value="[
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Next

<!--@include: ../../packages/components/calendar/.docs/next.md-->

<Attribute
  :value="[
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Grid

<!--@include: ../../packages/components/calendar/.docs/grid.md-->

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

<!--@include: ../../packages/components/calendar/.docs/gridHead.md-->

### Grid Body

<!--@include: ../../packages/components/calendar/.docs/gridBody.md-->

### Grid Row

<!--@include: ../../packages/components/calendar/.docs/gridRow.md-->

### Head Cell

<!--@include: ../../packages/components/calendar/.docs/headCell.md-->

### Cell

<!--@include: ../../packages/components/calendar/.docs/cell.md-->

<Attribute
  :value="[
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>

### Cell Trigger

<!--@include: ../../packages/components/calendar/.docs/cellTrigger.md-->

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
      name: '[data-focused]',
      value:`Present when focused`
    },
  ]"
/>
