<script setup lang="ts">
import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'
import '../../styles/components/breadcrumbs.css'

const items = ref<BreadcrumbItem[]>([
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'Components', href: '/components/checkbox' },
  { id: '3', label: 'Breadcrumbs' },
])

const [state, send] = useMachine(breadcrumbs.machine({
  id: useId(),
  items: items.value,
}))
const api = computed(() => breadcrumbs.connect(state.value, send, normalizeProps))
</script>

<template>
  <nav v-bind="api.getRootProps()">
    <ol v-bind="api.getListProps()">
      <li v-for="item in api.items" :key="item.id" v-bind="api.getItemProps(item)">
        <a v-bind="api.getLinkProps(item)">
          {{ item.label }}
        </a>
        <span v-if="item.href" v-bind="api.getSeparatorProps()" />
      </li>
    </ol>
  </nav>
</template>
