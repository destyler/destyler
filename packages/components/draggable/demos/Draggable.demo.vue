<script setup lang="ts">
import { DestylerDraggable } from '../src'
</script>

<template>
  <DestylerDraggable
    :x="40"
    :y="80"
    class="w-40px h-40px bg-red z-999"
  />
</template>
