<script setup lang="ts">
  import * as collapsible from "@destyler/collapsible"
  import { normalizeProps, useMachine } from "@destyler/vue"
  import { computed,useId } from "vue"

  const [state, send] = useMachine(collapsible.machine({ id: useId() }))

  const api = computed(() =>
    collapsible.connect(state.value, send, normalizeProps),
  )
</script>

<template>
  <div v-bind="api.getRootProps()">
    <button v-bind="api.getTriggerProps()">Collapse Trigger</button>
    <div v-bind="api.getContentProps()">
      adadasdadasdðadadasdadasdðadadasdadasdðadadasdadasdðadadasdadasdð
      adadasdadasdðadadasdadasdðadadasdadasdðadadasdadasdðadadasdadasdð
      adadasdadasdðadadasdadasdðadadasdadasdðadadasdadasdðadadasdadasdð
      adadasdadasdðadadasdadasdðadadasdadasdðadadasdadasdðadadasdadasdð
      adadasdadasdðadadasdadasdðadadasdadasdðadadasdadasdðadadasdadasdð
      adadasdadasdðadadasdadasdðadadasdadasdðadadasdadasdðadadasdadasdð
    </div>
  </div>
</template>
