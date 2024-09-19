# @destyler/breadcrumbs

[![NPM version](https://img.shields.io/npm/v/@destyler/breadcrumbs?color=a1b858&label=)](https://www.npmjs.com/package/@destyler/breadcrumbs)

> show hierarchy and navigational context for a user is location within an application.

[GitHub](https://github.com/destyler/destyler) | [Documentation](https://destyler-dev.zeabur.app/)

## Install

```bash
npm install @destyler/breadcrumbs
```

## Usage

```vue
<script setup lang="ts">
import {
  BreadcrumbsContent,
  BreadcrumbsItem,
  BreadcrumbsLabel,
  BreadcrumbsRoot,
  BreadcrumbsSeparator
} from '@destyler/breadcrumbs'
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
