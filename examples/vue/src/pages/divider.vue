<script setup lang="ts">
import * as separator from '@destyler/separator'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'

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
  <div class="w-full max-w-75 mx-4">
    <div class="text-black text-sm font-semibold">
      Destyler UI
    </div>
    <div class="text-black text-sm">
      unstyled component for vue.
    </div>
    <div
      v-bind="api.getRootProps()"
      class="bg-dark data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4"
    />
    <div class="flex h-5 items-center">
      <template v-for="(item, index) in items" :key="item.value">
        <div
          class="text-black text-sm"
        >
          {{ item.label }}
        </div>
        <div
          v-if="index < items.length - 1"
          v-bind="api.getRootProps('vertical')"
          class="bg-dark data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-4"
        />
      </template>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
  </Toolbar>
</template>
