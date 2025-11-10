<script setup lang="ts">
import { comboboxControls, listData } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'
import * as combobox from '../../index'
import '../style.css'

const controls = useControls(comboboxControls)

const options = ref(listData)
const collectionRef = computed(() =>
  combobox.collection({
    items: options.value,
    itemToValue: item => item.code,
    itemToString: item => item.label,
  }),
)

const [state, send] = useMachine(
  combobox.machine({
    id: useId(),
    collection: collectionRef.value,
    onOpenChange() {
      options.value = listData
    },
    onInputValueChange({ inputValue }) {
      const filtered = listData.filter(item =>
        item.label.toLowerCase().includes(inputValue.toLowerCase()),
      )
      options.value = filtered.length > 0 ? filtered : listData
    },
  }),
  {
    context: computed(() => ({
      ...controls.context.value,
      collection: collectionRef.value,
    })),
  },
)

const api = computed(() => combobox.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main class="combobox">
      <div>
        <button @click="() => api.setValue(['TG'])">
          Set to Togo
        </button>
        <button data-testid="clear-value-button" @click="() => api.clearValue()">
          Clear Value
        </button>
        <button v-bind="api.getClearTriggerProps()">
          Clear Trigger
        </button>
        <br>

        <div v-bind="api.getRootProps()">
          <label v-bind="api.getLabelProps()">Select country</label>

          <div v-bind="api.getControlProps()">
            <input data-testid="input" v-bind="api.getInputProps()">
            <button data-testid="trigger" v-bind="api.getTriggerProps()">
              ▼
            </button>
            <button v-bind="api.getClearTriggerProps()">
              x
            </button>
          </div>
        </div>

        <div v-bind="api.getPositionerProps()">
          <ul v-if="options.length > 0" data-testid="combobox-content" v-bind="api.getContentProps()">
            <li v-for="item in options" :key="item.code" v-bind="api.getItemProps({ item })">
              {{ item.label }}
            </li>
          </ul>
        </div>
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
