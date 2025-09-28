<script setup lang="ts">
import * as separator from '@destyler/separator'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'
import '../../styles/components/separator.css'

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
  <div class="w-full min-w-90 mx-4">
    <div class="text-primary text-sm font-semibold">
      Destyler UI
    </div>
    <div class="text-primary text-sm mt-0!">
      unstyled component for vue.
    </div>
    <div v-bind="api.getRootProps()" />
    <div class="flex h-5 items-center mt-0!">
      <template v-for="(item, index) in items" :key="item.value">
        <div class="text-primary text-sm mt-0!">
          {{ item.label }}
        </div>
        <div v-if="index < items.length - 1" v-bind="api.getRootProps('vertical')" />
      </template>
    </div>
  </div>
</template>
