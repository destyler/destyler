<script setup lang="ts">
  import * as switchs from "@destyler/switch"
  import { normalizeProps, useMachine } from "@destyler/vue"
  import { computed,useId } from "vue"

  const [state, send] = useMachine(switchs.machine({ id: useId() }))

  const api = computed(() =>
    switchs.connect(state.value, send, normalizeProps),
  )
</script>

<template>
  <label
    v-bind="api.getRootProps()"
  >
    <input v-bind="api.getHiddenInputProps()" />
    <span
      v-bind="api.getControlProps()"
      class="
      peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center
      rounded-full border-2 border-transparent transition-colors
      focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-offset-2
      disabled:cursor-not-allowed disabled:opacity-50
      data-[state=checked]:bg-dark data-[state=unchecked]:bg-gray
      "
    >
      <span
        v-bind="api.getThumbProps()"
        class="
        pointer-events-none block h-5 w-5 rounded-full bg-green
        shadow-lg ring-0 transition-transform
        data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0
        "
      />
    </span>
    <span v-bind="api.getLabelProps()">
      <span v-if="api.checked">On</span>
      <span v-else>Off</span>
    </span>
  </label>
</template>
