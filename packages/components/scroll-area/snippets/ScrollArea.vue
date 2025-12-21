<script setup lang="ts">
import * as scrollArea from '@destyler/scroll-area'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './style.css'

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
)

const [state, send] = useMachine(scrollArea.machine({ id: useId() }))

const api = computed(() => scrollArea.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getViewportProps()">
      <div v-bind="api.getContentProps()">
        <div class="scroll-area-header">
          Tags
        </div>
        <div v-for="tag in tags" :key="tag" class="scroll-area-item">
          {{ tag }}
        </div>
      </div>
    </div>

    <div v-bind="api.getScrollbarProps({ orientation: 'vertical' })">
      <div v-bind="api.getThumbProps({ orientation: 'vertical' })" />
    </div>

    <div v-bind="api.getScrollbarProps({ orientation: 'horizontal' })">
      <div v-bind="api.getThumbProps({ orientation: 'horizontal' })" />
    </div>

    <div v-bind="api.getCornerProps()" />
  </div>
</template>
