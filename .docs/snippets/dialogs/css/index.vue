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
          <Icon name="ri:close-line" class="icon" />
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
