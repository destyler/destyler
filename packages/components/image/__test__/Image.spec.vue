<script setup lang="ts">
import { Image, ImageFallback, ImageRoot } from '../src'

defineProps<{ delay?: number }>()
</script>

<template>
  <ImageRoot>
    <Image
      src="https://github.com/elonehoo.png"
      alt="Elone Hoo"
    />
    <ImageFallback
      :delay-ms="delay"
    >
      EH
    </ImageFallback>
  </ImageRoot>
</template>
