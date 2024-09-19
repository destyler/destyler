---
layout: docs
component: pagination
---

# Pagination

> Displays data in paged format and provides navigation between pages.

<Preview name="pagination" />

## Features

<Features :lists="[
  'Enable quick access to first, or last page',
  'Enable to show edges constantly, or not'
]" />

## Install

<CodeGroupPackage name="@destyler/pagination" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from '@destyler/pagination'
</script>

<template>
  <PaginationRoot>
    <PaginationList>
      <PaginationFirst />
      <PaginationPrev />
      <PaginationListItem />
      <PaginationEllipsis />
      <PaginationNext />
      <PaginationLast />
    </PaginationList>
  </PaginationRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/pagination/.docs/root.md-->

## List

<!--@include: ../../packages/components/pagination/.docs/list.md-->

## Item

<!--@include: ../../packages/components/pagination/.docs/item.md-->

## Ellipsis

<!--@include: ../../packages/components/pagination/.docs/ellipsis.md-->

<Attribute
  :value="[
    {
      name: '[data-type]',
      value:`ellipsis`
    }
  ]"
/>

## First

<!--@include: ../../packages/components/pagination/.docs/first.md-->

## Last

<!--@include: ../../packages/components/pagination/.docs/last.md-->

## Prev

<!--@include: ../../packages/components/pagination/.docs/prev.md-->

## Next

<!--@include: ../../packages/components/pagination/.docs/next.md-->
