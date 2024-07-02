<script setup lang="ts">
import {
  ModalAction,
  ModalCancel,
  ModalContent,
  ModalDescription,
  ModalOverlay,
  ModalPortal,
  ModalRoot,
  ModalTitle,
  ModalTrigger,
} from '../src'
</script>

<template>
  <ModalRoot>
      <ModalTrigger as-child>
        <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 border border-#E4E4E7 dark:border-#27272A bg-white dark:bg-#09090B shadow-sm hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#18181B dark:hover:text-#FAFAFA h-9 px-4 py-2">
          Open
        </button>
      </ModalTrigger>
      <ModalPortal>
        <ModalOverlay class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <ModalContent class="border-#e9e9eb dark:border-#151518 fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border dark:bg-#09090B bg-#FFFFFF p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <div class="flex flex-col space-y-2 text-center sm:text-left">
            <ModalTitle class="text-lg font-semibold dark:text-#fafafa text-#09090b">
              Modal
            </ModalTitle>
            <ModalDescription class="text-sm dark:text-#A1A1AA text-#71717A">
              Are you ok?
            </ModalDescription>
          </div>
          <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <ModalCancel>
              <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 border text-#09090B dark:text-#FFFFFF border-#E4E4E7 dark:border-#27272A dark:bg-#09090B bg-#FFFFFF shadow-sm dark:hover:bg-#27272A hover:bg-#F4F4F5 hover:text-#18181B dark:hover:text-#FAFAFA h-9 px-4 py-2 mt-2 sm:mt-0">
                Cancel
              </button>
            </ModalCancel>
            <ModalAction>
              <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 border text-#FFFFFF dark:text-#09090B dark:border-#E4E4E7 border-#27272A bg-#09090B dark:bg-#FFFFFF shadow-sm hover:bg-#27272A dark:hover:bg-#F4F4F5 dark:hover:text-#18181B hover:text-#FAFAFA h-9 px-4 py-2 mt-2 sm:mt-0">
                Confirm
              </button>
            </ModalAction>
          </div>
        </ModalContent>
      </ModalPortal>
    </ModalRoot>
</template>
