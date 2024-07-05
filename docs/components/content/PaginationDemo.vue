<script setup lang="ts">
import {
  Icon,
  Label,
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from 'destyler'
</script>

<template>
  <PaginationRoot class="mx-auto flex w-full justify-center" :total="100" :sibling-count="1" show-edges :default-page="2">
    <PaginationList v-slot="{ items }" class="flex flex-row items-center gap-1">
      <PaginationPrev
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#18181B dark:hover:text-#FAFAFA h-9 px-4 py-2 gap-1 pr-2.5"
      >
        <Icon name="radix-icons:chevron-left" class="w-4 h-4" />
        <Label>Previous</Label>
      </PaginationPrev>
      <template v-for="(page, index) in items">
        <PaginationListItem
          v-if="page.type === 'page'"
          :key="index"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[selected]:border data-[selected]:border-#E4E4E7 data-[selected]:dark:border-#27272A bg-#f8f8f8 dark:bg-#1c1c1c shadow-sm hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#18181B dark:hover:text-#FAFAFA h-9 w-9"
          :value="page.value"
        >
          {{ page.value }}
        </PaginationListItem>
        <PaginationEllipsis
          v-else
          :key="page.type"
          :index="index"
          class="flex h-9 w-9 items-center justify-center"
        >
          <Icon name="radix-icons:dots-horizontal" class="w-4 h-4" />
          <span class="absolute w-px h-px overflow-hidden whitespace-nowrap -m-px p-0 border-0" style="clip: rect(0, 0, 0, 0)">More pages</span>
        </PaginationEllipsis>
      </template>
      <PaginationNext
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#18181B dark:hover:text-#FAFAFA h-9 px-4 py-2 gap-1 pr-2.5"
      >
        <Label>Next</Label>
        <Icon name="radix-icons:chevron-right" class="w-4 h-4" />
      </PaginationNext>
    </PaginationList>
  </PaginationRoot>
</template>
