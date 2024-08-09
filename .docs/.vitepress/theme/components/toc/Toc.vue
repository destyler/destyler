<script setup lang="ts">
import { shallowRef } from 'vue'
import { onContentUpdated } from 'vitepress'
import { getHeaders } from '../../composables/outline'

const headers = shallowRef<any[]>([])

onContentUpdated(() => {
  headers.value = getHeaders()
})
</script>

<template>
  <div class="flex items-center gap-1.5 lg:cursor-text lg:select-text w-full group" tabindex="-1">
    <span class="font-semibold text-sm/6 truncate">Table of Contents</span>
  </div>
  <TocItem :lists="headers" />
</template>
