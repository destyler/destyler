<script setup lang="ts">
import { dataAttr } from '@zag-js/dom-query'
import { ref, useSlots } from 'vue'

const props = defineProps<{
  viz?: boolean
}>()

const slots = useSlots()

const controls = !!slots.controls
const activeState = ref(props.viz ? 1 : !controls ? 1 : 0)
</script>

<template>
  <div class="toolbar z-10 fixed right-0 top-0 bottom-0 w-80">
    <nav>
      <button
        v-if="controls"
        :data-active="dataAttr(activeState === 0)"
        @click="() => (activeState = 0)"
      >
        Controls
      </button>

      <button
        :data-active="dataAttr(activeState === 1)"
        @click="() => (activeState = 1)"
      >
        Visualizer
      </button>
    </nav>
    <div>
      <div v-if="controls" data-content :data-active="dataAttr(activeState === 0)">
        <slot name="controls" />
      </div>

      <div data-content :data-active="dataAttr(activeState === 1)">
        <slot />
      </div>
    </div>
  </div>
</template>
