<script setup lang="ts">
import * as collapsible from '@destyler/collapsible'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './style.css'

const [state, send] = useMachine(collapsible.machine({ id: useId() }))

const api = computed(() =>
  collapsible.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div>
      <h4>@elonehoo starred 3 repositories</h4>
      <button v-bind="api.getTriggerProps()">
        <div />
      </button>
    </div>

    <div>@destyler/collapsible</div>

    <div v-bind="api.getContentProps()">
      <div>@destyler/vue</div>
      <div>vue</div>
    </div>
  </div>
</template>
