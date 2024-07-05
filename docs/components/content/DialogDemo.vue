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
  Icon,
} from 'destyler'

const dialogOpen = ref(false)
</script>

<template>
  <DialogRoot v-model:open="dialogOpen">
    <DialogTrigger>
      <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 border border-#E4E4E7 dark:border-#27272A bg-white dark:bg-#09090B shadow-sm hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#18181B dark:hover:text-#FAFAFA h-9 px-4 py-2">
        Open Dialog
      </button>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogContent
        class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-#FFFFFF dark:bg-#09090B p-6 dark:border-#27272A border-#E4E4E7 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
        :is-escape-key-down-default="true"
        @pointer-down-outside.prevent
      >
        <div class="flex flex-col space-y-1.5 text-center sm:text-left">
          <DialogTitle class="text-#09090b dark:text-#fafafa text-lg font-semibold leading-none tracking-tight">
            Dialog
          </DialogTitle>
          <DialogDescription class="dark:text-#A1A1A9 text-#717179 text-sm">
            Are you sure?
          </DialogDescription>
        </div>
        <DialogClose class="absolute right-4 top-4 rounded-sm opacity-70 dark:ring-offset-#FFFFFF dark:ring-offset-#09090B transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none" as-child>
          <Icon name="i-ri-close-line" class="w-4 h-4 text-#71717A dark:text-#A1A1AA cursor-pointer" />
        </DialogClose>

        <div class="w-full flex justify-end">
          <DialogClose as-child>
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-#18181B dark:bg-#FAFAFA text-#FAFAFA dark:text-#18181B shadow hover:bg-#18181B/90 dark:hover:bg-#FAFAFA/90 h-9 px-4 py-2">
              Sure
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
