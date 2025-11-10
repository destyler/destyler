<script setup lang="ts">
import { toggleControls, toggleData } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed } from 'vue'
import * as toggle from '../../index'
import '../style.css'

const controls = useControls(toggleControls)

const [state, send] = useMachine(toggle.machine({ id: '1' }), {
  context: controls.context,
})
const api = computed(() => toggle.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <button>Outside</button>
      <div v-bind="api.getRootProps()">
        <button v-for="item in toggleData" :key="item.value" v-bind="api.getItemProps({ value: item.value })">
          {{ item.label }}
        </button>
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
