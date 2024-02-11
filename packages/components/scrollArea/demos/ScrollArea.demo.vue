<script setup lang="ts">
import {
  DestylerScrollAreaCorner,
  DestylerScrollAreaRoot,
  DestylerScrollAreaScrollbar,
  DestylerScrollAreaThumb,
  DestylerScrollAreaViewport,
} from '../src'

const tags = Array.from({ length: 50 }).map((_, i, a) => `v0.0.1-beta.${a.length - i}`)
</script>

<template>
  <DestylerScrollAreaRoot
    style="--scrollbar-size: 10px"
    class="w-[200px] h-[225px] rounded overflow-hidden shadow-[0_2px_10px] shadow-light bg-white"
  >
    <DestylerScrollAreaViewport class="w-full h-full rounded">
      <div>
        <div>
          Tags
        </div>
        <div
          v-for="tag in tags"
          :key="tag"
        >
          {{ tag }}
        </div>
      </div>
    </DestylerScrollAreaViewport>
    <DestylerScrollAreaScrollbar
      orientation="vertical"
    >
      <DestylerScrollAreaThumb />
    </DestylerScrollAreaScrollbar>
    <DestylerScrollAreaScrollbar
      orientation="horizontal"
    >
      <DestylerScrollAreaThumb />
    </DestylerScrollAreaScrollbar>
  </DestylerScrollAreaRoot>
</template>
