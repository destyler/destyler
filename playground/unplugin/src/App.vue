<script setup lang="ts">
const selected = ref('item1')
const selected1 = ref('item3')

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
  <DestylerIcon name="carbon-home" />

  <DestylerButton :disabled="true">
    button
  </DestylerButton>

  <DestylerAvatar />
</template>
