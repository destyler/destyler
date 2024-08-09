<script setup lang="ts">
import { AspectRadio } from '@destyler/aspect-radio'
</script>

<template>
  <div class="shadow-primary w-full sm:w-75 overflow-hidden rounded-md shadow-[0_2px_10px]">
    <AspectRadio :ratio="16 / 9">
      <img
        class="h-full w-full object-cover"
        src="https://elonehoo.me/gallery/20_sun.jpg"
      >
    </AspectRadio>
  </div>
</template>
