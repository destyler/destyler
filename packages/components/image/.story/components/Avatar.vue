<script setup lang="ts">
import { Image, ImageFallback, ImageRoot } from '../../src'

defineProps<{ delay?: number }>()
</script>

<template>
  <ImageRoot
    class="bg-blackA3 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle"
  >
    <Image
      class="h-full w-full rounded-[inherit] object-cover"
      src="https://github.com/elonehoo.png"
      alt="Elone Hoo"
    />
    <ImageFallback
      class="text-green11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
      :delay-ms="delay"
    >
      EH
    </ImageFallback>
  </ImageRoot>
</template>
