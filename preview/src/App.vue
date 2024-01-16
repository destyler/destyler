<script setup lang="ts">
import { DestylerAlert } from '@destyler/alert'
</script>

<template>
  <DestylerAlert closable>
    1111
    <template #close="{ handleClose }">
      <span @click="handleClose">close</span>
    </template>
  </DestylerAlert>
</template>
