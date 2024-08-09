<script setup lang="ts">
const props = defineProps<{
  lists: string[]
}>()
</script>

<template>
  <ul class="features-list" dir="auto" flex="~ col gap2 md:gap-3">
    <FeaturesItem v-for="(item, index) in props.lists" :key="index">
      {{ item }}
    </FeaturesItem>
  </ul>
</template>

<style scoped>
.features-list li {
  padding-left: 0 !important;
  list-style: none;
  display: flex;
  gap: 0.4rem;
  margin: 0;
}
.features-list li::before {
  content: none;
}
.features-list {
  padding: 0;
}
</style>
