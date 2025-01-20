<script setup lang="ts">
import * as pagination from "@destyler/pagination"
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed, useId } from "vue"


const [state, send] = useMachine(pagination.machine({ id: useId(), count: 1000 }))

const api = computed(() => pagination.connect(state.value, send, normalizeProps))
</script>

<template>
  <nav v-if="api.totalPages > 1" v-bind="api.getRootProps()">
    <ul class="flex gap-x-2">
      <li>
        <a href="#previous" v-bind="api.getPrevTriggerProps()">
          Previous <span class="visually-hidden">Page</span>
        </a>
      </li>
      <li
        v-for="(page, i) in api.pages"
        :key="page.type === 'page' ? page.value : `ellipsis-${i}`"
      >
        <span v-if="page.type === 'page'">
          <a :href="`#${page.value}`" v-bind="api.getItemProps(page)">
            {{page.value}}
          </a></span
        >
        <span v-else>
          <span v-bind="api.getEllipsisProps({ index: i })">&#8230;</span>
        </span>
      </li>
      <li>
        <a href="#next" v-bind="api.getNextTriggerProps()">
          Next <span class="visually-hidden">Page</span>
        </a>
      </li>
    </ul>
  </nav>
</template>
