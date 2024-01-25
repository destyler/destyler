<script setup lang="ts">
import { DestylerPreviewDialog, DestylerPreviewRoot } from 'destyler'
</script>

<template>
  <DestylerPreviewRoot class="transition-transform ease-in-out duration-500 outline-none">
    <DestylerPreviewDialog class="fixed z-800 left-0 top-0 w-screen h-screen bg-white dark:bg-black bg-opacity-50 backdrop-blur-md cursor-zoom-out" />
    <img class="rounded-2xl h-300px w-600px" src="https://elonehoo.me/gallery/21_tree.jpg">
  </DestylerPreviewRoot>
</template>
