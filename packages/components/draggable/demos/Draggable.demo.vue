<script setup lang="ts">
import { Draggable } from '../src'
</script>

<template>
  <Draggable
    :x="40"
    :y="80"
    class="w-40px h-40px bg-red z-999"
  />
</template>
