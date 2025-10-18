<script setup lang="ts">
defineOptions({
  name: 'Layout',
})
</script>

<template>
  <div class="layout">
    <slot />
  </div>
</template>

<style scoped>
.layout{
  flex: 1 1 0%;
  padding: 1.5rem; /* 24px */
  overflow-y: auto;
}
</style>
