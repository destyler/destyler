<script setup lang="ts">
import { DestylerAccordionItem, DestylerAccordionRoot } from '@destyler/accordion'

const selected = ref('item1')
const items = [
  {
    title: 'Item 1',
    value: 'item1',
    content: 'Item 1.Item 1.Item 1',
  },
  {
    title: 'Item 2',
    value: 'item2',
    content: 'Item 2.Item 2.Item 2',
  },
  {
    title: 'Item 3',
    value: 'item3',
    content: 'Item 3.Item 3.Item 3',
  },
]
</script>

<template>
  <Code>
    <template #unstyle>
      <DestylerAccordionRoot v-model="selected">
        <DestylerAccordionItem v-for="item in items" :key="item.value" :value="item.value">
          <template #header>
            {{ item.title }}
          </template>
          <template #conter>
            {{ item.content }}
          </template>
        </DestylerAccordionItem>
      </DestylerAccordionRoot>
    </template>
    <template #style>
      <DestylerAccordionRoot
        v-model="selected"
        class="bg-white w-[300px] rounded-md shadow-[0_2px_10px] shadow-black/5"
      >
        <DestylerAccordionItem
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          class="[&[destyler=accordion-item-header]]:text-green"
        >
          <template #header>
            {{ item.title }}
          </template>
          <template #conter>
            {{ item.content }}
          </template>
        </DestylerAccordionItem>
      </DestylerAccordionRoot>
    </template>
  </Code>
</template>

<style>

</style>
