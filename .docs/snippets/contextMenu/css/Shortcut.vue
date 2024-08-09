<script setup lang="ts">
import './style.css'
</script>

<template>
  <span class="span">
    <slot />
  </span>
</template>

<style scoped>
.span {
  margin-left: auto;
  font-size: 0.75rem; /* 12px */
  line-height: 1rem; /* 16px */
  letter-spacing: 0.1em;
  color: rgb(var(--muted-foreground));
}
</style>
