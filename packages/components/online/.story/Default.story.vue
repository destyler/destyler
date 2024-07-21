<script setup lang="ts">
import { ref } from 'vue'
import { Online } from '../src'

const status = ref<boolean>(false)

function handleStatusChange(value: boolean) {
  status.value = value
}
</script>

<template>
  <Story title="Online/Default" :layout="{ type: 'single', iframe: false }">
    <Variant title="default">
      <Online class="content " @network-status="handleStatusChange">
        {{ status ? 'Online' : 'Offline' }}
      </Online>
    </Variant>
  </Story>
</template>
