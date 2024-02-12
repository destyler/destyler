<script setup lang="ts">
import {
  DestylerDivider,
  DestylerScrollAreaCorner,
  DestylerScrollAreaRoot,
  DestylerScrollAreaScrollbar,
  DestylerScrollAreaThumb,
  DestylerScrollAreaViewport,
} from 'destyler'

const tags = Array.from({ length: 51 }).map((_, i, a) => `v0.0.1-beta.${a.length - i - 1}`)
</script>

<template>
  <DestylerScrollAreaRoot
    style="--scrollbar-size: 10px"
    class="relative overflow-hidden h-72 w-48 rounded-md border dark:border-#27272A border-#E4E4E7"
  >
    <DestylerScrollAreaViewport class="h-full w-full rounded">
      <div class="p-4">
        <h4 class="mb-4 text-sm font-medium leading-none">
          Tags
        </h4>
        <template v-for="(tag, index) in tags" :key="index">
          <div class="text-sm">
            {{ tag }}
          </div>
          <DestylerDivider class="shrink-0 dark:bg-#27272A bg-#E4E4E7 h-[1px] w-full my-2" />
        </template>
      </div>
    </DestylerScrollAreaViewport>
    <DestylerScrollAreaScrollbar orientation="vertical" class="flex touch-none select-none transition-colors h-full w-2.5 border-l border-l-transparent p-[1px]">
      <DestylerScrollAreaThumb class="relative flex-1 rounded-full dark:bg-#27272A bg-#E4E4E7" />
    </DestylerScrollAreaScrollbar>
    <DestylerScrollAreaCorner />
  </DestylerScrollAreaRoot>
</template>
