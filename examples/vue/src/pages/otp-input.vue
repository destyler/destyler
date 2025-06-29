<script setup lang="ts">
import * as otpInput from '@destyler/otp-input'
import { pinInputControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const controls = useControls(pinInputControls)

const [state, send] = useMachine(otpInput.machine({ id: useId() }), {
  context: controls.context,
})
const api = computed(() => otpInput.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="flex flex-col p-4">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-black dark:text-white">
          Verification Code
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Please enter the 3-digit code you received
        </p>
      </div>

      <div
        v-bind="api.getRootProps()"
        class="flex justify-center gap-4 mt-8"
      >
        <input
          v-for="index in 3"
          :key="index"
          v-bind="api.getInputProps({ index: index - 1 })"
          class="w-16 h-16 text-center text-2xl font-semibold bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
        >
      </div>

      <div class="text-center mt-6">
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
          @click="api.clearValue"
        >
          Clear
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
