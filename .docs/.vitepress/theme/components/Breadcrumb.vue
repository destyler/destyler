<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'

const { site } = useData()

const route = useRoute()

const breadcrumb = computed(() => {
  for (const sidebar of site.value.themeConfig.sidebar) {
    for (const items of sidebar.items) {
      if (items.link === route.path) {
        return sidebar.text
      }
    }
  }
  return ''
})
</script>

<template>
  <div class="mb-3 text-sm/6 font-semibold text-primary flex items-center gap-1.5">
    {{ breadcrumb }}
  </div>
</template>
