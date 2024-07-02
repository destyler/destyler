<script setup lang="ts">
import { AspectRadio } from '../src'
</script>

<template>
  <AspectRadio :aspect-ratio="16 / 9">
    <img
      class="img"
      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    >
  </AspectRadio>
</template>

<style scoped>
.img{
  object-fit: cover;
    width: 100%;
    height: 100%;
}
</style>
