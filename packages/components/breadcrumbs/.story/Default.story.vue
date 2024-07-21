<script setup lang="ts">
import {
  BreadcrumbsContent,
  BreadcrumbsItem,
  BreadcrumbsLabel,
  BreadcrumbsRoot,
  BreadcrumbsSeparator,
} from '../src'
</script>

<template>
  <Story title="Breadcrumbs/Default">
    <Variant title="default">
      <BreadcrumbsRoot>
        <BreadcrumbsContent class="mb-4 flex items-center space-x-1 text-sm">
          <BreadcrumbsItem class="mb-4 flex items-center space-x-1 text-sm text-green11 data-[state=inactive]:text-op-60!">
            <BreadcrumbsLabel
              class="overflow-hidden text-ellipsis whitespace-nowrap"
            >
              Home
            </BreadcrumbsLabel>
            <BreadcrumbsSeparator class="w-2" />
          </BreadcrumbsItem>
          <BreadcrumbsItem class="mb-4 flex items-center space-x-1 text-sm text-green11 data-[state=inactive]:text-op-60!">
            <BreadcrumbsLabel
              class="overflow-hidden text-ellipsis whitespace-nowrap"
            >
              Components
            </BreadcrumbsLabel>
            <BreadcrumbsSeparator class="w-2" />
          </BreadcrumbsItem>
          <BreadcrumbsItem class="mb-4 flex items-center space-x-1 text-sm text-green11 data-[state=inactive]:text-op-60! data-[state=active]:text-op-100!">
            <BreadcrumbsLabel
              class="overflow-hidden text-ellipsis whitespace-nowrap"
            >
              Breadcrumbs
            </BreadcrumbsLabel>
            <BreadcrumbsSeparator class="w-2" />
          </BreadcrumbsItem>
        </BreadcrumbsContent>
      </BreadcrumbsRoot>
    </Variant>
  </Story>
</template>
