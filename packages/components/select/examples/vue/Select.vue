<script setup lang="ts">
import { selectControls, selectData } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as select from '../../index'
import '../style.css'

const controls = useControls(selectControls)

const [state, send] = useMachine(
  select.machine({
    collection: select.collection({ items: selectData }),
    id: useId(),
  }),
  {
    context: controls.context,
  },
)

const api = computed(() => select.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <div v-bind="api.getRootProps()">
        <div v-bind="api.getControlProps()">
          <label v-bind="api.getLabelProps()">Label</label>
          <button v-bind="api.getTriggerProps()">
            <span>{{ api.valueAsString || "Select option" }}</span>
            <span v-bind="api.getIndicatorProps()">▼</span>
          </button>
        </div>
        <form>
          <select v-bind="api.getHiddenSelectProps()">
            <option v-for="option in selectData" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </form>
        <Teleport to="body">
          <div v-bind="api.getPositionerProps()">
            <ul v-bind="api.getContentProps()">
              <li v-for="item in selectData" :key="item.value" v-bind="api.getItemProps({ item })">
                <span v-bind="api.getItemTextProps({ item })">{{ item.label }}</span>
                <span v-bind="api.getItemIndicatorProps({ item })">✓</span>
              </li>
            </ul>
          </div>
        </Teleport>
      </div>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" :omit="['collection']" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
