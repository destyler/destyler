<script setup lang="ts">
import { DestylerDraggable, DestylerIcon } from 'destyler'
</script>

<template>
  <DestylerDraggable :x="1000" :y="375" class="cursor-move">
    <DestylerIcon name="devicon:vuejs" class="w-8 h-8" />
  </DestylerDraggable>
</template>
