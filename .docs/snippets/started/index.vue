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
      class="
      inline-block cursor-pointer
      rounded bg-[rgb(13_148_136)]
      px-4 py-2 text-[rgb(255_255_255)]
      "
    >
      More info
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        class="
          rounded p-2 w-260px z-33
          bg-[rgb(13_148_136)]
          text-[rgb(255_255_255)]
        "
        :side-offset="5"
      >
        Some more info...
        <PopoverClose />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
