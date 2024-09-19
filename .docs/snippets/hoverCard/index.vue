<script setup lang="ts">
import {
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
} from '@destyler/hover-card'
import { Icon } from '@destyler/icon'
import { Image, ImageFallback, ImageRoot } from '@destyler/image'
</script>

<template>
  <HoverCardRoot>
    <HoverCardTrigger
      as="button"
      class="
      inline-flex items-center justify-center
      whitespace-nowrap rounded-md text-sm font-medium
      ring-offset-background transition-colors
      focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-ring focus-visible:ring-offset-2
      disabled:pointer-events-none disabled:opacity-50
      text-primary underline-offset-4 hover:underline
      h-10 px-4 py-2
      "
    >
      destyler ui
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        class="
        z-50 w-80 rounded-md border bg-popover
        p-4 text-popover-foreground shadow-md
        outline-none data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0
        data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95
        data-[state=open]:zoom-in-95
        data-[side=bottom]:slide-in-from-top-2
        data-[side=left]:slide-in-from-right-2
        data-[side=right]:slide-in-from-left-2
        data-[side=top]:slide-in-from-bottom-2
        "
      >
        <div class="flex justify-between space-x-4">
          <ImageRoot class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <Image
              class="aspect-square h-full w-full"
              src="https://github.com/destyler.png"
            />
            <ImageFallback class="flex h-full w-full items-center justify-center rounded-full bg-muted">
              D
            </ImageFallback>
          </ImageRoot>
          <div class="space-y-1">
            <h4 class="text-sm font-semibold">
              @destyler
            </h4>
            <p class="text-sm">
              The Vue UI Framework – created and Build UI by @destyler.
            </p>
            <div class="flex items-center pt-2">
              <Icon name="lucide-calendar-days" class="mr-2 h-4 w-4 opacity-70" />
              <span class="text-xs text-muted-foreground">
                Joined June 2023
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
