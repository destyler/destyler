<script setup lang="ts">
import * as tabs from '@destyler/tabs'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import Account from './Account.vue'
import Password from './Password.vue'
import '../../styles/components/tabs.css'

const data = [
  { value: 'account', label: 'Account', component: Account },
  { value: 'password', label: 'Password', component: Password },
]

const [state, send] = useMachine(tabs.machine({ id: useId(), value: 'account' }))
const api = computed(() => tabs.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getListProps()">
      <button
        v-for="item in data"
        v-bind="api.getTriggerProps({ value: item.value })"
        :key="item.value"
      >
        {{ item.label }}
      </button>
    </div>
    <div
      v-for="item in data"
      v-bind="api.getContentProps({ value: item.value })"
      :key="item.value"
    >
      <p class="text-sm text-muted-foreground">
        <component :is="item.component" />
      </p>
    </div>
  </div>
</template>
