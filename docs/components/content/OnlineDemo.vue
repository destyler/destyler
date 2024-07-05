<script setup lang="ts">
import { Online } from 'destyler'

const status = ref<boolean>(false)

function handleStatusChange(value: boolean) {
  status.value = value
}
</script>

<template>
  <Online class="content " @network-status="handleStatusChange">
    {{ status ? 'Online' : 'Offline' }}
  </Online>
</template>
