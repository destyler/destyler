<script setup lang="ts">
import * as otpInput from '@destyler/otp-input'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '../../styles/components/otp-input.css'

const [state, send] = useMachine(otpInput.machine({
  id: useId(),
  otp: true,
  placeholder: '',
}))

const api = computed(() => otpInput.connect(state.value, send, normalizeProps))
</script>

<template>
  <div
    class="flex flex-col items-center justify-center w-full"
  >
    <div class="w-full max-w-sm space-y-6">
      <div class="flex items-center has-[:disabled]:opacity-50">
        <div v-bind="api.getRootProps()">
          <input
            v-for="index in 5"
            :key="index"
            v-bind="api.getInputProps({ index: index - 1 })"
          >
        </div>
      </div>

      <div class="flex justify-start">
        <button
          class="focus:outline-none disabled:cursor-not-allowed
          disabled:opacity-75 flex-shrink-0 font-medium rounded-md
          text-sm gap-x-2.5 px-3.5 py-2.5 shadow-sm
          text-primary-foreground! bg-primary!
          hover:bg-primary/90! focus-visible:outline
          focus-visible:outline-offset-2 focus-visible:outline-light-500
          dark:focus-visible:outline-light-400 inline-flex items-center"
          @click="api.clearValue"
        >
          <span>clear</span>
        </button>
      </div>
    </div>
  </div>
</template>
