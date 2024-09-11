<script setup lang="ts">
import { ref } from 'vue'
import { Online } from '@destyler/online'
import './style.css'

const status = ref<boolean>(false)

function handleStatusChange(value: boolean) {
  status.value = value
}
</script>

<template>
  <Online class="online" @network-status="handleStatusChange">
    {{ status ? 'Online' : 'Offline' }}
  </Online>
</template>
