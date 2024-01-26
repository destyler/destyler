<script setup lang="ts">
import { ref } from 'vue'
import {
  DestylerDialogClose,
  DestylerDialogContent,
  DestylerDialogDescription,
  DestylerDialogOverlay,
  DestylerDialogPortal,
  DestylerDialogRoot,
  DestylerDialogTitle,
  DestylerDialogTrigger,
} from '../src'

const dialogOpen = ref(false)
</script>

<template>
  <DestylerDialogRoot v-model:open="dialogOpen">
    <DestylerDialogTrigger>
      Open Dialog
    </DestylerDialogTrigger>
    <DestylerDialogPortal>
      <DestylerDialogOverlay />
      <DestylerDialogContent>
        <DestylerDialogTitle>
          Open Dialog
        </DestylerDialogTitle>
        <DestylerDialogDescription>
          Open Dialog Description
        </DestylerDialogDescription>
        <div>
          content
        </div>
        <div>
          <DestylerDialogClose as-child>
            <button>
              close
            </button>
          </DestylerDialogClose>
        </div>
      </DestylerDialogContent>
    </DestylerDialogPortal>
  </DestylerDialogRoot>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
