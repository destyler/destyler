<script setup lang="ts">
import * as pagination from '@destyler/pagination'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '../../styles/components/pagination.css'

const [state, send] = useMachine(pagination.machine({ id: useId(), count: 1000 }))

const api = computed(() => pagination.connect(state.value, send, normalizeProps))
</script>

<template>
  <nav v-bind="api.getRootProps()">
    <ul>
      <li>
        <a v-bind="api.getPrevTriggerProps()">
          <div />
        </a>
      </li>
      <li
        v-for="(page, i) in api.pages"
        :key="page.type === 'page' ? page.value : `ellipsis-${i}`"
      >
        <span v-if="page.type === 'page'">
          <a v-bind="api.getItemProps(page)">
            {{ page.value }}
          </a>
        </span>
        <span v-else>
          <span v-bind="api.getEllipsisProps({ index: i })">&#8230;</span>
        </span>
      </li>
      <li>
        <a v-bind="api.getNextTriggerProps()">
          <div />
        </a>
      </li>
    </ul>
  </nav>
</template>
