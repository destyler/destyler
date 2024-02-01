<script setup lang="ts">
import { DestylerAspectRadio } from 'destyler'
</script>

<template>
  <div class=" w-full sm:w-[300px] overflow-hidden rounded-md">
    <DestylerAspectRadio class="bg-#27272A" :aspect-ratio="16 / 9">
      <img src="https://elonehoo.me/gallery/20_sun.jpg" class="rounded-md object-cover absolute h-full w-full text-transparent inset-0">
    </DestylerAspectRadio>
  </div>
</template>
