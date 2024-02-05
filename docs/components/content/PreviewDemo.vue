<script setup lang="ts">
import {
  DestylerImage,
  DestylerImageRoot,
  DestylerPreviewDialog,
  DestylerPreviewRoot,
} from 'destyler'
</script>

<template>
  <DestylerPreviewRoot class="transition-transform ease-in-out duration-500 outline-none">
    <DestylerPreviewDialog class="fixed z-800 left-0 top-0 w-screen h-screen bg-white dark:bg-black bg-opacity-50 backdrop-blur-md cursor-zoom-out" />
    <DestylerImageRoot>
      <DestylerImage class="rounded-2xl h-50 w-80" src="https://elonehoo.me/gallery/21_tree.jpg" />
    </DestylerImageRoot>
  </DestylerPreviewRoot>
</template>
