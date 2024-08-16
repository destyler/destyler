<script setup lang="ts">
// @noErrors
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
      class="button"
    >
      Open Dialog
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        class="
        dialogOverlay
        "
      />
      <DialogContent
        class="
        dialogContent
        "
      >
        <div class="box">
          <DialogTitle class="dialogTitle">
            Dialog
          </DialogTitle>
          <DialogDescription class="dialogDescription">
            Are you sure?
          </DialogDescription>
        </div>
        <DialogClose class="dialogClose">
          <Icon name="i-ri-close-line" class="icon" />
        </DialogClose>
        <div class="action">
          <DialogClose
            class="button"
          >
            Sure
          </DialogClose>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
