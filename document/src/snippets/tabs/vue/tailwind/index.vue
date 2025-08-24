<script setup lang="ts">
import * as tabs from '@destyler/tabs'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import Account from './Account.vue'
import Password from './Password.vue'

const data = [
  { value: 'account', label: 'Account', component: Account },
  { value: 'password', label: 'Password', component: Password },
]

const [state, send] = useMachine(tabs.machine({ id: useId(), value: 'account' }))
const api = computed(() => tabs.connect(state.value, send, normalizeProps))
</script>

<template>
  <div
    v-bind="api.getRootProps()"
    class="w-full mt-0!"
  >
    <div
      v-bind="api.getListProps()"
      class="inline-flex h-10 w-full items-center justify-center rounded-md
      bg-muted p-1 text-muted-foreground"
    >
      <button
        v-for="item in data"
        v-bind="api.getTriggerProps({ value: item.value })"
        :key="item.value"
        class="inline-flex items-center justify-center whitespace-nowrap w-1/2
        rounded-sm px-3 py-2 text-sm font-medium ring-offset-background
        transition-all focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-ring focus-visible:ring-offset-2 mt-0!
        disabled:pointer-events-none disabled:opacity-50
        data-[selected]:bg-background data-[selected]:text-foreground
        data-[selected]:shadow-sm"
      >
        {{ item.label }}
      </button>
    </div>
    <div
      v-for="item in data"
      v-bind="api.getContentProps({ value: item.value })"
      :key="item.value"
      class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[hidden]:hidden"
    >
      <p class="text-sm text-muted-foreground">
        <component :is="item.component"/>
      </p>
    </div>
  </div>
</template>
