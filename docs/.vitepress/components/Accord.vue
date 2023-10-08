<script setup lang="ts">
import { ref } from 'vue'
import { DestylerAccordionItem, DestylerAccordionRoot } from '@destyler/accordion/src'
import { DestylerIcon } from '@destyler/icon/src'

const selected = ref('item1')
const items = [
  {
    title: 'What is your refund policy?',
    value: 'item1',
    content: 'If you\'re unhappy with your purchase for any reason, email us within 90 days and we\'ll refund you in full, no questions asked.',
  },
  {
    title: 'Do you offer technical support?',
    value: 'item2',
    content: 'No.',
  },
]
</script>

<template>
  <DestylerAccordionRoot
    v-model="selected"
  >
    <DestylerAccordionItem v-for="item in items" :key="item.value" :value="item.value">
      <template #header="{ state }">
        <span>{{ item.title }}</span>
        <DestylerIcon
          name="i-carbon-chevron-down"
          :class="state ? 'rotate-180 transform' : ''"
          class="h-5 w-5 text-purple-500"
        />
      </template>
      <template #conter>
        {{ item.content }}
      </template>
    </DestylerAccordionItem>
  </DestylerAccordionRoot>
</template>

<style>
[destyler='accordion-root']{
  @apply p-2 bg-light dark:bg-dark rounded-lg w-600px;
}
[destyler='accordion-item']{
  @apply w-full p-1;
}
[destyler='accordion-item-header']{
  @apply cursor-pointer flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75;
}
[destyler='accordion-item-content']{
  @apply px-2 pt-2 pb-1 text-sm text-dark-500 dark:text-light-500;
}
</style>
