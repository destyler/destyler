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
import './style.css'
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
      class="pagination-list"
    >
      <PaginationFirst
        class="item"
      >
        <Icon name="radix-icons:double-arrow-left" />
      </PaginationFirst>
      <PaginationPrev
        class="item"
      >
        <Icon name="radix-icons:chevron-left" />
      </PaginationPrev>
      <template v-for="(page, index) in items">
        <PaginationListItem
          v-if="page.type === 'page'"
          :key="index"
          :value="page.value"
          class="item"
        />
        <PaginationEllipsis
          v-else
          :key="page.type"
          :index="index"
        />
      </template>
      <PaginationNext
        class="item"
      >
        <Icon name="radix-icons:chevron-right" />
      </PaginationNext>
      <PaginationLast
        class="item"
      >
        <Icon name="radix-icons:double-arrow-right" />
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>
