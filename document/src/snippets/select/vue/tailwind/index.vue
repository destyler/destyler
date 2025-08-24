<script setup lang="ts">
import * as select from '@destyler/select'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const selectData = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Pineapple', value: 'pineapple' },
]

const [state, send] = useMachine(
  select.machine({
    id: useId(),
    collection: select.collection({
      items: selectData,
    }),
  }),
)

const api = computed(() => select.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="flex flex-col outline-none!">
    <button
      v-bind="api.getTriggerProps()"
      class="group flex h-10 w-full items-center outline-none!
      justify-between rounded-md border border-input
      bg-background px-3 py-2 text-sm transition-colors
      hover:bg-accent hover:text-accent-foreground
      disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span class="text-foreground">{{ api.valueAsString || "Select option" }}</span>
      <span
        class="i-carbon-chevron-down
        transition-transform duration-300 group-data-[state=open]:rotate--180
        w-4 h-4 text-muted-foreground"
      />
    </button>
  </div>

  <Teleport v-if="api.open" to="body">
    <div
      v-bind="api.getPositionerProps()"
      class="relative z-50! min-w-[8rem] w-[--reference-width]"
    >
      <ul
        v-bind="api.getContentProps()"
        class="absolute w-full rounded-md border border-input! bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95"
      >
        <li
          v-for="item in selectData"
          :key="item.value"
          v-bind="api.getItemProps({ item })"
          class="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          <span>{{ item.label }}</span>
          <span
            v-bind="api.getItemIndicatorProps({ item })"
            class="ml-auto pl-2 text-primary"
          >
            <span class="i-lucide-check w-4 h-4" />
          </span>
        </li>
      </ul>
    </div>
  </Teleport>
</template>
