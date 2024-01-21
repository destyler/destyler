<script setup lang="ts">
import { DestylerIcon, DestylerInfoRoot } from 'destyler'
</script>

<template>
  <div class="p-10 w-full">
    <DestylerInfoRoot class="relative w-full rounded-lg border border-#E4E4E7 dark:border-#27272A px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-#09090B dark:[&>svg]:text-#FAFAFA [&>svg~*]:pl-7 bg-white dark:bg-#09090B text-#09090B dark:text-#FAFAFA">
      <DestylerIcon name="i-carbon-home" class="w-4 h-4" />
      <h5 class="mb-1 font-medium leading-none tracking-tight">
        Go Home
      </h5>
      <div class="text-sm [&_p]:leading-relaxed">
        Gee it's good to be back home
      </div>
    </DestylerInfoRoot>
  </div>
</template>
