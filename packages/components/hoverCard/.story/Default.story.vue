<script setup lang="ts">
import HoverCard from './components/HoverCard.vue'
</script>

<template>
  <Story title="Hover Card/Demo" :layout="{ type: 'single', iframe: true }">
    <Variant title="default">
      <HoverCard />
    </Variant>
  </Story>
</template>
