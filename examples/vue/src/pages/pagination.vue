<script setup lang="ts">
import * as pagination from "@destyler/pagination"
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed, useId } from "vue"
import { paginationControls } from '@destyler/shared-private'
import { useControls } from '../composables/useControls'

const controls = useControls(paginationControls)

const [state, send] = useMachine(pagination.machine({ id: useId(), count: 1000 }),{
  context: controls.context,
})

const api = computed(() => pagination.connect(state.value, send, normalizeProps))
</script>

<template>
  <nav v-bind="api.getRootProps()" class="flex justify-center py-8">
    <ul class="flex items-center gap-x-3">
      <li>
        <a
          v-bind="api.getPrevTriggerProps()"
          class="px-5 py-2.5 rounded-lg border border-gray-800 hover:bg-gray-50
          transition-all duration-200 shadow-sm hover:shadow-md
          flex items-center gap-x-1 text-sm font-medium cursor-pointer"
        >
          <div class="w-4 h-4 i-carbon:chevron-left"></div>
          Previous <span class="sr-only">Page</span>
        </a>
      </li>
      <li
        v-for="(page, i) in api.pages"
        :key="page.type === 'page' ? page.value : `ellipsis-${i}`"
      >
        <span v-if="page.type === 'page'">
          <a
            v-bind="api.getItemProps(page)"
            class="min-w-[40px] h-10 flex items-center justify-center px-3
            rounded-lg border border-gray-800 hover:bg-gray-50
            transition-all duration-200 shadow-sm hover:shadow-md
            data-[selected]:bg-gray-900 data-[selected]:text-white
            data-[selected]:border-gray-900 data-[selected]:shadow-lg
            text-sm font-medium cursor-pointer"
          >
            {{ page.value }}
          </a>
        </span>
        <span v-else>
          <span
            v-bind="api.getEllipsisProps({ index: i })"
            class="px-3 py-2 text-gray-500 font-medium"
          >&#8230;</span>
        </span>
      </li>
      <li>
        <a
          v-bind="api.getNextTriggerProps()"
          class="px-5 py-2.5 rounded-lg border border-gray-800 hover:bg-gray-50
          transition-all duration-200 shadow-sm hover:shadow-md
          flex items-center gap-x-1 text-sm font-medium cursor-pointer"
        >
          Next <span class="sr-only">Page</span>
          <div class="w-4 h-4 i-carbon:chevron-right"></div>
        </a>
      </li>
    </ul>
  </nav>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
