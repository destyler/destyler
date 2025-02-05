<script setup lang="ts">
  import * as fileUpload from "@destyler/file-upload"
  import { normalizeProps, useMachine } from "@destyler/vue"
  import { computed,useId } from "vue"

  const [state, send] = useMachine(fileUpload.machine({ id: useId() }))

  const api = computed(() =>
    fileUpload.connect(state.value, send, normalizeProps),
  )
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getDropzoneProps()">
      <input v-bind="api.getHiddenInputProps()" />
      Drag your files here
    </div>

    <button v-bind="api.getTriggerProps()">Choose Files...</button>

    <ul v-bind="api.getItemGroupProps()">
      <li
        v-for="file in api.acceptedFiles"
        :key="file.name"
        v-bind="api.getItemProps({ file })"
      >
        <div v-bind="api.getItemNameProps({ file })">{{ file.name }}</div>
        <button v-bind="api.getItemDeleteTriggerProps({ file })">Delete</button>
      </li>
    </ul>
  </div>
</template>
