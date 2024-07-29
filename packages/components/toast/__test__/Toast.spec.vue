<script setup lang="ts">
import { ref } from 'vue'
import { ToastAction, ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from '../src'

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
  <ToastProvider swipe-direction="left">
    <button
      @click="handleClick"
    >
      Add to calendar
    </button>

    <ToastRoot
      v-model:open="open"
    >
      <ToastTitle>
        Scheduled: Catch up
      </ToastTitle>
      <ToastDescription as-child>
        <time
          :dateTime="eventDateRef.toISOString()"
        >
          {{ prettyDate(eventDateRef) }}
        </time>
      </ToastDescription>
      <ToastAction as-child alt-text="Goto schedule to undo">
        <button>
          Close
        </button>
      </ToastAction>
    </ToastRoot>
    <ToastViewport />
  </ToastProvider>
</template>
