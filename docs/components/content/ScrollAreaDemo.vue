<script setup lang="ts">
import {
  Divider,
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from 'destyler'

const tags = Array.from({ length: 51 }).map((_, i, a) => `v0.0.1-beta.${a.length - i - 1}`)
</script>

<template>
  <ScrollAreaRoot
    style="--scrollbar-size: 10px"
    class="relative overflow-hidden h-72 w-48 rounded-md border dark:border-#27272A border-#E4E4E7"
  >
    <ScrollAreaViewport class="h-full w-full rounded">
      <div class="p-4">
        <h4 class="mb-4 text-sm font-medium leading-none">
          Tags
        </h4>
        <template v-for="(tag, index) in tags" :key="index">
          <div class="text-sm">
            {{ tag }}
          </div>
          <Divider class="shrink-0 dark:bg-#27272A bg-#E4E4E7 h-[1px] w-full my-2" />
        </template>
      </div>
    </ScrollAreaViewport>
    <ScrollAreaScrollbar orientation="vertical" class="flex touch-none select-none transition-colors h-full w-2.5 border-l border-l-transparent p-[1px]">
      <ScrollAreaThumb class="relative flex-1 rounded-full dark:bg-#27272A bg-#E4E4E7" />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
