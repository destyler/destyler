<script setup lang="ts">
import * as separator from '@destyler/separator'
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed, useId, ref } from "vue"

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
    <div
      v-bind="api.getRootProps()"
      class="bg-stone-300/50 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4"
    />
    <div class="flex h-5 items-center mt-0!">
      <template v-for="(item, index) in items" :key="item.value">
        <div
          class="text-primary text-sm mt-0!"
        >
          {{ item.label }}
        </div>
        <div
          v-bind="api.getRootProps('vertical')"
          v-if="index < items.length - 1"
          class="bg-stone-300/50 mt-0! data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-4"
        />
      </template>
    </div>
  </div>
</template>
