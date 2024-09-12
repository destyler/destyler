<script setup lang="ts">
import {
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from '@destyler/popover'
import './style.css'
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger class="popover-trigger">
      More info
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        class="popover-content"
        :side-offset="5"
      >
        Some more info...
        <PopoverClose />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
