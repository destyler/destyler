<script setup lang="ts">
import { ref } from 'vue'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from '../src'

const toggleState = ref(false)
</script>

<template>
  <TooltipProvider>
    <TooltipRoot v-model:open="toggleState">
      <TooltipTrigger>
        some info
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side-offset="5"
        >
          Add to library
          <TooltipArrow />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
