<script setup lang="ts">
import { AspectRadio } from '@destyler/aspect-radio'
</script>

<template>
  <div
    w="full sm:75"
    shadow="primary"
    overflow="hidden"
    rounded="md"
  >
    <AspectRadio :aspect-ratio="16 / 9">
      <img
        src="https://elonehoo.me/gallery/20_sun.jpg"
        rounded="md"
        object="cover"
        absolute
        inset="0"
        h="full"
        w="full"
        text="transparent"
      >
    </AspectRadio>
  </div>
</template>
