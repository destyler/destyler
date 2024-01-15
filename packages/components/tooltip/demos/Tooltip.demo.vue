<script setup lang="ts">
import { ref } from 'vue'
import { DestylerTooltipArrow, DestylerTooltipContent, DestylerTooltipPortal, DestylerTooltipProvider, DestylerTooltipRoot, DestylerTooltipTrigger } from '../src'

const toggleState = ref(false)
</script>

<template>
  <DestylerTooltipProvider>
    <DestylerTooltipRoot v-model:open="toggleState">
      <DestylerTooltipTrigger>
        some info
      </DestylerTooltipTrigger>
      <DestylerTooltipPortal>
        <DestylerTooltipContent
          :side-offset="5"
        >
          Add to library
          <DestylerTooltipArrow class="fill-white" />
        </DestylerTooltipContent>
      </DestylerTooltipPortal>
    </DestylerTooltipRoot>
  </DestylerTooltipProvider>
</template>
