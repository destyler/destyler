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
  <div v-bind="api.getRootProps()" class="w-full min-w-md space-y-4">
    <div class="space-y-2">
      <label 
        v-bind="api.getLabelProps()" 
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primary"
      >
        Signature
      </label>
      <p class="text-sm text-muted-foreground mt-0!">
        Draw your signature in the area below
      </p>
    </div>

    <div
      v-bind="api.getControlProps()"
      class="relative w-full h-48 rounded-md border border-input bg-background p-3 shadow-sm focus-within:ring-1 focus-within:ring-ring"
    >
      <svg 
        v-bind="api.getSegmentProps()" 
        class="h-full w-full rounded-sm"
      >
        <path
          v-for="(path, i) of api.paths"
          :key="i"
          v-bind="api.getSegmentPathProps({ path })"
          class="stroke-foreground"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          v-if="api.currentPath"
          v-bind="api.getSegmentPathProps({ path: api.currentPath })"
          class="stroke-foreground"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <button
        v-bind="api.getClearTriggerProps()"
        class="absolute right-2 top-2 mt-0! inline-flex h-8 w-8 items-center justify-center rounded-sm border border-input bg-background text-sm shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        <span class="h-4 w-4 i-lucide:x text-muted-foreground"></span>
        <span class="sr-only">Clear signature</span>
      </button>
      <div
        v-bind="api.getGuideProps()"
        class="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground mt-0!"
      >
        Sign above
      </div>
    </div>
    <div class="flex items-center justify-between mt-0!">
      <p class="text-xs text-muted-foreground mt-0!">
        {{ api.paths.length }} stroke{{ api.paths.length !== 1 ? 's' : '' }}
      </p>
      <div class="flex items-center gap-2 mt-0!">
        <button
          v-bind="api.getClearTriggerProps()"
          class="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-muted-foreground"
        >
          <span class="mr-1 h-3 w-3 i-lucide:eraser"></span>
          Clear
        </button>
      </div>
    </div>
  </div>
</template>
