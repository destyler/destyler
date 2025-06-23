<script setup lang="ts">
  import * as signaturePad from "@destyler/signature"
  import { useMachine, normalizeProps } from "@destyler/vue"
  import { computed,useId } from "vue"
  import { signatureControls } from '@destyler/shared-private-private'
import { useControls } from '../composables/useControls'

const controls = useControls(signatureControls)

  const [state, send] = useMachine(signaturePad.machine({ id: useId(), }),{
    context: controls.context,
  })

  const api = computed(() =>
    signaturePad.connect(state.value, send, normalizeProps),
  )
</script>

<template>
  <div v-bind="api.getRootProps()" class="max-w-2xl p-6">
    <label v-bind="api.getLabelProps()" class="block text-lg font-medium text-gray-700 mb-2">
      Signature
    </label>

    <div
      v-bind="api.getControlProps()"
      class="w-[400px] h-[200px] relative border-2 border-gray-300 rounded-lg bg-white shadow-sm"
    >
      <svg v-bind="api.getSegmentProps()" class="w-full h-full">
        <path
          v-for="(path, i) of api.paths"
          :key="i"
          v-bind="api.getSegmentPathProps({ path })"
          class="stroke-black"
        />
        <path
          v-if="api.currentPath"
          v-bind="api.getSegmentPathProps({ path: api.currentPath })"
          class="stroke-black"
        />
      </svg>

      <button
        v-bind="api.getClearTriggerProps()"
        class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <span class="text-gray-600 i-carbon:close-large"></span>
      </button>

      <div
        v-bind="api.getGuideProps()"
        class="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-400"
      />
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
