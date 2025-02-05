<script setup lang="ts">
import * as separator from '@destyler/separator'
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed, useId } from "vue"

const [state, send] = useMachine(separator.machine({ id: useId() }))
const api = computed(() =>
  separator.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div
    v-bind="api.getRootProps()"
    class="
    bg-dark/50 my-4
    data-[orientation=horizontal]:h-px
    data-[orientation=horizontal]:w-100px
    data-[orientation=vertical]:h-100px
    data-[orientation=vertical]:w-px"
  >
  </div>
</template>
