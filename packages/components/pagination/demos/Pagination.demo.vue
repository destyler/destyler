<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { DestylerPaginationEllipsis, DestylerPaginationFirst, DestylerPaginationLast, DestylerPaginationList, DestylerPaginationListItem, DestylerPaginationNext, DestylerPaginationPrev, DestylerPaginationRoot } from '../src'
</script>

<template>
  <DestylerPaginationRoot :total="100" :sibling-count="1" show-edges :default-page="2">
    <DestylerPaginationList v-slot="{ items }" class="flex items-center gap-1 text-dark">
      <DestylerPaginationFirst class="w-9 h-9 flex items-center justify-center  disabled:opacity-50  focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded">
        <Icon icon="radix-icons:double-arrow-left" />
      </DestylerPaginationFirst>
      <DestylerPaginationPrev class="w-9 h-9  flex items-center justify-center mr-4  disabled:opacity-50  focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded">
        <Icon icon="radix-icons:chevron-left" />
      </DestylerPaginationPrev>
      <template v-for="(page, index) in items">
        <DestylerPaginationListItem v-if="page.type === 'page'" :key="index" class="w-9 h-9 border rounded  data-[selected]:bg-gray data-[selected]:text-#000000 hover:bg-dark/10 transition focus-within:outline focus-within:outline-1 focus-within:outline-offset-1" :value="page.value">
          {{ page.value }}
        </DestylerPaginationListItem>
        <DestylerPaginationEllipsis v-else :key="page.type" :index="index" class="w-9 h-9 flex items-center justify-center" />
      </template>
      <DestylerPaginationNext class="w-9 h-9  flex items-center justify-center  ml-4 disabled:opacity-50  focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded">
        <Icon icon="radix-icons:chevron-right" />
      </DestylerPaginationNext>
      <DestylerPaginationLast class="w-9 h-9  flex items-center justify-center disabled:opacity-50  focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 rounded">
        <Icon icon="radix-icons:double-arrow-right" />
      </DestylerPaginationLast>
    </DestylerPaginationList>
  </DestylerPaginationRoot>
</template>
