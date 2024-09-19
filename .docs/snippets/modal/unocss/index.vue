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
        <div
          flex="~ col"
          space="y-2"
          text="center sm:left"
        >
          <ModalTitle
            text="lg"
            font="semibold"
            flex="~"
            items="center"
          >
            <Icon
              name="carbon:warning"
              w="4"
              h="4"
            />
            <span m="l-1">Are you absolutely sure?</span>
          </ModalTitle>
          <ModalDescription
            text="sm muted-foreground"
          >
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </ModalDescription>
        </div>
        <div
          class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"
          flex="~ col-reverse sm:row"
          justify="sm:end"
          space="sm:y-2"
        >
          <ModalCancel
            inline="flex"
            items="center"
            justify="center"
            whitespace="nowrap"
            rounded="md"
            text="sm hover:accent-foreground"
            font="medium"
            ring-offset="background"
            transition="colors"
            focus-visible="outline-none ring-2 ring-ring ring-offset-2"
            pointer-events="disabled:none"
            op="disabled:50"
            border="~ input"
            bg="background hover:accent"
            h="10"
            p="x-4 y-2"
            m="t-2 sm:t-0"
          >
            Cancel
          </ModalCancel>
          <ModalAction
            inline="flex"
            items="center"
            justify="center"
            whitespace="nowrap"
            rounded="md"
            text="sm primary-foreground"
            font="medium"
            ring-offset="background"
            transition="colors"
            focus-visible="outline-none ring-2 ring-ring ring-offset-2"
            pointer-events="disabled:none"
            op="disabled:50"
            bg="primary hover:primary/90"
            h="10"
            p="x-4 y-2"
          >
            Continue
          </ModalAction>
        </div>
      </ModalContent>
    </ModalPortal>
  </ModalRoot>
</template>
