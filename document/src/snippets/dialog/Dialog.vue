<script setup lang="ts">
import * as dialog from '@destyler/dialog'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '../../styles/components/dialog.css'

const [state, send] = useMachine(dialog.machine({
  id: useId(),
}))
const api = computed(() => dialog.connect(state.value, send, normalizeProps))
</script>

<template>
  <button v-bind="api.getTriggerProps()">
    Open Dialog
  </button>
  <Teleport v-if="api.open" to="body">
    <div data-layout="sinppets">
      <div v-bind="api.getBackdropProps()" />
      <div v-bind="api.getPositionerProps()">
        <div v-bind="api.getContentProps()">
          <h2 v-bind="api.getTitleProps()">
            Edit profile
          </h2>
          <p v-bind="api.getDescriptionProps()">
            Make changes to your profile here. Click save when you are done.
          </p>
          <button v-bind="api.getCloseTriggerProps()">
            <div />
          </button>
          <input placeholder="Enter name...">
          <button>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
