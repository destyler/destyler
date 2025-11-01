<script setup lang="ts">
import { editControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as edit from '../../index'
import '../style.css'

const controls = useControls(editControls)

const [state, send] = useMachine(edit.machine({
  id: useId(),
  value: 'Hello World',
}), {
  context: controls.context,
})

const api = computed(() => edit.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <div v-bind="api.getRootProps()">
        <div v-bind="api.getAreaProps()">
          <input v-bind="api.getInputProps()">
          <span v-bind="api.getPreviewProps()" />
        </div>
        <div>
          <template v-if="api.editing">
            <button v-bind="api.getSubmitTriggerProps()">
              Save
            </button>
            <button v-bind="api.getCancelTriggerProps()">
              Cancel
            </button>
          </template>
          <button v-else v-bind="api.getEditTriggerProps()">
            Edit
          </button>
        </div>
      </div>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
