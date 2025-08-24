<script setup lang="ts">
  import * as fileUpload from "@destyler/file-upload"
  import { normalizeProps, useMachine } from "@destyler/vue"
  import { computed,useId } from "vue"
  import './index.css'

  const [state, send] = useMachine(fileUpload.machine({ id: useId() }))

  const api = computed(() =>
    fileUpload.connect(state.value, send, normalizeProps),
  )
</script>

<template>
  <div v-bind="api.getRootProps()" class="file-upload-root">
    <div
      v-bind="api.getDropzoneProps()"
      class="dropzone"
    >
      <input v-bind="api.getHiddenInputProps()" />
      <div class="dropzone-content">
        <div class="icon-container">
          <span class="upload-icon"></span>
        </div>
        <p class="dropzone-text">Drag and drop files here</p>
        <p class="dropzone-subtext">or</p>
      </div>
      <button
        v-bind="api.getTriggerProps()"
        class="choose-files-btn"
      >
        Choose Files
      </button>
    </div>

    <ul
      v-bind="api.getItemGroupProps()"
      class="file-list"
    >
      <li
        v-for="file in api.acceptedFiles"
        :key="file.name"
        v-bind="api.getItemProps({ file })"
        class="file-item"
      >
        <div class="file-item-info">
          <div class="file-icon-container">
            <span class="file-icon"></span>
          </div>
          <div
            v-bind="api.getItemNameProps({ file })"
            class="file-name"
          >
            {{ file.name }}
          </div>
        </div>
        <button
          v-bind="api.getItemDeleteTriggerProps({ file })"
          class="delete-btn"
        >
          <span class="delete-icon"></span>
        </button>
      </li>
    </ul>
  </div>
</template>
