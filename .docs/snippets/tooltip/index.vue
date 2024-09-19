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
        class="
        inline-flex items-center justify-center whitespace-nowrap
        rounded-md text-sm font-medium transition-colors
        shadow h-9 px-4 py-2
        focus-visible:outline-none focus-visible:ring-1
        disabled:pointer-events-none disabled:opacity-50
        bg-primary hover:bg-primary/90 text-primary-foreground
        "
      >
        Hover
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side-offset="5"
          class="z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          Add to library
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
