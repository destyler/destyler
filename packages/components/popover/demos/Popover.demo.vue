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

const status = ref(false)
</script>

<template>
  {{ status }}
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
        <DestylerPopoverClose
          aria-label="Close"
        >
          Close
        </DestylerPopoverClose>
        <DestylerPopoverArrow />
      </DestylerPopoverContent>
    </DestylerPopoverPortal>
  </DestylerPopoverRoot>
</template>
