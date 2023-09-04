<script setup lang="ts">
const selected = ref<boolean>(true)
</script>

<template>
  <div>
    {{ selected }}
  </div>
  <DestylerCheckbox v-model="selected">
    <DestylerIcon name="radix-icons:check" />
  </DestylerCheckbox>
</template>
