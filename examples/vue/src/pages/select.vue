<script setup lang="ts">
import * as select from "@destyler/select"
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed, useId } from "vue"
import { selectControls } from '@destyler/shared-private-private'
import { useControls } from '../composables/useControls'

const controls = useControls(selectControls)

  const selectData = [
    { label: "Nigeria", value: "NG" },
    { label: "Japan", value: "JP" },
    //...
  ]

  const [state, send] = useMachine(
    select.machine({
      id: useId(),
      collection: select.collection({
        items: selectData,
      }),
    }),{
      context: controls.context,
    }
  )

  const api = computed(() => select.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="flex flex-col space-y-2 p-4">
    <label
      v-bind="api.getLabelProps()"
      class="text-sm font-medium text-gray-700 dark:text-gray-200"
    >
      Label
    </label>
    <button
      v-bind="api.getTriggerProps()"
      class="group flex items-center justify-between w-xs px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
    >
      <span>{{ api.valueAsString || "Select option" }}</span>
      <span class="transition-transform duration-300 i-carbon:chevron-right w-4 h-4 text-gray-400 group-data-[state=open]:rotate-90"></span>
    </button>
  </div>

    <div
      v-bind="api.getPositionerProps()"
      class="relative z-50 w-[--reference-width]"
    >
      <ul
        v-bind="api.getContentProps()"
        class="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none dark:bg-gray-800 dark:border-gray-700"
      >
        <li
          v-for="item in selectData"
          :key="item.value"
          v-bind="api.getItemProps({ item })"
          class="flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
        >
          <span>{{ item.label }}</span>
          <span
            v-bind="api.getItemIndicatorProps({ item })"
            class="text-gray-600 dark:text-gray-400"
          >
            ✓
          </span>
        </li>
      </ul>
    </div>
    <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
