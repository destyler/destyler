<script setup lang="ts">
import * as separator from '@destyler/separator'
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed, useId, ref } from "vue"
import './index.css'

const items = ref([
  { label: 'Blog', value: 'blog' },
  { label: 'Docs', value: 'docs' },
  { label: 'Source', value: 'source' },
])

const [state, send] = useMachine(separator.machine({ id: useId() }))
const api = computed(() =>
  separator.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div class="container">
    <div class="title">
      Destyler UI
    </div>
    <div class="subtitle">
      unstyled component for vue.
    </div>
    <div
      v-bind="api.getRootProps()"
      class="separator-horizontal"
    />
    <div class="items-row">
      <template v-for="(item, index) in items" :key="item.value">
        <div class="item-label">
          {{ item.label }}
        </div>
        <div
          v-bind="api.getRootProps('vertical')"
          v-if="index < items.length - 1"
          class="separator-vertical"
        />
      </template>
    </div>
  </div>
</template>
