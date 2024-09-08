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
      inline="flex"
      items="center"
      justify="center"
      whitespace="nowrap"
      rounded="md"
      text="sm primary-foreground"
      font="medium"
      transition="colors"
      shadow="sm"
      h="9"
      p="x-4 y-2"
      focus-visible="outline-none ring-1"
      bg="primary hover:primary/90"
      op="disabled:50"
      pointer-events="disabled:none"
      @click="handleClick"
    >
      Add to calendar
    </Button>

    <ToastRoot
      v-model:open="value"
      border="~"
      bg="background"
      text="foreground"
      pointer-events="auto"
      relative="~"
      flex="~"
      w="full"
      items="center"
      justify="between"
      space="x-4"
      overflow="hidden"
      rounded="md"
      p="6 r-8"
      shadow="lg"
      transition="all"
      translate="data-[swipe=cancel]:x-0 data-[swipe=move]:none"
      class="
      data-[state=open]:animate-in
      data-[state=closed]:animate-out
      data-[swipe=end]:animate-out
      data-[state=closed]:fade-out-80
      data-[state=closed]:slide-out-to-right-full
      data-[state=open]:slide-in-from-top-full
      data-[state=open]:sm:slide-in-from-bottom-full
      "
    >
      <div grid="~" gap="1">
        <ToastTitle
          text="sm dark dark:light"
          font="semibold"
        >
          Scheduled: Catch up
        </ToastTitle>
        <ToastDescription as-child>
          <time
            text="xs dark dark:light"
            op="90"
            :dateTime="eventDateRef.toISOString()"
          >
            {{ prettyDate(eventDateRef) }}
          </time>
        </ToastDescription>
      </div>
      <ToastAction
        text="dark dark:light sm group-[.destructive]:hover:destructive-foreground"
        inline="flex"
        h="8"
        shrink="0"
        items="center"
        justify="center"
        rounded="md"
        border="~ group-[.destructive]:muted/40 group-[.destructive]:hover:destructive/30"
        bg="transparent hover:secondary group-[.destructive]:hover:destructive"
        p="x-3"
        font="medium"
        ring-offset="background"
        transition="colors"
        focus="outline-none ring-2 ring-ring ring-offset-2"
        pointer-events="disabled:none"
        op="disabled:50"
        ring="group-[.destructive]:focus:destructive"
        alt-text="Goto schedule to undo"
      >
        Undo
      </ToastAction>
      <ToastClose
        absolute="~"
        right="2"
        top="2"
        rounded="md"
        p="1"
        text="foreground/50 hover:foreground group-[.destructive]:red-300 group-[.destructive]:hover:red-50"
        op="0 focus:100 group-hover:100"
        transition="opacity"
        focus="outline-none ring-2"
        ring="group-[.destructive]:focus:red-400"
        ring-offset="group-[.destructive]:focus:red-600"
      >
        <Icon name="carbon:close" w="4" h="4" />
      </ToastClose>
    </ToastRoot>
    <ToastViewport
      fixed="~"
      top="0"
      z="100"
      flex="~"
      max-h="screen"
      w="full"
      flex-col="reverse"
      p="4"
      sm="bottom-0 right-0 top-auto flex-col"
      md="max-w-420px"
    />
  </ToastProvider>
</template>
