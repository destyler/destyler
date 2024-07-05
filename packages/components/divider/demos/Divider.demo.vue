<script setup lang="ts">
import { Divider } from '../src'
</script>

<template>
  <div class="w-full max-w-[300px] mx-[15px]">
    <div class=" text-[15px] leading-5 font-semibold">
      destyler
    </div>
    <div class="text-#71717A dark:text-#A1A1AA text-[15px] leading-5">
      unstyled component for vue.
    </div>
    <Divider
      class="shrink-0 bg-#E4E4E7 dark:bg-#27272A data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]"
    />
    <div class="flex h-5 items-center">
      <div class=" text-[15px] leading-5">
        Docs
      </div>
      <Divider
        class="shrink-0 bg-#E4E4E7 dark:bg-#27272A  data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-[15px]"
        decorative
        orientation="vertical"
      />
      <div class=" text-[15px] leading-5">
        Playground
      </div>
      <Divider
        class="shrink-0 bg-#E4E4E7 dark:bg-#27272A  data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-[15px]"
        decorative
        orientation="vertical"
      />
      <div class=" text-[15px] leading-5">
        Source
      </div>
    </div>
  </div>
</template>
