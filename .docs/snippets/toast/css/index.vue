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
      class="button"
      @click="handleClick"
    >
      Add to calendar
    </Button>

    <ToastRoot
      v-model:open="value"
      class="toast-root"
    >
      <div class="box">
        <ToastTitle class="toast-title">
          Scheduled: Catch up
        </ToastTitle>
        <ToastDescription as-child>
          <time
            class="toast-description"
            :dateTime="eventDateRef.toISOString()"
          >
            {{ prettyDate(eventDateRef) }}
          </time>
        </ToastDescription>
      </div>
      <ToastAction
        class="toast-action"
        alt-text="Goto schedule to undo"
      >
        Undo
      </ToastAction>
      <ToastClose class="toast-close">
        <Icon name="carbon:close" class="icon" />
      </ToastClose>
    </ToastRoot>
    <ToastViewport class="ftoast-viewport" />
  </ToastProvider>
</template>
