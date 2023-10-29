<script setup lang="ts">
import { ref } from 'vue'
import { DestylerFocusTrap } from '@destyler/components/focus-trap/src'

const show = ref<boolean>(false)
</script>

<template>
  <div>
    <button class="btn-green" @click="show = !show">
      {{ show ? 'close' : 'open' }}
    </button>
    <div v-if="show" style="padding: 10px;">
      <DestylerFocusTrap :active="show">
        1111
        <input class="input-green w-100px" type="text">
        <input class="input-green w-100px" type="text">
        <button class="btn-sky" @click="show = !show">
          close
        </button>
      </DestylerFocusTrap>
    </div>
  </div>
</template>

<style scoped>
:deep([destyler="focusable-content"]){
  @apply flex flex-wrap gap-1
}
</style>
