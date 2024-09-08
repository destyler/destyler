<script setup lang="ts">
import { ref } from 'vue'
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from '@destyler/toast'
import { Icon } from '@destyler/icon'
import { Button } from '@destyler/button'

const value = ref(false)

const timerRef = ref(0)

const eventDateRef = ref(new Date())

function oneWeekAway() {
  const now = new Date()
  const inOneWeek = now.setDate(now.getDate() + 7)
  return new Date(inOneWeek)
}

function prettyDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(date)
}

function handleClick() {
  value.value = false
  window.clearTimeout(timerRef.value)
  timerRef.value = window.setTimeout(() => {
    eventDateRef.value = oneWeekAway()
    value.value = true
  }, 100)
}
</script>

<template>
  <ToastProvider>
    <Button
      class="
      inline-flex items-center justify-center whitespace-nowrap
      rounded-md text-sm font-medium transition-colors
      shadow h-9 px-4 py-2
      focus-visible:outline-none focus-visible:ring-1
      disabled:pointer-events-none disabled:opacity-50
      bg-primary hover:bg-primary/90 text-primary-foreground
      "
      @click="handleClick"
    >
      Add to calendar
    </Button>

    <ToastRoot
      v-model:open="value"
      class="
      before:content-none! border bg-background text-foreground
      group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full
      "
    >
      <div class="grid gap-1">
        <ToastTitle class="text-sm font-semibold text-dark dark:text-light">
          Scheduled: Catch up
        </ToastTitle>
        <ToastDescription as-child>
          <time
            class="text-xs opacity-90 text-dark dark:text-light"
            :dateTime="eventDateRef.toISOString()"
          >
            {{ prettyDate(eventDateRef) }}
          </time>
        </ToastDescription>
      </div>
      <ToastAction
        class="text-dark dark:text-light inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
        alt-text="Goto schedule to undo"
      >
        Undo
      </ToastAction>
      <ToastClose class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600">
        <Icon name="carbon:close" class="h-4 w-4" />
      </ToastClose>
    </ToastRoot>
    <ToastViewport class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
  </ToastProvider>
</template>
