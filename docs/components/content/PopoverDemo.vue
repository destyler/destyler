<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'destyler'

const openStatus = ref(false)
</script>

<template>
  <PopoverRoot v-model:open="openStatus">
    <PopoverTrigger
      aria-label="Update dimensions"
    >
      <Button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 border border-#E4E4E7 dark:border-#27272A bg-white dark:bg-#09090B shadow-sm hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#18181B dark:hover:text-#FAFAFA h-9 px-4 py-2">
        Click
      </Button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        :side-offset="5"
      >
        <div class="flex flex-col gap-2.5 z-50 rounded-md border dark:border-#09090B dark:bg-#09090B p-4 dark:text-#FAFAFA shadow-md outline-none w-80">
          <div class="space-y-2">
            <h4 class="font-medium leading-none">
              Dimensions
            </h4>
            <p class="text-sm text-#A1A1AA">
              Set the dimensions for the layer.
            </p>
          </div>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
