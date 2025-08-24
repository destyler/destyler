<script setup lang="ts">
import * as pagination from '@destyler/pagination'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(pagination.machine({ id: useId(), count: 1000 }))

const api = computed(() => pagination.connect(state.value, send, normalizeProps))
</script>

<template>
  <nav v-bind="api.getRootProps()" class="pagination-nav">
    <ul class="pagination-list">
      <li>
        <a
          v-bind="api.getPrevTriggerProps()"
          class="pagination-button pagination-prev"
        >
          <div class="pagination-icon pagination-prev-icon i-carbon:chevron-left"></div>
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
            class="pagination-button pagination-page"
          >
            {{ page.value }}
          </a>
        </span>
        <span v-else>
          <span
            v-bind="api.getEllipsisProps({ index: i })"
            class="pagination-ellipsis"
          >&#8230;</span>
        </span>
      </li>
      <li>
        <a
          v-bind="api.getNextTriggerProps()"
          class="pagination-button pagination-next"
        >
          Next
          <div class="pagination-icon pagination-next-icon i-carbon:chevron-right"></div>
        </a>
      </li>
    </ul>
  </nav>
</template>
