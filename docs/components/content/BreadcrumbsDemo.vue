<script setup lang="ts">
import {
  DestylerBreadcrumbsContent,
  DestylerBreadcrumbsItem,
  DestylerBreadcrumbsLabel,
  DestylerBreadcrumbsRoot,
  DestylerBreadcrumbsSeparator,
} from 'destyler'
</script>

<template>
  <DestylerBreadcrumbsRoot>
    <DestylerBreadcrumbsContent class="mb-4 flex items-center space-x-1 text-sm">
      <DestylerBreadcrumbsItem class="mb-4 flex items-center space-x-1 text-sm text-#09090b dark:text-#fafafa data-[state=inactive]:text-op-60">
        <DestylerBreadcrumbsLabel
          class="overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
          href="/"
        >
          Home
        </DestylerBreadcrumbsLabel>
        <DestylerBreadcrumbsSeparator class="w-2">
          >
        </DestylerBreadcrumbsSeparator>
      </DestylerBreadcrumbsItem>
      <DestylerBreadcrumbsItem class="mb-4 flex items-center space-x-1 text-sm text-#09090b dark:text-#fafafa data-[state=inactive]:text-op-60">
        <DestylerBreadcrumbsLabel
          class="overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
          href="/guide/introduction#components"
        >
          Components
        </DestylerBreadcrumbsLabel>
        <DestylerBreadcrumbsSeparator class="w-2">
          >
        </DestylerBreadcrumbsSeparator>
      </DestylerBreadcrumbsItem>
      <DestylerBreadcrumbsItem class="mb-4 flex items-center space-x-1 text-sm text-#09090b dark:text-#fafafa data-[state=inactive]:text-op-60 data-[state=active]:text-op-100">
        <DestylerBreadcrumbsLabel
          class="overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
        >
          Breadcrumbs
        </DestylerBreadcrumbsLabel>
        <DestylerBreadcrumbsSeparator class="w-2">
          >
        </DestylerBreadcrumbsSeparator>
      </DestylerBreadcrumbsItem>
    </DestylerBreadcrumbsContent>
  </DestylerBreadcrumbsRoot>
</template>
