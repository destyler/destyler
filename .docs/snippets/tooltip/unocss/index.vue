<script setup lang="ts">
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@destyler/tooltip'
</script>

<template>
  <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger
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
        Hover
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side-offset="5"
          z="50"
          overflow="hidden"
          rounded="md"
          bg="primary"
          p="x-3 y-1.5"
          text="xs primary-foreground"
          class="
          animate-in
          fade-in-0
          zoom-in-95
          data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0
          data-[state=closed]:zoom-out-95
          data-[side=bottom]:slide-in-from-top-2
          data-[side=left]:slide-in-from-right-2
          data-[side=right]:slide-in-from-left-2
          data-[side=top]:slide-in-from-bottom-2
          "
        >
          Add to library
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
