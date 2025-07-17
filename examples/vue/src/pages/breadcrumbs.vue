<script setup lang="ts">
import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'
import '@destyler/shared-private/styles/breadcrumbs.css'

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
  <nav v-bind="api.getRootProps()">
    <ol v-bind="api.getListProps()" class="breadcrumbs-root">
      <li v-for="item in api.items" v-bind="api.getItemProps(item)" :key="item.id">
        <a v-bind="api.getLinkProps(item)" class="breadcrumbs-link">{{ item.label }}</a>
        <span v-if="item.href" v-bind="api.getSeparatorProps()">/</span>
      </li>
    </ol>
  </nav>
</template>
