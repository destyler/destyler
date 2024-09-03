<script setup lang="ts">
import { Icon } from '@destyler/icon'
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
} from '@destyler/modal'
</script>

<template>
  <ModalRoot>
    <ModalTrigger
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
    >
      Open Modal
    </ModalTrigger>
    <ModalPortal>
      <ModalOverlay
        fixed="~"
        inset="0"
        z="50"
        bg="black/80"
        class="
        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0
        data-[state=open]:fade-in-0
        "
      />
      <ModalContent
        fixed="~"
        left="50%"
        top="50%"
        z="50"
        grid="~"
        w="full"
        max-w="lg"
        translate-x="-50%"
        translate-y="-50%"
        gap="4"
        border="~"
        bg="background"
        p="6"
        rounded="lg sm:lg"
        duration="200"

        class="
        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0
        data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95
        data-[state=open]:zoom-in-95
        data-[state=closed]:slide-out-to-left-1/2
        data-[state=closed]:slide-out-to-top-48%
        data-[state=open]:slide-in-from-left-1/2
        data-[state=open]:slide-in-from-top-48%
      "
      >
        <div class="flex flex-col space-y-2 text-center sm:text-left">
          <ModalTitle class="text-lg font-semibold flex items-center">
            <Icon name="carbon:warning" class="w-4 h-4" />
            <span class="ml-1">Are you absolutely sure?</span>
          </ModalTitle>
          <ModalDescription class="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </ModalDescription>
        </div>
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <ModalCancel class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-2 sm:mt-0">
            Cancel
          </ModalCancel>
          <ModalAction class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Continue
          </ModalAction>
        </div>
      </ModalContent>
    </ModalPortal>
  </ModalRoot>
</template>
