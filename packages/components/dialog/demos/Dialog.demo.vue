<script setup lang="ts">
import { ref } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '../src'

const dialogOpen = ref(false)
</script>

<template>
  <DialogRoot v-model:open="dialogOpen">
    <DialogTrigger>
      Open Dialog
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle>
          Open Dialog
        </DialogTitle>
        <DialogDescription>
          Open Dialog Description
        </DialogDescription>
        <div>
          content
        </div>
        <div>
          <DialogClose as-child>
            <button>
              close
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
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
