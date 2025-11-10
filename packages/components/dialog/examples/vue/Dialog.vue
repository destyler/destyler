<script setup lang="ts">
import { dialogControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as dialog from '../../index'
import '../style.css'

const controls = useControls(dialogControls)

const [state, send] = useMachine(dialog.machine({
  id: useId(),
}), {
  context: controls.context,
})

const api = computed(() =>
  dialog.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <Layout>
    <main>
      <button v-bind="api.getTriggerProps()">
        Click Me
      </button>
      <Transition to="body">
        <div v-if="api.open">
          <div v-bind="api.getBackdropProps()" />
          <div v-bind="api.getPositionerProps()">
            <div v-bind="api.getContentProps()">
              <h2 v-bind="api.getTitleProps()">
                Edit profile
              </h2>
              <p v-bind="api.getDescriptionProps()">
                Make changes to your profile here. Click save when you are done.
              </p>
              <div>
                <input placeholder="Enter name...">
                <button>Save</button>
              </div>
              <button v-bind="api.getCloseTriggerProps()">
                x
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </main>
    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
