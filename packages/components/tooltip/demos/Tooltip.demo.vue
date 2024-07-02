<script setup lang="ts">
import { ref } from 'vue'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from '../src'

const toggleState = ref(false)
</script>

<template>
  <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger>
        <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 border border-#E4E4E7 dark:border-#27272A bg-white dark:bg-#09090B shadow-sm hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#18181B dark:hover:text-#FAFAFA h-9 px-4 py-2">
          Hover
        </button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          as-child
          :side-offset="5"
          class="z-50 overflow-hidden rounded-md bg-#18181B dark:bg-#FAFAFA px-3 py-1.5 text-xs text-#FAFAFA dark:text-#18181B "
        >
          <p>
            Add to library
          </p>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
