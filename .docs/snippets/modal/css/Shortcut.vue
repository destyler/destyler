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
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--muted-foreground);
}
</style>
