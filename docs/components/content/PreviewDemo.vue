<script setup lang="ts">
import {
  Image,
  ImageRoot,
  PreviewDialog,
  PreviewRoot,
} from 'destyler'
</script>

<template>
  <PreviewRoot class="transition-transform ease-in-out duration-500 outline-none">
    <PreviewDialog class="fixed z-800 left-0 top-0 w-screen h-screen bg-white dark:bg-black bg-opacity-50 backdrop-blur-md cursor-zoom-out" />
    <ImageRoot>
      <Image class="rounded-2xl h-50 w-80" src="https://elonehoo.me/gallery/21_tree.jpg" />
    </ImageRoot>
  </PreviewRoot>
</template>
