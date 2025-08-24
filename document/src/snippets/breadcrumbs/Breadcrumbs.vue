<script setup lang="ts">
import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'

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
    <ol v-bind="api.getListProps()" class="mt-0! flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
      <li 
        v-for="item in api.items" 
        v-bind="api.getItemProps(item)" 
        :key="item.id"
        class="inline-flex items-center gap-1.5 mt-0!"
      >
        <a 
          v-bind="api.getLinkProps(item)" 
          class="transition-colors hover:text-foreground no-underline! data-[current=page]:text-foreground">
          {{ item.label }}
        </a>
        <span v-if="item.href" v-bind="api.getSeparatorProps()" class="i-carbon:chevron-right size-3"></span>
      </li>
    </ol>
  </nav>
</template>
