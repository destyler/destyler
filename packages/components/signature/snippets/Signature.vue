<script setup lang="ts">
import * as signature from '@destyler/signature'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './style.css'

const [state, send] = useMachine(signature.machine({ id: useId() }))

const api = computed(() =>
  signature.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div class="space-y-2">
      <label v-bind="api.getLabelProps()">
        Signature
      </label>
      <p class="text-sm text-muted-foreground mt-0!">
        Draw your signature in the area below
      </p>
    </div>

    <div v-bind="api.getControlProps()">
      <svg v-bind="api.getSegmentProps()">
        <path
          v-for="(path, i) of api.paths"
          :key="i"
          v-bind="api.getSegmentPathProps({ path })"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          v-if="api.currentPath"
          v-bind="api.getSegmentPathProps({ path: api.currentPath })"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <button v-bind="api.getClearTriggerProps()">
        <span />
        <span>Clear signature</span>
      </button>
      <div v-bind="api.getGuideProps()">
        Sign above
      </div>
    </div>
    <div class="flex items-center justify-between mt-0!">
      <p class="text-xs text-muted-foreground mt-0!">
        {{ api.paths.length }} stroke{{ api.paths.length !== 1 ? 's' : '' }}
      </p>
    </div>
  </div>
</template>
