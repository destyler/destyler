<script setup lang="ts">
import { Draggable, Icon } from 'destyler'
</script>

<template>
  <Draggable :x="1000" :y="375" class="cursor-move">
    <Icon name="devicon:vuejs" class="w-8 h-8" />
  </Draggable>
</template>
