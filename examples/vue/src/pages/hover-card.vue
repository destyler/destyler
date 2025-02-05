<script setup lang="ts">
import * as hoverCard from "@destyler/hover-card"
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed, useId } from "vue"

const [state, send] = useMachine(hoverCard.machine({ id: useId() }))

const api = computed(() => hoverCard.connect(state.value, send, normalizeProps))
</script>

<template>
  <a
    href="https://twitter.com/elonehoo"
    target="_blank"
    v-bind="api.getTriggerProps()"
  >
    Twitter
  </a>
  <div v-bind="api.getPositionerProps()">
    <div v-bind="api.getContentProps()" class="bg-dark text-white px-2 py-1">
      Twitter Preview
    </div>
  </div>
</template>
