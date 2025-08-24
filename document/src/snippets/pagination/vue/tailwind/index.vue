<script setup lang="ts">
import * as pagination from '@destyler/pagination'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(pagination.machine({ id: useId(), count: 1000 }))

const api = computed(() => pagination.connect(state.value, send, normalizeProps))
</script>

<template>
  <nav v-bind="api.getRootProps()" class="flex justify-center mt-0!">
    <ul class="flex flex-row items-center gap-1 m-0! list-none!">
      <li>
        <a
          v-bind="api.getPrevTriggerProps()"
          class="no-underline! text-primary! inline-flex cursor-pointer h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <div class="w-4 h-4 i-carbon:chevron-left mr-1" />
          Previous
        </a>
      </li>
      <li
        v-for="(page, i) in api.pages"
        :key="page.type === 'page' ? page.value : `ellipsis-${i}`"
      >
        <span v-if="page.type === 'page'">
          <a
            v-bind="api.getItemProps(page)"
            class="no-underline! text-primary! inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-accent data-[selected]:text-accent-foreground"
          >
            {{ page.value }}
          </a>
        </span>
        <span v-else>
          <span
            v-bind="api.getEllipsisProps({ index: i })"
            class="inline-flex  h-9 cursor-pointer w-9 items-center justify-center text-sm font-medium text-muted-foreground!"
          >&#8230;</span>
        </span>
      </li>
      <li>
        <a
          v-bind="api.getNextTriggerProps()"
          class="no-underline! text-primary! inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Next
          <div class="w-4 h-4 i-carbon:chevron-right ml-1" />
        </a>
      </li>
    </ul>
  </nav>
</template>
