<script setup lang="ts">
import * as radio from '@destyler/radio'
import { radioControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/radio.css'

const controls = useControls(radioControls)

const items = [
  { id: 'apple', label: 'Apples' },
  { id: 'orange', label: 'Oranges' },
  { id: 'mango', label: 'Mangoes' },
  { id: 'grape', label: 'Grapes' },
]

const [state, send] = useMachine(radio.machine({
  id: useId(),
  name: 'fruits',
}), {
  context: controls.context,
})

const api = computed(() => radio.connect(state.value, send, normalizeProps))
</script>

<template>
  <main class="radio">
    <form>
      <div data-testid="radio-click">
        radio click
      </div>
      <fieldset>
        <div v-bind="api.getRootProps()" class="radio-root">
          <h3 v-bind="api.getLabelProps()" class="radio-label">
            Fruits
          </h3>
          <div v-bind="api.getIndicatorProps()" />

          <label
            v-for="opt in items"
            :key="opt.id"
            :data-testid="`radio-${opt.id}`"
            class="radio-item"
            v-bind="api.getItemProps({ value: opt.id })"
          >
            <div class="radio-item-control" :data-testid="`control-${opt.id}`" v-bind="api.getItemControlProps({ value: opt.id })" />
            <span class="radio-item-label" :data-testid="`label-${opt.id}`" v-bind="api.getItemTextProps({ value: opt.id })">
              {{ opt.label }}
            </span>
            <input :data-testid="`input-${opt.id}`" v-bind="api.getItemHiddenInputProps({ value: opt.id })">
          </label>
        </div>

        <button type="reset">
          Reset
        </button>
        <button type="button" @click="() => api.clearValue()">
          Clear
        </button>
        <button type="button" @click="() => api.setValue('mango')">
          Set to Mangoes
        </button>
        <button type="button" @click="() => api.focus()">
          Focus
        </button>
      </fieldset>
    </form>
  </main>

  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
