<script setup lang="ts">
import {
  PreviewDialog,
  PreviewRoot,
} from '@destyler/preview'
import {
  Image,
  ImageRoot,
} from '@destyler/image'
import './style.css'
</script>

<template>
  <PreviewRoot class="preview-root">
    <PreviewDialog class="preview-dialog" />
    <ImageRoot>
      <Image class="image" src="https://elonehoo.me/gallery/21_tree.jpg" />
    </ImageRoot>
  </PreviewRoot>
</template>
