<script setup lang="ts">
import { InfoRoot } from 'destyler'
</script>

<template>
  <InfoRoot
    as="span"
    class="hover:no-underline! no-underline! text-xs px-1.5 py-0.5 inline-flex items-center font-medium rounded-md text-xs px-2 py-1 bg-green-50 dark:bg-green-400 dark:bg-opacity-10 text-green-500 dark:text-green-400 ring-1 ring-inset ring-green-500 dark:ring-green-400 ring-opacity-10 dark:ring-opacity-20"
  >
    <slot />
  </InfoRoot>
</template>
