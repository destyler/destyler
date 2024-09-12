<script setup lang="ts">
import {
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from '@destyler/popover'
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger
      inline="block"
      cursor="pointer"
      rounded="~"
      bg="[rgb(13_148_136)]"
      p="x-4 y-2"
      text="[rgb(255_255_255)]"
    >
      More info
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        rounded="~"
        p="2"
        w="260px"
        bg="[rgb(13_148_136)]"
        text="[rgb(255_255_255)]"
        :side-offset="5"
      >
        Some more info...
        <PopoverClose />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
