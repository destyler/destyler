<script setup lang="ts">
import * as switchs from "@destyler/switch"
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed,useId } from "vue"
import { switchControls } from '@destyler/shared'
import { useControls } from '../composables/useControls'

const controls = useControls(switchControls)

  const [state, send] = useMachine(switchs.machine({ id: useId() }),{
    context: controls.context,
  })

  const api = computed(() =>
    switchs.connect(state.value, send, normalizeProps),
  )
</script>

<template>
  <label
    v-bind="api.getRootProps()"
    class="inline-flex items-center space-x-3 cursor-pointer"
  >
    <input v-bind="api.getHiddenInputProps()" />
    <span
      v-bind="api.getControlProps()"
      class="
        peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center
        rounded-full border-2 border-gray-200 transition-colors duration-200 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        hover:border-gray-300
        data-[state=checked]:bg-black data-[state=checked]:border-black
        data-[state=unchecked]:bg-gray-100
      "
    >
      <span
        v-bind="api.getThumbProps()"
        class="
          pointer-events-none block h-4 w-4 rounded-full bg-white
          shadow-lg ring-0 transition-transform duration-200 ease-in-out
          data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0
        "
      />
    </span>
    <span
      v-bind="api.getLabelProps()"
      class="text-sm font-medium text-gray-700"
    >
      <span v-if="api.checked">open</span>
      <span v-else>close</span>
    </span>
  </label>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
