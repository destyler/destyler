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
      flex="~"
      items="center"
      gap="1"
      text="dark dark:light"
    >
      <PaginationFirst
        inline="flex"
        items="center"
        justify="center"
        whitespace="nowrap"
        rounded="md"
        text="sm hover:accent-foreground"
        font="medium"
        ring-offset="background"
        transition="colors"
        focus-visible="outline-none ring-2 ring-ing ring-offset-2"
        h="10"
        w="10"
        bg="hover:accent"
        op="disabled:50"
        pointer-events="disabled:none"
      >
        <Icon name="radix-icons:double-arrow-left" />
      </PaginationFirst>
      <PaginationPrev
        inline="flex"
        items="center"
        justify="center"
        whitespace="nowrap"
        rounded="md"
        text="sm hover:accent-foreground"
        font="medium"
        ring-offset="background"
        transition="colors"
        focus-visible="outline-none ring-2 ring-ing ring-offset-2"
        h="10"
        w="10"
        bg="hover:accent"
        op="disabled:50"
        pointer-events="disabled:none"
      >
        <Icon name="radix-icons:chevron-left" />
      </PaginationPrev>
      <template v-for="(page, index) in items">
        <PaginationListItem
          v-if="page.type === 'page'"
          :key="index"
          :value="page.value"
          inline="flex"
          items="center"
          justify="center"
          whitespace="nowrap"
          rounded="md"
          text="sm hover:accent-foreground"
          font="medium"
          ring-offset="background"
          transition="colors"
          focus-visible="outline-none ring-2 ring-ing ring-offset-2"
          h="10"
          w="10"
          bg="hover:accent"
          op="disabled:50"
          pointer-events="disabled:none"
        />
        <PaginationEllipsis
          v-else
          :key="page.type"
          :index="index"
        />
      </template>
      <PaginationNext
        inline="flex"
        items="center"
        justify="center"
        whitespace="nowrap"
        rounded="md"
        text="sm hover:accent-foreground"
        font="medium"
        ring-offset="background"
        transition="colors"
        focus-visible="outline-none ring-2 ring-ing ring-offset-2"
        h="10"
        w="10"
        bg="hover:accent"
        op="disabled:50"
        pointer-events="disabled:none"
      >
        <Icon name="radix-icons:chevron-right" />
      </PaginationNext>
      <PaginationLast
        inline="flex"
        items="center"
        justify="center"
        whitespace="nowrap"
        rounded="md"
        text="sm hover:accent-foreground"
        font="medium"
        ring-offset="background"
        transition="colors"
        focus-visible="outline-none ring-2 ring-ing ring-offset-2"
        h="10"
        w="10"
        bg="hover:accent"
        op="disabled:50"
        pointer-events="disabled:none"
      >
        <Icon name="radix-icons:double-arrow-right" />
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>
