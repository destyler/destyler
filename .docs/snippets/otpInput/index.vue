<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import {
  OtpInput,
  OtpInputRoot,
} from '@destyler/otp-input'

const value = ref<string[]>([])
</script>

<template>
  <OtpInputRoot
    v-model="value"
    class="flex items-center gap-2 has-[:disabled]:opacity-50"
  >
    <div class="flex items-center">
      <OtpInput
        v-for="(id, index) in 3"
        :key="id"
        :index="index"
        class="
        bg-#F8F8F8 dark:bg-#1C1C1C text-dark dark:text-light
        relative text-center focus:outline-none focus:ring-2 focus:ring-ring
        focus:relative focus:z-10 flex h-10 w-10 items-center justify-center
        border-y border-r border-input text-sm transition-all
        first:rounded-l-md first:border-l last:rounded-r-md"
      />
    </div>
    <div role="separator">
      <Icon name="carbon:dot-mark" class="text-primary" />
    </div>
    <div class="flex items-center">
      <OtpInput
        v-for="(id, index) in 3"
        :key="id"
        :index="index + 3"
        class="
        bg-#F8F8F8 dark:bg-#1C1C1C text-dark dark:text-light
        relative text-center focus:outline-none focus:ring-2 focus:ring-ring
        focus:relative focus:z-10 flex h-10 w-10 items-center justify-center
        border-y border-r border-input text-sm transition-all
        first:rounded-l-md first:border-l last:rounded-r-md"
      />
    </div>
  </OtpInputRoot>
</template>
