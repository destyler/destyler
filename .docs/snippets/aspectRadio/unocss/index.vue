<script setup lang="ts">
import { AspectRadio } from '@destyler/aspect-radio'
</script>

<template>
  <div class="shadow-primary w-full sm:w-75 overflow-hidden rounded-md">
    <AspectRadio :aspect-ratio="16 / 9">
      <img src="https://elonehoo.me/gallery/20_sun.jpg" class="rounded-md object-cover absolute h-full w-full text-transparent inset-0">
    </AspectRadio>
  </div>
</template>
