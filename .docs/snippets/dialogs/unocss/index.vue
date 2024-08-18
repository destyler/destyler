// @noErrors
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
      inline="flex"
      items="center"
      justify="center"
      whitespace="normal"
      rounded="md"
      text="sm primary-foreground"
      font="medium"
      transition="colors"
      shadow="~"
      h="9"
      p="x-4 y-2"
      outline="focus-visible:none"
      ring="focus-visible:1"
      pointer-events="disabled:none"
      opacity="disabled:50"
      bg="primary hover:primary/90"
    >
      Open Dialog
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        fixed="~"
        inset="0"
        z="50"
        bg="white/50 dark:bg-black/50"
      />
      <DialogContent
        class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-50% data-[state=closed]:slide-out-to-top-48% data-[state=open]:slide-in-from-left-50% data-[state=open]:slide-in-from-top-48%"
        fixed="~"
        left="1/2"
        top="1/2"
        z="50"
        grid="~"
        w="full"
        max-w="lg"
        translate="x--50% y--50%"
        gap="4"
        border="~ border"
        p="6"
        rounded="sm:lg"
        bg="white dark:black"
        shadow="lg"
        duration="200"
      >
        <div
          flex="~ col"
          space="y-1.5"
          text="center sm:left"
        >
          <DialogTitle
            text="primary lg"
            font="semibold"
            leading="none"
            tracking="tight"
          >
            Dialog
          </DialogTitle>
          <DialogDescription
            text="sm muted-foreground"
          >
            Are you sure?
          </DialogDescription>
        </div>
        <DialogClose
          class="focus:ring-0 focus:ring-offset-0 disabled:pointer-events-none"
          absolute="~"
          right="4"
          top="4"
          rounded="sm"
          transition="opacity"
          outline="focus:outline-none"
          ring="focus:0 focus:offset-0"
          pointer-events="disabled:none"
        >
          <Icon
            name="i-ri-close-line"
            w="4"
            h="4"
            text="popover-foreground op-40 hover:op-100"
            cursor="pointer"
          />
        </DialogClose>
        <div w="full" flex="~" justify="end">
          <DialogClose
            inline="flex"
            items="center"
            justify="center"
            whitespace="normal"
            rounded="md"
            text="sm primary-foreground"
            font="medium"
            transition="colors"
            shadow="~"
            h="9"
            p="x-4 y-2"
            outline="focus-visible:none"
            ring="focus-visible:1"
            pointer-events="disabled:none"
            opacity="disabled:50"
            bg="primary hover:primary/90"
          >
            Sure
          </DialogClose>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
