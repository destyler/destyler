<script setup lang="ts">
import { Divider } from '@destyler/divider'
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '@destyler/scroll-area'
</script>

<template>
  <ScrollAreaRoot class="relative overflow-y-scroll z-10 h-72 w-48 rounded-md border">
    <ScrollAreaViewport class="h-full w-full rounded-[inherit]">
      <div class="p-4">
        <h4 class="mb-4! text-lg font-medium leading-none text-dark dark:text-light mt-0!">
          Tags
        </h4>
        <template v-for="i in 50" :key="i">
          <div class="text-base text-dark dark:text-light">
            v0.0.0-beta.{{ 51 - i }}
          </div>
          <Divider
            class="my-2! bg-primary/50 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4"
          />
        </template>
      </div>
    </ScrollAreaViewport>
    <ScrollAreaScrollbar class="flex touch-none select-none transition-colors h-full w-2.5 border-l border-l-transparent p-[1px]">
      <ScrollAreaThumb class="relative flex-1 rounded-full bg-border" />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
