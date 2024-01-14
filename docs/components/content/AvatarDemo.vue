<script setup lang="ts">
import { DestylerAvatarFallback, DestylerAvatarImage, DestylerAvatarRoot } from 'destyler'
</script>

<template>
  <div>
    <DestylerAvatarRoot class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
      <DestylerAvatarImage class="aspect-square h-full w-full" src="https://elonehoo.me/avatar.png" />
      <DestylerAvatarFallback class="flex h-full w-full items-center justify-center rounded-full bg-#F4F4F5 dark:bg-#27272A">
        EH
      </DestylerAvatarFallback>
    </DestylerAvatarRoot>
  </div>
</template>
