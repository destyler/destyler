<script setup lang="ts">
import { Image, ImageFallback, ImageRoot } from 'destyler'
</script>

<template>
  <div>
    <ImageRoot class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
      <Image class="aspect-square h-full w-full" src="https://elonehoo.me/avatar.png" />
      <ImageFallback class="flex h-full w-full items-center justify-center rounded-full bg-#F4F4F5 dark:bg-#27272A">
        EH
      </ImageFallback>
    </ImageRoot>
  </div>
</template>
