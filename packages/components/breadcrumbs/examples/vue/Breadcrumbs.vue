<script setup lang="ts">
import type { BreadcrumbItem } from '../../index'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'
import * as breadcrumbs from '../../index'
import '../style.css'

const items = ref<BreadcrumbItem[]>([
  { id: '1', label: 'one', href: '/' },
  { id: '2', label: 'two', href: '/products' },
  { id: '3', label: 'three' },
])

const [state, send] = useMachine(breadcrumbs.machine({
  id: useId(),
  items: items.value,
}))
const api = computed(() => breadcrumbs.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <nav v-bind="api.getRootProps()">
      <ol v-bind="api.getListProps()">
        <li v-for="item in api.items" v-bind="api.getItemProps(item)" :key="item.id">
          <a v-bind="api.getLinkProps(item)">{{ item.label }}</a>
          <span v-if="item.href" v-bind="api.getSeparatorProps()">/</span>
        </li>
      </ol>
    </nav>
    <Toolbar>
      <StateVisualizer :state="state" />
    </Toolbar>
  </Layout>
</template>
