<script setup lang="ts">
import { fileUploadControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as fileUpload from '../../index'
import '../style.css'

const controls = useControls(fileUploadControls)

const [state, send] = useMachine(fileUpload.machine({ id: useId() }), {
  context: controls.context,
})

const api = computed(() =>
  fileUpload.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <Layout>
    <div v-bind="api.getRootProps()">
      <div v-bind="api.getDropzoneProps()">
        <input v-bind="api.getHiddenInputProps()">
        <p>
          Drag and drop your files here
        </p>
        <p>
          or
        </p>
        <button v-bind="api.getTriggerProps()">
          Choose Files...
        </button>
      </div>

      <ul
        v-bind="api.getItemGroupProps()"
      >
        <li
          v-for="file in api.acceptedFiles"
          :key="file.name"
          v-bind="api.getItemProps({ file })"
        >
          <div v-bind="api.getItemNameProps({ file })">
            {{ file.name }}
          </div>
          <button v-bind="api.getItemDeleteTriggerProps({ file })">
            Delete
          </button>
        </li>
      </ul>
    </div>
    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
