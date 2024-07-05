<script setup lang="ts">
import {
  BreadcrumbsContent,
  BreadcrumbsItem,
  BreadcrumbsLabel,
  BreadcrumbsRoot,
  BreadcrumbsSeparator,
} from 'destyler'
</script>

<template>
  <BreadcrumbsRoot>
    <BreadcrumbsContent class="mb-4 flex items-center space-x-1 text-sm">
      <BreadcrumbsItem class="mb-4 flex items-center space-x-1 text-sm text-#09090b dark:text-#fafafa data-[state=inactive]:text-op-60">
        <BreadcrumbsLabel
          class="overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
          href="/"
        >
          Home
        </BreadcrumbsLabel>
        <BreadcrumbsSeparator class="w-2">
          >
        </BreadcrumbsSeparator>
      </BreadcrumbsItem>
      <BreadcrumbsItem class="mb-4 flex items-center space-x-1 text-sm text-#09090b dark:text-#fafafa data-[state=inactive]:text-op-60">
        <BreadcrumbsLabel
          class="overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
          href="/guide/introduction#components"
        >
          Components
        </BreadcrumbsLabel>
        <BreadcrumbsSeparator class="w-2">
          >
        </BreadcrumbsSeparator>
      </BreadcrumbsItem>
      <BreadcrumbsItem class="mb-4 flex items-center space-x-1 text-sm text-#09090b dark:text-#fafafa data-[state=inactive]:text-op-60 data-[state=active]:text-op-100">
        <BreadcrumbsLabel
          class="overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
        >
          Breadcrumbs
        </BreadcrumbsLabel>
        <BreadcrumbsSeparator class="w-2">
          >
        </BreadcrumbsSeparator>
      </BreadcrumbsItem>
    </BreadcrumbsContent>
  </BreadcrumbsRoot>
</template>
