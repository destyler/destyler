<script setup lang="ts">
import { Icon } from 'destyler'
</script>

<template>
  <button @click="toggleTheme()">
    <div class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-#a1a1a9 dark:focus-visible:ring-#d4d4d8 disabled:pointer-events-none disabled:opacity-50 hover:bg-#f4f4f5 dark:hover:bg-#27272a h-9 py-2 w-9 px-0">
      <Icon v-if="!isDark()" name="i-ri-sun-line" class="w-6 h-6" />
      <Icon v-else name="i-ri-moon-clear-line" class="w-6 h-6" />
    </div>
  </button>
</template>
