<script setup lang="ts">
import { DestylerImage, DestylerImageFallback, DestylerImageRoot } from 'destyler'
</script>

<template>
  <div>
    <DestylerImageRoot class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
      <DestylerImage class="aspect-square h-full w-full" src="https://elonehoo.me/avatar.png" />
      <DestylerImageFallback class="flex h-full w-full items-center justify-center rounded-full bg-#F4F4F5 dark:bg-#27272A">
        EH
      </DestylerImageFallback>
    </DestylerImageRoot>
  </div>
</template>
