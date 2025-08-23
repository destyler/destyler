<script setup lang="ts">
import * as pagination from '@destyler/pagination'
import { paginationControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/pagination.css'

const controls = useControls(paginationControls)

const [state, send] = useMachine(pagination.machine({ id: useId(), count: 1000 }), {
  context: controls.context,
})

const api = computed(() => pagination.connect(state.value, send, normalizeProps))
</script>

<template>
  <nav v-bind="api.getRootProps()" class="pagination-root">
    <ul class="pagination-list">
      <li>
        <a
          data-testid="prev:trigger"
          v-bind="api.getPrevTriggerProps()"
          class="pagination-btn"
        >
          <div class="pagination-icon i-carbon:chevron-left" />
          Previous <span class="sr-only">Page</span>
        </a>
      </li>
      <li
        v-for="(page, i) in api.pages"
        :key="page.type === 'page' ? page.value : `ellipsis-${i}`"
      >
        <template v-if="page.type === 'page'">
          <button
            :data-testid="`pagination-item-${page.value}`"
            v-bind="api.getItemProps(page)"
            class="pagination-page"
          >
            {{ page.value }}
          </button>
        </template>
        <template v-else>
          <span
            v-bind="api.getEllipsisProps({ index: i })"
            class="pagination-ellipsis"
          >&#8230;</span>
        </template>
      </li>
      <li>
        <a
          data-testid="next:trigger"
          v-bind="api.getNextTriggerProps()"
          class="pagination-btn"
        >
          Next <span class="sr-only">Page</span>
          <div class="pagination-icon i-carbon:chevron-right" />
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
