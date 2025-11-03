<script setup lang="ts">
import { paginationControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as pagination from '../../index'
import '../style.css'

const controls = useControls(paginationControls)

const [state, send] = useMachine(
  pagination.machine({
    id: useId(),
    count: 1000,
  }),
  {
    context: controls.context,
  },
)

const api = computed(() => pagination.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
      <nav v-bind="api.getRootProps()">
        <ul style="display: flex;">
          <li>
            <a v-bind="api.getPrevTriggerProps()">
              ⬅️
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
              ➡️
            </a>
          </li>
        </ul>
      </nav>
    </main>
    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
