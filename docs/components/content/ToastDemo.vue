<script setup lang="ts">
import {
  DestylerButton,
  DestylerIcon,
  DestylerToastAction,
  DestylerToastClose,
  DestylerToastDescription,
  DestylerToastProvider,
  DestylerToastRoot,
  DestylerToastTitle,
  DestylerToastViewport,
} from 'destyler'

const open = ref(false)
const eventDateRef = ref(new Date())
const timerRef = ref(0)

function oneWeekAway() {
  const now = new Date()
  const inOneWeek = now.setDate(now.getDate() + 7)
  return new Date(inOneWeek)
}

function prettyDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(date)
}

function handleClick() {
  open.value = false
  window.clearTimeout(timerRef.value)
  timerRef.value = window.setTimeout(() => {
    eventDateRef.value = oneWeekAway()
    open.value = true
  }, 100)
}
</script>

<template>
  <DestylerToastProvider>
    <DestylerButton
      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:bg-#FAFAFA dark:hover:bg-#FAFAFA/90 bg-#18181B hover:bg-#18181B/90 dark:text-#18181B text-#FAFAFA shadow h-9 px-4 py-2"
      @click="handleClick"
    >
      Add to message
    </DestylerButton>

    <DestylerToastRoot
      v-model:open="open"
      class="group pointer-events-auto relative border border-black border-op-9 dark:border-white dark:border-op-9 flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md p-4 pr-6 shadow-lg transition-all ToastRoot border dark:bg-#09090B bg-#FFFFFF dark:text-#FAFAFA text-#09090B"
    >
      <div class="grid gap-1">
        <DestylerToastTitle class="text-sm font-semibold [&+div]:text-xs">
          Scheduled: Catch up
        </DestylerToastTitle>
        <DestylerToastDescription class="text-sm opacity-90">
          <time
            class="[grid-area:_description] m-0 text-slate11 text-[13px] leading-[1.3]"
            :dateTime="eventDateRef.toISOString()"
          >
            {{ prettyDate(eventDateRef) }}
          </time>
        </DestylerToastDescription>
      </div>
      <DestylerToastAction
        class="inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-black border-op-9 dark:border-white dark:border-op-9 bg-transparent px-3 text-sm font-medium transition-colors hover:bg-#F4F4F5 dark:hover:bg-#27272A focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-#F4F4F5/40 dark:group-[.destructive]:border-#27272A/40 dark:group-[.destructive]:hover:border-#7F1D1D/30 group-[.destructive]:hover:border-#DC2626/30 dark:group-[.destructive]:hover:bg-#7F1D1D group-[.destructive]:hover:bg-#DC2626 group-[.destructive]:hover:text-#FAFAFA dark:group-[.destructive]:hover:text-#FEF2F2 dark:group-[.destructive]:focus:ring-#7F1D1D group-[.destructive]:focus:ring-#DC2626"
        alt-text="Goto schedule to undo"
      >
        Undo
      </DestylerToastAction>
      <DestylerToastClose class="absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600">
        <DestylerIcon name="radix-icons:cross-2" class="h-4 w-4" />
      </DestylerToastClose>
    </DestylerToastRoot>
    <DestylerToastViewport class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
  </DestylerToastProvider>
</template>

<style scoped>
.ToastRoot[data-state='open'] {
  animation: slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1);
}
.ToastRoot[data-state='closed'] {
  animation: hide 100ms ease-in;
}
.ToastRoot[data-swipe='move'] {
  transform: translateX(var(--destyler_toast_swipe_move_x));
}
.ToastRoot[data-swipe='cancel'] {
  transform: translateX(0);
  transition: transform 200ms ease-out;
}
.ToastRoot[data-swipe='end'] {
  animation: swipeOut 100ms ease-out;
}

@keyframes hide {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(calc(100% + var(--viewport-padding)));
  }
  to {
    transform: translateX(0);
  }
}

@keyframes swipeOut {
  from {
    transform: translateX(var(--destyler_toast_swipe_end_x));
  }
  to {
    transform: translateX(calc(100% + var(--viewport-padding)));
  }
}
</style>
