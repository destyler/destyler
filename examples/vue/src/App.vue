<script setup lang="ts">
import { DestylerAccordionItem, DestylerAccordionRoot, useAccordionSelected } from 'destyler'

const selected = useAccordionSelected()

const items = [
  {
    title: 'Item 1',
    value: 'item1',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.',
  },
  {
    title: 'Item 2',
    value: 'item2',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.',
  },
  {
    title: 'Item 3',
    value: 'item3',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.',
  },
]
</script>

<template>
  <div>
    {{ selected }}
  </div>
  <DestylerAccordionRoot>
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
