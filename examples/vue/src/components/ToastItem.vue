<script setup lang="ts">
import * as toast from '@destyler/toast'
import { normalizeProps, useActor } from '@destyler/vue'
import { computed } from 'vue'

const props = defineProps<{
  actor: toast.Service
}>()

const [state, send] = useActor(props.actor)

const api = computed(() => toast.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getGhostBeforeProps()" />
    <p v-bind="api.getTitleProps()">
      {{ api.title }}
    </p>
    <p v-bind="api.getDescriptionProps()">
      {{ api.description }}
    </p>
    <button v-bind="api.getCloseTriggerProps()">
      <div class="i-carbon-close"></div>
    </button>
    <div v-bind="api.getGhostAfterProps()" />
  </div>
</template>
