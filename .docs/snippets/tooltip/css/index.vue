<script setup lang="ts">
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@destyler/tooltip'
import './style.css'
</script>

<template>
  <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger
        class="button"
      >
        Hover
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side-offset="5"
          class="content"
        >
          Add to library
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
