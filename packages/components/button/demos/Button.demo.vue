<script setup lang="ts">
import { DestylerButton } from '../src'

function handle() {
  console.log('click')
}
</script>

<template>
  <DestylerButton as="a" @click="handle">
    Button
  </DestylerButton>
</template>
