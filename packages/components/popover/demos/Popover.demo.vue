<script setup lang="ts">
import { ref } from 'vue'
import {
  DestylerPopoverArrow,
  DestylerPopoverClose,
  DestylerPopoverContent,
  DestylerPopoverPortal,
  DestylerPopoverRoot,
  DestylerPopoverTrigger,
} from '../src'
</script>

<template>
  <DestylerPopoverRoot>
    <DestylerPopoverTrigger
      aria-label="Update dimensions"
    >
      Open
    </DestylerPopoverTrigger>
    <DestylerPopoverPortal>
      <DestylerPopoverContent
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
      </DestylerPopoverContent>
    </DestylerPopoverPortal>
  </DestylerPopoverRoot>
</template>
