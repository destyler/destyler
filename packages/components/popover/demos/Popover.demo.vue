<script setup lang="ts">
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from '../src'
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger
      aria-label="Update dimensions"
    >
      Open
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        :side-offset="5"
      >
        <div>
          <p>
            Dimensions
          </p>
        </div>
        <div>
          11
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
