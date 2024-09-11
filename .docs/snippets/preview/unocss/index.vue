<script setup lang="ts">
import {
  PreviewDialog,
  PreviewRoot,
} from '@destyler/preview'
import {
  Image,
  ImageRoot,
} from '@destyler/image'
</script>

<template>
  <PreviewRoot
    transition="transform"
    ease-in-out="~"
    duration-50="~"
    outline="none"
  >
    <PreviewDialog
      fixed="~"
      z="800"
      left="0"
      top="0"
      w="screen"
      h="screen"
      bg="white dark:black op-50"
      backdrop-blur="md"
      cursor="zoom-out"
    />
    <ImageRoot>
      <Image
        rounded="2xl"
        h="50"
        w="80"
        src="https://elonehoo.me/gallery/21_tree.jpg"
      />
    </ImageRoot>
  </PreviewRoot>
</template>
