<script setup lang="ts">
import { ref } from 'vue'
import { Online } from '@destyler/online'

const status = ref<boolean>(false)

function handleStatusChange(value: boolean) {
  status.value = value
}
</script>

<template>
  <Online class="text-foreground " @network-status="handleStatusChange">
    {{ status ? 'Online' : 'Offline' }}
  </Online>
</template>
