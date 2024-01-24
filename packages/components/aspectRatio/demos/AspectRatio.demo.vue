<script setup lang="ts">
import { DestylerAspectRadio } from '../src'
</script>

<template>
  <DestylerAspectRadio :aspect-ratio="16 / 9">
    <img
      class="img"
      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    >
  </DestylerAspectRadio>
</template>

<style scoped>
.img{
  object-fit: cover;
    width: 100%;
    height: 100%;
}
</style>
