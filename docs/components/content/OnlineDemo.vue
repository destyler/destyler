<script setup lang="ts">
import { DestylerOnline } from 'destyler'

const status = ref<boolean>(false)

function handleStatusChange(value: boolean) {
  status.value = value
}
</script>

<template>
  <DestylerOnline class="content " @network-status="handleStatusChange">
    {{ status ? 'Online' : 'Offline' }}
  </DestylerOnline>
</template>
