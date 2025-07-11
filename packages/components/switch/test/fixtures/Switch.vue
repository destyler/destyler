<script setup lang="ts">
import { switchControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'
import * as switchComponent from '../../index'

const controls = useControls(switchControls)

// Regular switch
const [state, send] = useMachine(switchComponent.machine({
  id: useId(),
  checked: false,
  name: 'switch',
  value: 'on',
}), {
  context: controls.context,
})

// Disabled switch
const [disabledState, disabledSend] = useMachine(switchComponent.machine({
  id: useId(),
  checked: false,
  disabled: true,
  name: 'disabled-switch',
  value: 'disabled-on',
}))

// Readonly switch
const [readonlyState, readonlySend] = useMachine(switchComponent.machine({
  id: useId(),
  checked: false,
  readOnly: true,
  name: 'readonly-switch',
  value: 'readonly-on',
}))

// Invalid switch
const [invalidState, invalidSend] = useMachine(switchComponent.machine({
  id: useId(),
  checked: false,
  invalid: true,
  name: 'invalid-switch',
  value: 'invalid-on',
}))

// Controlled switch
const controlledChecked = ref(false)
const [controlledState, controlledSend] = useMachine(switchComponent.machine({
  id: useId(),
  checked: controlledChecked.value,
  name: 'controlled-switch',
  value: 'controlled-on',
}))

// Custom value switch
const [customValueState, customValueSend] = useMachine(switchComponent.machine({
  id: useId(),
  checked: false,
  name: 'custom-value-switch',
  value: 'custom-value',
}))

const api = computed(() =>
  switchComponent.connect(state.value, send, normalizeProps),
)

const disabledApi = computed(() =>
  switchComponent.connect(disabledState.value, disabledSend, normalizeProps),
)

const readonlyApi = computed(() =>
  switchComponent.connect(readonlyState.value, readonlySend, normalizeProps),
)

const invalidApi = computed(() =>
  switchComponent.connect(invalidState.value, invalidSend, normalizeProps),
)

const controlledApi = computed(() =>
  switchComponent.connect(controlledState.value, controlledSend, normalizeProps),
)

const customValueApi = computed(() =>
  switchComponent.connect(customValueState.value, customValueSend, normalizeProps),
)

// Controlled switch methods
function setChecked() {
  controlledChecked.value = true
  controlledSend({ type: 'CHECKED.SET', checked: true })
}

function setUnchecked() {
  controlledChecked.value = false
  controlledSend({ type: 'CHECKED.SET', checked: false })
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px; padding: 20px;">
    <!-- Regular switch -->
    <div v-bind="api.getRootProps()">
      <div
        v-bind="api.getControlProps()" style="
        width: 44px;
        height: 24px;
        border-radius: 12px;
        background: #ccc;
        position: relative;
        cursor: pointer;
        transition: all 0.2s;
        user-select: none;
      " :style="{ background: api.checked ? '#007acc' : '#ccc' }"
      >
        <div
          v-bind="api.getThumbProps()" style="
          width: 20px;
          height: 20px;
          border-radius: 10px;
          background: white;
          position: absolute;
          top: 2px;
          transition: all 0.2s;
        " :style="{ left: api.checked ? '22px' : '2px' }"
        />
        <input
          v-bind="api.getHiddenInputProps()"
          data-testid="hidden-input"
          :aria-labelledby="`switch-label-${api.id}`"
          :aria-describedby="`switch-desc-${api.id}`"
        >
      </div>
      <div v-bind="api.getLabelProps()" :id="`switch-label-${api.id}`">
        Switch Label
      </div>
      <div :id="`switch-desc-${api.id}`" style="font-size: 12px; color: #666;">
        Toggle this switch to change its state
      </div>
    </div>

    <!-- Disabled switch -->
    <div v-bind="disabledApi.getRootProps()" data-testid="disabled-switch">
      <div
        v-bind="disabledApi.getControlProps()" style="
        width: 44px;
        height: 24px;
        border-radius: 12px;
        background: #e0e0e0;
        position: relative;
        cursor: not-allowed;
        opacity: 0.6;
        user-select: none;
      "
      >
        <div
          v-bind="disabledApi.getThumbProps()" style="
          width: 20px;
          height: 20px;
          border-radius: 10px;
          background: white;
          position: absolute;
          top: 2px;
          left: 2px;
        "
        />
        <input v-bind="disabledApi.getHiddenInputProps()" data-testid="disabled-input">
      </div>
      <div v-bind="disabledApi.getLabelProps()">
        Disabled Switch
      </div>
    </div>

    <!-- Readonly switch -->
    <div v-bind="readonlyApi.getRootProps()" data-testid="readonly-switch">
      <div
        v-bind="readonlyApi.getControlProps()" style="
        width: 44px;
        height: 24px;
        border-radius: 12px;
        background: #f0f0f0;
        position: relative;
        cursor: default;
        user-select: none;
      "
      >
        <div
          v-bind="readonlyApi.getThumbProps()" style="
          width: 20px;
          height: 20px;
          border-radius: 10px;
          background: white;
          position: absolute;
          top: 2px;
          left: 2px;
        "
        />
        <input v-bind="readonlyApi.getHiddenInputProps()" data-testid="readonly-input">
      </div>
      <div v-bind="readonlyApi.getLabelProps()">
        Readonly Switch
      </div>
    </div>

    <!-- Invalid switch -->
    <div v-bind="invalidApi.getRootProps()" data-testid="invalid-switch">
      <div
        v-bind="invalidApi.getControlProps()" style="
        width: 44px;
        height: 24px;
        border-radius: 12px;
        background: #ffebee;
        border: 1px solid #f44336;
        position: relative;
        cursor: pointer;
        user-select: none;
      "
      >
        <div
          v-bind="invalidApi.getThumbProps()" style="
          width: 20px;
          height: 20px;
          border-radius: 10px;
          background: white;
          position: absolute;
          top: 2px;
          left: 2px;
        "
        />
        <input v-bind="invalidApi.getHiddenInputProps()" data-testid="invalid-input">
      </div>
      <div v-bind="invalidApi.getLabelProps()">
        Invalid Switch
      </div>
    </div>

    <!-- Controlled switch -->
    <div v-bind="controlledApi.getRootProps()" data-testid="controlled-switch">
      <div
        v-bind="controlledApi.getControlProps()" style="
        width: 44px;
        height: 24px;
        border-radius: 12px;
        background: #ccc;
        position: relative;
        cursor: pointer;
        transition: all 0.2s;
        user-select: none;
      " :style="{ background: controlledApi.checked ? '#007acc' : '#ccc' }"
      >
        <div
          v-bind="controlledApi.getThumbProps()" style="
          width: 20px;
          height: 20px;
          border-radius: 10px;
          background: white;
          position: absolute;
          top: 2px;
          transition: all 0.2s;
        " :style="{ left: controlledApi.checked ? '22px' : '2px' }"
        />
        <input v-bind="controlledApi.getHiddenInputProps()" data-testid="controlled-input">
      </div>
      <div v-bind="controlledApi.getLabelProps()">
        Controlled Switch
      </div>
      <div style="display: flex; gap: 10px; margin-top: 10px;">
        <button data-testid="set-checked-btn" @click="setChecked">
          Set Checked
        </button>
        <button data-testid="set-unchecked-btn" @click="setUnchecked">
          Set Unchecked
        </button>
      </div>
    </div>

    <!-- Custom value switch -->
    <div v-bind="customValueApi.getRootProps()" data-testid="custom-value-switch">
      <div
        v-bind="customValueApi.getControlProps()" style="
        width: 44px;
        height: 24px;
        border-radius: 12px;
        background: #ccc;
        position: relative;
        cursor: pointer;
        transition: all 0.2s;
        user-select: none;
      " :style="{ background: customValueApi.checked ? '#007acc' : '#ccc' }"
      >
        <div
          v-bind="customValueApi.getThumbProps()" style="
          width: 20px;
          height: 20px;
          border-radius: 10px;
          background: white;
          position: absolute;
          top: 2px;
          transition: all 0.2s;
        " :style="{ left: customValueApi.checked ? '22px' : '2px' }"
        />
        <input v-bind="customValueApi.getHiddenInputProps()" data-testid="custom-value-input">
      </div>
      <div v-bind="customValueApi.getLabelProps()">
        Custom Value Switch
      </div>
    </div>
  </div>

  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
