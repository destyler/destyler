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
  <div class="box">
    <div class="text" style="font-weight: 600;">
      Destyler UI
    </div>
    <div class="text">
      unstyled component for vue.
    </div>
    <Divider
      class="divider"
      style="margin-top: 1rem;margin-bottom: 1rem;"
    />
    <div class="desc">
      <template v-for="(item, index) in items" :key="item.value">
        <div
          class="text"
        >
          {{ item.label }}
        </div>
        <Divider
          v-if="index < items.length - 1"
          class="divider"
          style="margin-left: 1rem;margin-right: 1rem;"
          decorative
          orientation="vertical"
        />
      </template>
    </div>
  </div>
</template>
