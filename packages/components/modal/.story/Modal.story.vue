<script setup lang="ts">
import Modal from './components/Modal.vue'
</script>

<template>
  <Story title="Modal/Demo" :layout="{ type: 'single', iframe: true }">
    <Variant title="default">
      <Modal />
    </Variant>
  </Story>
</template>
