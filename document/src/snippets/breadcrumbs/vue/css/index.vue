<script setup lang="ts">
import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'
import './index.css'

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
    <ol v-bind="api.getListProps()" class="breadcrumb-list">
      <li 
        v-for="item in api.items" 
        v-bind="api.getItemProps(item)" 
        :key="item.id"
        class="breadcrumb-item"
      >
        <a 
          v-bind="api.getLinkProps(item)" 
          class="breadcrumb-link"
        >
          {{ item.label }}
        </a>
        <span v-if="item.href" v-bind="api.getSeparatorProps()" class="breadcrumb-separator"></span>
      </li>
    </ol>
  </nav>
</template>
