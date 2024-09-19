<script setup lang="ts">
import { shallowRef } from 'vue'
import { onContentUpdated } from 'vitepress'
import { Button, Icon } from 'destyler'
import { getHeaders } from '../../composables/outline'

const headers = shallowRef<any[]>([])

onContentUpdated(() => {
  headers.value = getHeaders()
})

const open = ref(false)
</script>

<template>
  <Button class="flex items-center gap-1.5 lg:cursor-text lg:select-text w-full group" tabindex="-1" @click="open = !open">
    <span class="font-semibold text-sm/6 truncate">Table of Contents</span>
    <Icon name="heroicons:chevron-down-20-solid" class="lg:!hidden w-5 h-5 ms-auto transform transition-transform duration-200 flex-shrink-0 mr-1.5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 -rotate-90" />
  </Button>
  <div :class="[open ? 'lg:block' : 'hidden lg:block']">
    <TocItem :lists="headers" />
  </div>
</template>
