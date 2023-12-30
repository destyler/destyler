<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <NuxtLink
    to="https://github.com/destyler/destyler"
    target="_blank"
  >
    {{ props.title }}
  </NuxtLink>
</template>
