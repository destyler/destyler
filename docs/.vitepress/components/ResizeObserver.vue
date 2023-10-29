<script setup lang="ts">
import { DestylerResizeObserver } from '@destyler/components/resizeObserver/src'

function handleResize() {
  console.log('element resize')
}
</script>

<template>
  <div>
    <DestylerResizeObserver @resize="handleResize">
      <div class="w-[300px] resize overflow-auto p-5 border-2 border-solid">
        DestylerResizeObserver
      </div>
    </DestylerResizeObserver>
  </div>
</template>
