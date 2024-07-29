<script setup lang="ts">
import { PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev, PaginationRoot, type PaginationRootProps } from '../src'

const props = withDefaults(defineProps<{
  total?: PaginationRootProps['total']
  showEdges?: PaginationRootProps['showEdges']
}>(), {
  total: 100,
})
</script>

<template>
  <PaginationRoot v-bind="props">
    <PaginationList v-slot="{ items }">
      <PaginationFirst />
      <PaginationPrev />
      <template v-for="(page, index) in items">
        <PaginationListItem v-if="page.type === 'page'" :key="index" :value="page.value">
          {{ page.value }}
        </PaginationListItem>
        <PaginationEllipsis v-else :key="page.type" :index="index">
          &#8230;
        </PaginationEllipsis>
      </template>
      <PaginationNext />
      <PaginationLast />
    </PaginationList>
  </PaginationRoot>
</template>
