<script setup lang="ts">
import DropdownMenu from './components/DropdownMenu.vue'
</script>

<template>
  <Story title="Dropdown/Default" :layout="{ type: 'single', iframe: false }">
    <Variant title="default">
      <DropdownMenu />
    </Variant>
  </Story>
</template>
