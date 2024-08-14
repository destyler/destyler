---
layout: docs
component: breadcrumbs
---

# Breadcrumbs

> Show hierarchy and navigational context for a user’s location within an application.

<Preview name="breadcrumbs" />

## Features

<Features :lists="[
'Support for navigation links via <a> elements or custom element types via ARIA.',
'Localized ARIA labeling support for landmark navigation region.',
'Support for disabled breadcrumb links.',
]" />

## Install

<CodeGroupPackage name="@destyler/breadcrumbs" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
<script setup lang="ts">
// @noErrors
import { BreadcrumbsContent, BreadcrumbsItem, BreadcrumbsLabel, BreadcrumbsRoot, BreadcrumbsSeparator } from '@destyler/breadcrumbs'
</script>

<template>
  <BreadcrumbsRoot>
    <BreadcrumbsContent>
      <BreadcrumbsItem>
        <BreadcrumbsLabel />
        <BreadcrumbsSeparator />
      </BreadcrumbsItem>
    </BreadcrumbsContent>
  </BreadcrumbsRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/breadcrumbs/.docs/root.md-->

### Content

<!--@include: ../../packages/components/breadcrumbs/.docs/content.md-->

### Item

<!--@include: ../../packages/components/breadcrumbs/.docs/item.md-->

### Label

<!--@include: ../../packages/components/breadcrumbs/.docs/label.md-->

### Separator

<!--@include: ../../packages/components/breadcrumbs/.docs/separator.md-->
