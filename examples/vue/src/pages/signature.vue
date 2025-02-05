<script setup lang="ts">
  import * as signaturePad from "@destyler/signature"
  import { useMachine, normalizeProps } from "@destyler/vue"
  import { computed,useId } from "vue"

  const [state, send] = useMachine(signaturePad.machine({ id: useId(), }))

  const api = computed(() =>
    signaturePad.connect(state.value, send, normalizeProps),
  )
</script>

<template>
  <div v-bind="api.getRootProps()">
    <label v-bind="api.getLabelProps()">Signature</label>

    <div v-bind="api.getControlProps()" class="w-400px h-200px">
      <svg v-bind="api.getSegmentProps()">
        <path
          v-for="(path, i) of api.paths"
          :key="i"
          v-bind="api.getSegmentPathProps({ path })"
        />
        <path
          v-if="api.currentPath"
          v-bind="api.getSegmentPathProps({ path: api.currentPath })"
        />
      </svg>

      <button v-bind="api.getClearTriggerProps()">X</button>

      <div v-bind="api.getGuideProps()" />
    </div>
  </div>
</template>
