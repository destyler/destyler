<script setup lang="ts">
import { AspectRadio } from '@destyler/aspect-radio'
import './styles.css'
</script>

<template>
  <div class="Container">
    <AspectRadio :ratio="16 / 9">
      <img
        class="Image"
        src="https://elonehoo.me/gallery/20_sun.jpg"
      >
    </AspectRadio>
  </div>
</template>
