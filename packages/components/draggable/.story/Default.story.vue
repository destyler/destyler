<script setup lang="ts">
import { Draggable } from '../src'
</script>

<template>
  <Story title="Draggable/Default" :layout="{ type: 'single', iframe: false }">
    <Variant title="default">
      <Draggable
        :x="400"
        :y="200"
        class="w-10 h-10 bg-red z-[999]"
      />
    </Variant>
  </Story>
</template>
