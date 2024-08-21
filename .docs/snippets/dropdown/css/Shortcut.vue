// @noErrors
<script setup lang="ts">
</script>

<template>
  <span class="shortcut">
    <slot />
  </span>
</template>

<style scoped>
.shortcut {
  margin-left: auto;
  font-size: 0.75rem; /* 12px */
  line-height: 1rem; /* 16px */
  letter-spacing: 0.1em;
  opacity: 0.6;
}
</style>
