<script setup lang="ts">
import { ref } from 'vue'
import { DestylerButton } from '@destyler/components/button/src'

const loadingRef = ref(false)
function handleClick() {
  loadingRef.value = true
  setTimeout(() => {
    loadingRef.value = false
  }, 2000)
}
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <DestylerButton
      class="bg-black! hover:bg-#333333! text-#ebebf5fa! dark:bg-white! dark:hover:bg-#cccccc! dark:text-#1f1f1f! border-#00000000!"
      :loading="loadingRef"
      @click="handleClick"
    >
      Button
    </DestylerButton>
    <DestylerButton
      :loading="loadingRef"
      class="bg-#f1f1f1! hover:bg-#e3e3e3! text-#1f1f1f! dark:bg-#2c2c2e! dark:hover:bg-#222226! dark:text-#ebebf5fa! border-#545458a6!"
    >
      Button
    </DestylerButton>
    <DestylerButton :loading="loadingRef" class="bg-#0969da! hover:bg-#0550ae! text-#ebebf5fa! border-#218bff! dark:bg-#1f6feb! dark:hover:bg-#1158c7! dark:text-#ebebf5fa! dark:border-#388bfd!">
      Button
    </DestylerButton>
  </div>
</template>

<style scoped>
[destyler="button"]{
  padding: 0 16px;
  font-weight: 500;
  min-width: 40px;
  min-height: 40px;
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 0;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 6px;
  overflow: hidden;
  white-space: nowrap;
  transition: color .25s,border-color .25s,background-color .25s;
}
</style>
