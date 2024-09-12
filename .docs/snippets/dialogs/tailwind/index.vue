<script setup lang="ts">
import { Icon } from '@destyler/icon'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@destyler/dialog'
</script>

<template>
  <DialogRoot>
    <DialogTrigger
      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors shadow h-9 px-4 py-2 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      Open Dialog
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-white/50 dark:bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />
      <DialogContent
        class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 sm:rounded-lg bg-white dark:bg-black border-border shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-50% data-[state=closed]:slide-out-to-top-48% data-[state=open]:slide-in-from-left-50% data-[state=open]:slide-in-from-top-48%"
      >
        <div class="flex flex-col space-y-[1.5] text-center sm:text-left">
          <DialogTitle class="text-primary text-lg font-semibold leading-none tracking-tight">
            Dialog
          </DialogTitle>
          <DialogDescription class="text-sm text-muted-foreground">
            Are you sure?
          </DialogDescription>
        </div>
        <DialogClose class="absolute right-4 top-4 rounded-sm transition-opacity focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:pointer-events-none">
          <Icon name="ri:close-line" class="w-4 h-4 text-popover-foreground text-opacity-40 hover:text-opacity-100 cursor-pointer" />
        </DialogClose>
        <div class="w-full flex justify-end">
          <DialogClose
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors shadow h-9 px-4 py-2 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Sure
          </DialogClose>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
