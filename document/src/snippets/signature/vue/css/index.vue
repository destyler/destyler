<script setup lang="ts">
  import * as signature from "@destyler/signature"
  import { useMachine, normalizeProps } from "@destyler/vue"
  import { computed, useId } from "vue"

  const [state, send] = useMachine(signature.machine({ id: useId() }))

  const api = computed(() =>
    signature.connect(state.value, send, normalizeProps),
  )
</script>

<template>
  <div v-bind="api.getRootProps()" class="signature-container">
    <div class="signature-header">
      <label 
        v-bind="api.getLabelProps()" 
        class="signature-label"
      >
        Signature
      </label>
      <p class="signature-description">
        Draw your signature in the area below
      </p>
    </div>

    <div
      v-bind="api.getControlProps()"
      class="signature-control"
    >
      <svg 
        v-bind="api.getSegmentProps()" 
        class="signature-canvas"
      >
        <path
          v-for="(path, i) of api.paths"
          :key="i"
          v-bind="api.getSegmentPathProps({ path })"
          class="signature-path"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          v-if="api.currentPath"
          v-bind="api.getSegmentPathProps({ path: api.currentPath })"
          class="signature-path"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <button
        v-bind="api.getClearTriggerProps()"
        class="signature-clear-button"
      >
        <span class="signature-clear-icon i-lucide:x"></span>
        <span class="signature-sr-only">Clear signature</span>
      </button>
      <div
        v-bind="api.getGuideProps()"
        class="signature-guide"
      >
        Sign above
      </div>
    </div>
    <div class="signature-footer">
      <p class="signature-counter">
        {{ api.paths.length }} stroke{{ api.paths.length !== 1 ? 's' : '' }}
      </p>
      <div class="signature-actions">
        <button
          v-bind="api.getClearTriggerProps()"
          class="signature-clear-action"
        >
          <span class="signature-eraser-icon i-lucide:eraser"></span>
          Clear
        </button>
      </div>
    </div>
  </div>
</template>
