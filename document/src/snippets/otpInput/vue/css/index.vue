<script setup lang="ts">
import * as otpInput from '@destyler/otp-input'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './index.css'

const [state, send] = useMachine(otpInput.machine({
  id: useId(),
  otp: true,
  placeholder: '',
}))

const api = computed(() => otpInput.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="otp-container">
    <div class="otp-inner-container">
      <div class="otp-input-group">
        <div
          v-bind="api.getRootProps()"
          class="otp-root"
        >
          <input
            v-for="index in 6"
            :key="index"
            v-bind="api.getInputProps({ index: index - 1 })"
            class="otp-input"
          >
        </div>
      </div>

      <div class="otp-button-container">
        <button
          class="otp-clear-button"
          @click="api.clearValue"
        >
          <span>clear</span>
        </button>
      </div>
    </div>
  </div>
</template>
