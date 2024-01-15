<script setup lang="ts">
import { DestylerAlert } from '../src'
</script>

<template>
  <DestylerAlert closable>
    <template #close="{ handleClose }">
      <button @click="handleClose">
        close
      </button>
    </template>
  </DestylerAlert>
</template>
