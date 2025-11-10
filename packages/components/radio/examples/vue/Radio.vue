<script setup lang="ts">
import { radioControls, radioData } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as radio from '../../index'
import '../style.css'

const controls = useControls(radioControls)

const [state, send] = useMachine(radio.machine({
  id: useId(),
  name: 'fruit',
}), {
  context: controls.context,
})

const api = computed(() => radio.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <fieldset>
        <div v-bind="api.getRootProps()">
          <h3 v-bind="api.getLabelProps()">
            Fruits
          </h3>
          <div v-bind="api.getIndicatorProps()" />

          <label
            v-for="opt in radioData"
            :key="opt.id"
            :data-testid="`radio-${opt.id}`"
            v-bind="api.getItemProps({ value: opt.id })"
          >
            <div :data-testid="`control-${opt.id}`" v-bind="api.getItemControlProps({ value: opt.id })" />
            <span :data-testid="`label-${opt.id}`" v-bind="api.getItemTextProps({ value: opt.id })">
              {{ opt.label }}
            </span>
            <input :data-testid="`input-${opt.id}`" v-bind="api.getItemHiddenInputProps({ value: opt.id })">
          </label>
        </div>

        <button type="reset">
          Reset
        </button>
        <button type="button" @click="() => api.setValue('mango')">
          Set to Mangoes
        </button>
        <button type="button" @click="() => api.focus()">
          Focus
        </button>
      </fieldset>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
