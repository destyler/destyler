<script setup lang="ts">
import { Divider } from '@destyler/divider'
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '@destyler/scroll-area'
import './style.css'
</script>

<template>
  <ScrollAreaRoot class="scroll-area-root">
    <ScrollAreaViewport class="scroll-area-viewport">
      <div class="p-4">
        <h4 class="h4-typography">
          Tags
        </h4>
        <template v-for="i in 50" :key="i">
          <div class="item">
            v0.0.0-beta.{{ 51 - i }}
          </div>
          <Divider
            class="divider"
          />
        </template>
      </div>
    </ScrollAreaViewport>
    <ScrollAreaScrollbar class="scroll-area-scrollbar">
      <ScrollAreaThumb class="scroll-area-thumb" />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
