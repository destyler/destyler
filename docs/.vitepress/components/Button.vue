<script setup lang="ts">
import { ref } from 'vue'
import { DestylerButton } from '@destyler/components/button/src'
import { DestylerIcon } from '@destyler/components/icon/src'

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
    <DestylerButton class="btn-green!">
      Default
    </DestylerButton>
    <DestylerButton class="btn-outline-red!">
      Outline
    </DestylerButton>
    <DestylerButton class="btn-soft-sky!">
      Soft
    </DestylerButton>
    <DestylerButton class="btn-ghost-yellow!">
      Ghost
    </DestylerButton>
    <DestylerButton class="btn-link-pink!">
      Link
    </DestylerButton>
  </div>
  <div class="flex flex-wrap gap-4 mt-4">
    <DestylerButton
      class="btn-green!"
      :loading="loadingRef"
      @click="handleClick"
    >
      <template #icon>
        <DestylerIcon name="i-carbon-session-border-control" />
      </template>
      Loading
    </DestylerButton>
    <DestylerButton
      :loading="loadingRef"
      class="btn-gray!"
      @click="handleClick"
    >
      Loading
    </DestylerButton>
    <DestylerButton :loading="loadingRef" class="btn-sky!" @click="handleClick">
      Loading
    </DestylerButton>
  </div>
</template>

<style>
.fade-in-width-expand-transition-leave-from, .fade-in-width-expand-transition-enter-to{
  opacity: 1
}

.fade-in-width-expand-transition-leave-to, .fade-in-width-expand-transition-enter-from{
  opacity: 0!important;
  margin-left: 0!important;
  margin-right: 0!important;
}
.fade-in-width-expand-transition-leave-active{
  overflow: hidden;
  transition:
    opacity 0.2s cubic-bezier(.4, 0, .2, 1),
    max-width 0.2s cubic-bezier(.4, 0, .2, 1) 0.1s,
    margin-left 0.2s cubic-bezier(.4, 0, .2, 1) 0.1s,
    margin-right 0.2s cubic-bezier(.4, 0, .2, 1) 0.1s;
}
.fade-in-width-expand-transition-enter-active{
  overflow: hidden;
  transition:
    opacity 0.2s cubic-bezier(.4, 0, .2, 1) 0.1s,
    max-width 0.2s cubic-bezier(.4, 0, .2, 1),
    margin-left 0.2s cubic-bezier(.4, 0, .2, 1),
    margin-right 0.2s cubic-bezier(.4, 0, .2, 1);
}
</style>
