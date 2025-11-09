<script setup lang="ts">
import { signatureControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'
import * as signature from '../../index'
import '../style.css'

const url = ref('')
const setUrl = (v: string) => (url.value = v)

const controls = useControls(signatureControls)

const [state, send] = useMachine(signature.machine({ id: useId() }), {
  context: controls.context,
})

const api = computed(() => signature.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <div v-bind="api.getRootProps()">
        <label v-bind="api.getLabelProps()">Signature Pad</label>

        <div v-bind="api.getControlProps()">
          <svg v-bind="api.getSegmentProps()">
            <path v-for="(path, i) of api.paths" :key="i" v-bind="api.getSegmentPathProps({ path })" />
            <path v-if="api.currentPath" v-bind="api.getSegmentPathProps({ path: api.currentPath })" />
          </svg>
          <div v-bind="api.getGuideProps()" />
        </div>

        <button v-bind="api.getClearTriggerProps()">
          x
        </button>
      </div>

      <button
        @click="
          () => {
            api.getDataUrl('image/png').then(setUrl)
          }
        "
      >
        Show Image
      </button>
      <img v-if="url" data-part="preview" alt="signature" :src="url">
    </main>

    <Toolbar>
      <StateVisualizer :state="state" :omit="['currentPoints', 'currentPath', 'paths']" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
