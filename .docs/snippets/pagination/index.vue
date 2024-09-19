<script setup lang="ts">
import { Icon } from '@destyler/icon'
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
  <PaginationRoot
    :total="100"
    :sibling-count="1"
    show-edges
    :default-page="2"
  >
    <PaginationList
      v-slot="{ items }"
      class="flex items-center gap-1 text-dark dark:text-light"
    >
      <PaginationFirst
        class="
        inline-flex items-center justify-center whitespace-nowrap
        rounded-md text-sm font-medium ring-offset-background
        transition-colors focus-visible:outline-none h-10 w-10
        focus-visible:ring-2 focus-visible:ring-ring hover:bg-accent
        focus-visible:ring-offset-2 disabled:pointer-events-none
        disabled:opacity-50 hover:text-accent-foreground
        "
      >
        <Icon name="radix-icons:double-arrow-left" />
      </PaginationFirst>
      <PaginationPrev
        class="
        inline-flex items-center justify-center whitespace-nowrap
        rounded-md text-sm font-medium ring-offset-background
        transition-colors focus-visible:outline-none h-10 w-10
        focus-visible:ring-2 focus-visible:ring-ring hover:bg-accent
        focus-visible:ring-offset-2 disabled:pointer-events-none
        disabled:opacity-50 hover:text-accent-foreground
        "
      >
        <Icon name="radix-icons:chevron-left" />
      </PaginationPrev>
      <template v-for="(page, index) in items">
        <PaginationListItem
          v-if="page.type === 'page'"
          :key="index"
          :value="page.value"
          class="inline-flex items-center justify-center whitespace-nowrap
          rounded-md text-sm font-medium ring-offset-background
          transition-colors focus-visible:outline-none h-10 w-10
          focus-visible:ring-2 focus-visible:ring-ring hover:bg-accent
          focus-visible:ring-offset-2 disabled:pointer-events-none
          disabled:opacity-50 hover:text-accent-foreground
          data-[selected]:border data-[selected]:border-primary"
        />
        <PaginationEllipsis
          v-else
          :key="page.type"
          :index="index"
        />
      </template>
      <PaginationNext
        class="
        inline-flex items-center justify-center whitespace-nowrap
        rounded-md text-sm font-medium ring-offset-background
        transition-colors focus-visible:outline-none h-10 w-10
        focus-visible:ring-2 focus-visible:ring-ring hover:bg-accent
        focus-visible:ring-offset-2 disabled:pointer-events-none
        disabled:opacity-50 hover:text-accent-foreground
        "
      >
        <Icon name="radix-icons:chevron-right" />
      </PaginationNext>
      <PaginationLast
        class="inline-flex items-center justify-center whitespace-nowrap
        rounded-md text-sm font-medium ring-offset-background
        transition-colors focus-visible:outline-none h-10 w-10
        focus-visible:ring-2 focus-visible:ring-ring hover:bg-accent
        focus-visible:ring-offset-2 disabled:pointer-events-none
        disabled:opacity-50 hover:text-accent-foreground"
      >
        <Icon name="radix-icons:double-arrow-right" />
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>
