// @noErrors
<script setup lang="ts">
import { Image, ImageFallback, ImageRoot } from '@destyler/image'
import './style.css'
</script>

<template>
  <ImageRoot class="image-root">
    <Image
      class="image"
      src="https://github.com/destyler.png"
    />
    <ImageFallback class="image-fallback">
      DE
    </ImageFallback>
  </ImageRoot>
</template>
