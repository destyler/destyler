<script setup lang="ts">
import * as collapse from '@destyler/collapse'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './index.css'

const data = [
  {
    title: 'Watercraft',
    content: 'Experience the thrill of cutting-edge marine vessels, from luxury yachts to high-performance speedboats.',
  },
  {
    title: 'Automobiles',
    content: 'Discover our premium selection of automobiles, featuring the latest in automotive technology and design.',
  },
  {
    title: 'Aircraft',
    content: 'Explore our range of aircraft, from private jets to commercial airliners, all equipped with state-of-the-art technology.',
  },
]

const [state, send] = useMachine(collapse.machine({ id: useId() }))

const api = computed(() =>
  collapse.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div
    v-bind="api.getRootProps()"
    class="collapse-root"
  >
    <div
      v-for="item in data"
      :key="item.title"
      v-bind="api.getItemProps({ value: item.title })"
      class="collapse-item"
    >
      <h3 class="collapse-header">
        <button
          v-bind="api.getItemTriggerProps({ value: item.title })"
          class="collapse-trigger"
        >
          <span>{{ item.title }}</span>
          <div class="collapse-indicator" />
        </button>
      </h3>
      <div
        v-bind="api.getItemContentProps({ value: item.title })"
        class="collapse-content"
      >
        <div class="collapse-content-inner">
          <p class="collapse-text">
            {{ item.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
