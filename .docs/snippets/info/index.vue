<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { InfoRoot } from '@destyler/info'
</script>

<template>
  <InfoRoot class="relative w-70% rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7 bg-background text-foreground">
    <Icon name="carbon:home" class="w-4 h-4" />
    <h5 class="mb-1 font-medium! leading-none tracking-tight mt-0! text-sm! text-foreground!">
      Go Home
    </h5>
    <div class="text-sm [&_p]:leading-relaxed">
      Gee it's good to be back home
    </div>
  </InfoRoot>
</template>
