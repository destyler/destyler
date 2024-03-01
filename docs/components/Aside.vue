<script setup lang="ts">
import {
  DestylerLabel,
  DestylerScrollAreaCorner,
  DestylerScrollAreaRoot,
  DestylerScrollAreaScrollbar,
  DestylerScrollAreaThumb,
  DestylerScrollAreaViewport,
} from 'destyler'

const route = useRoute()
</script>

<template>
  <DestylerScrollAreaRoot
    style="--scrollbar-size: 10px"
    class="relative overflow-hidden h-[calc(100vh-3rem)] w-full rounded-md border-none"
  >
    <DestylerScrollAreaViewport class="h-full w-full rounded">
      <aside class="fixed top-14 z-30 -ml-2 hidden h-full w-full shrink-0 md:sticky md:block">
        <div class="relative overflow-hidden h-full py-6 pr-6 lg:py-8">
          <div class="w-full">
            <div v-for="items in asideItems" :key="items.text" class="pb-4">
              <h4 class="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                <DestylerLabel>
                  {{ items.text }}
                </DestylerLabel>
              </h4>
              <div class="grid grid-flow-row auto-rows-max text-sm">
                <NuxtLink
                  v-for="item in items.children"
                  :key="item.link"
                  :to="item.link"
                  class="flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-#09090b dark:text-#fafafa"
                  :class="{
                    'text-op-100!': route.path === item.link,
                    'text-op-60! hover:text-op-80!': route.path !== item.link,
                  }"
                >
                  {{ item.text }}
                  <AlphaTag v-if="item.alpha">
                    New
                  </AlphaTag>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <slot />
      </aside>
    </DestylerScrollAreaViewport>
    <DestylerScrollAreaScrollbar orientation="vertical" class="flex touch-none select-none transition-colors h-full w-2.5 border-l border-l-transparent p-[1px]">
      <DestylerScrollAreaThumb class="relative flex-1 rounded-full dark:bg-#27272A bg-#E4E4E7" />
    </DestylerScrollAreaScrollbar>
    <DestylerScrollAreaCorner />
  </DestylerScrollAreaRoot>
</template>
