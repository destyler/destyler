<script setup lang="ts">
import { dynamicControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as dynamic from '../../index'
import '../style.css'

const controls = useControls(dynamicControls)

function toDashCase(str: string) {
  return str.replace(/\s+/g, '-').toLowerCase()
}

const [state, send] = useMachine(
  dynamic.machine({
    id: useId(),
    value: ['React', 'Vue'],
  }),
  { context: controls.context },
)

const api = computed(() => dynamic.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <input data-testid="copy-text" style="margin-bottom: 1rem;">
      <div v-bind="api.getRootProps()">
        <div>
          <span
            v-for="(value, index) in api.value"
            :key="index"
            v-bind="api.getItemProps({ index, value })"
            style="position: relative;"
          >
            <div
              :data-testid="`${toDashCase(value)}-input`"
              v-bind="api.getItemPreviewProps({ index, value })"
            >
              <span>{{ value }}</span>
              <button
                v-bind="api.getItemDeleteTriggerProps({ index, value })"
                :data-testid="`${toDashCase(value)}-delete-trigger`"
              >
                &#x2715;
              </button>
            </div>
            <input
              v-bind="api.getItemInputProps({ index, value })"
              :data-testid="`${toDashCase(value)}-item-input`"
            >
          </span>
        </div>
        <input
          placeholder="Add tag..."
          v-bind="api.getInputProps()"
        >
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
