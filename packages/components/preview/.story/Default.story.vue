<script setup lang="ts">
import { PreviewDialog, PreviewRoot } from '../src'
</script>

<template>
  <Story title="Preview/Default" :layout="{ type: 'single', iframe: false }">
    <Variant title="default">
      <PreviewRoot class="transition-transform ease-in-out duration-500 outline-none">
        <PreviewDialog class="fixed z-800 left-0 top-0 w-screen h-screen backdrop-blur-md cursor-zoom-out" />
        <img class="h-50 w-80 rounded-lg" src="https://elonehoo.me/gallery/21_tree.jpg">
      </PreviewRoot>
    </Variant>
  </Story>
</template>
