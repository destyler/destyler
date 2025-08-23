<script setup lang="ts">
import * as otpInput from '@destyler/otp-input'
import { pinInputControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/otp-input.css'

const controls = useControls(pinInputControls)

const [state, send] = useMachine(otpInput.machine({ id: useId() }), {
  context: controls.context,
})
const api = computed(() => otpInput.connect(state.value, send, normalizeProps))
</script>

<template>
  <input data-testid="copy-text">
  <div class="otp-input-box">
    <div class="otp-input-content-box">
      <div>
        <h2>
          Verification Code
        </h2>
        <p>
          Please enter the 3-digit code you received
        </p>
      </div>

      <div
        v-bind="api.getRootProps()"
        class="otp-input-root"
      >
        <input
          v-for="index in 3"
          :key="index"
          :data-testid="`input-${index}`"
          v-bind="api.getInputProps({ index: index - 1 })"
          class="otp-input-item-input"
        >
      </div>

      <div>
        <button
          data-testid="clear"
          @click="api.clearValue()"
        >
          Clear
        </button>
        <button
          data-testid="focus"
          @click="api.focus()"
        >
          Focus
        </button>
      </div>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
