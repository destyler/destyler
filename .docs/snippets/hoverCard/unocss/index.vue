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
      inline="flex"
      items="center"
      justify="center"
      whitespace="nowrap"
      rounded="md"
      text="sm primary"
      font="medium"
      ring="offset-background"
      transition="colors"
      focus-visible="outline-none ring-2 ring-ring ring-offset-2 pointer-events-none op-50"
      underline="offset-4 hover:~"
      h="10"
      p="x4 y2"
    >
      destyler ui
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        z="50"
        w="80"
        rounded="md"
        border="~"
        bg="popover"
        p="4"
        text="popover-foreground"
        shadow="md"
        outline="none"
        class="
        data-[state=open]:animate-in
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
        <div
          flex="~"
          justify="between"
          space-x="4"
        >
          <ImageRoot
            relative="~"
            flex="~"
            h="10"
            w="10"
            shrink="0"
            overflow="hidden"
            rounded="full"
          >
            <Image
              aspect="square"
              h="full"
              w="full"
              src="https://github.com/destyler.png"
            />
            <ImageFallback
              flex="~"
              h="full"
              w="full"
              items="center"
              justify="center"
              rounded="full"
              bg="muted"
            >
              D
            </ImageFallback>
          </ImageRoot>
          <div
            space="y-1"
          >
            <h4
              text="sm"
              font="semibold"
            >
              @destyler
            </h4>
            <p text="sm">
              The Vue UI Framework – created and Build UI by @destyler.
            </p>
            <div
              flex="~"
              items="center"
              p="t-2"
            >
              <Icon
                name="lucide-calendar-days"
                m="r-2"
                h="4"
                w="4"
                op="70"
              />
              <span
                text="xs muted-foreground"
              >
                Joined June 2023
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
