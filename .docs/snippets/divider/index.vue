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
  <div class="w-full max-w-75 mx-4">
    <div class="text-foreground text-sm font-semibold">
      Destyler UI
    </div>
    <div class="text-foreground text-sm">
      unstyled component for vue.
    </div>
    <Divider
      class="bg-primary/50 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4"
    />
    <div class="flex h-5 items-center">
      <template v-for="(item, index) in items" :key="item.value">
        <div
          class="text-foreground text-sm"
        >
          {{ item.label }}
        </div>
        <Divider
          v-if="index < items.length - 1"
          class="bg-primary/50 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-4"
          decorative
          orientation="vertical"
        />
      </template>
    </div>
  </div>
</template>
