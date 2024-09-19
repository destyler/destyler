<script setup lang="ts">
import { ref } from 'vue'
import { Divider } from '@destyler/divider'

const items = ref([
  { label: 'Blog', value: 'blog' },
  { label: 'Docs', value: 'docs' },
  { label: 'Source', value: 'source' },
])
</script>

<template>
  <div
    w="full"
    max-w="75"
    m="x-4"
  >
    <div
      text="sm foreground"
      font="medium"
    >
      Destyler UI
    </div>
    <div
      text="sm foreground"
    >
      unstyled component for vue.
    </div>
    <Divider
      bg="primary/50"
      m="y-4"
      h="data-[orientation=horizontal]:px data-[orientation=vertical]:full"
      w="data-[orientation=horizontal]:full data-[orientation=vertical]:px"
    />
    <div
      flex="~"
      h="5"
      items="center"
    >
      <template v-for="(item, index) in items" :key="item.value">
        <div
          text="sm foreground"
        >
          {{ item.label }}
        </div>
        <Divider
          v-if="index < items.length - 1"
          bg="primary/50"
          m="x-4"
          h="data-[orientation=horizontal]:px data-[orientation=vertical]:full"
          w="data-[orientation=horizontal]:full data-[orientation=vertical]:px"
          decorative
          orientation="vertical"
        />
      </template>
    </div>
  </div>
</template>
