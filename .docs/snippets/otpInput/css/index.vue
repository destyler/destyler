<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import {
  OtpInput,
  OtpInputRoot,
} from '@destyler/otp-input'
import './style.css'

const value = ref<string[]>([])
</script>

<template>
  <OtpInputRoot
    v-model="value"
    class="otp-input-root"
  >
    <div class="flex items-center">
      <OtpInput
        v-for="(id, index) in 3"
        :key="id"
        :index="index"
        class="otp-input"
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
        class="otp-input"
      />
    </div>
  </OtpInputRoot>
</template>
