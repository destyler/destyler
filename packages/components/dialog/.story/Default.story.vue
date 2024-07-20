<script setup lang="ts">
import Dialog from './components/Dialog.vue'
</script>

<template>
  <Story title="Dialog/Default" :layout="{ type: 'single', iframe: false }">
    <Variant title="default">
      <Dialog />
    </Variant>
  </Story>
</template>
