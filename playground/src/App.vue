<script setup lang="ts">
import { DestylerOnline } from '@destyler/components/online/src/online'

const isOnline = ref<boolean>(false)

function handleOnline(state: boolean) {
  isOnline.value = state
}
</script>

<template>
  <DestylerOnline @network-status="handleOnline">
    {{ isOnline }}
  </DestylerOnline>
</template>

<style>

</style>
