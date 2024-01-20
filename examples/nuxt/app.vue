<script setup lang="ts">
import ModalDemo from '@destyler/demo/modal/demos/Modal.demo.vue'
import Dialogdemo from '@destyler/demo/dialog/demos/Dialog.demo.vue'
</script>

<template>
  <div>
    <ClientOnly>
      <ModalDemo />
    </ClientOnly>
    <Dialogdemo />
  </div>
</template>
