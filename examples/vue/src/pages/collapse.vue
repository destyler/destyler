<script setup lang="ts">
import * as collapse from '@destyler/collapse'
import { collapseControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/collapse.css'

const controls = useControls(collapseControls)

const data = [
  {
    id: 'watercraft',
    title: 'Watercraft',
    content: 'Experience the thrill of cutting-edge marine vessels, from luxury yachts to high-performance speedboats.',
  },
  {
    id: 'automobiles',
    title: 'Automobiles',
    content: 'Discover our premium selection of automobiles, featuring the latest in automotive technology and design.',
  },
  {
    id: 'aircraft',
    title: 'Aircraft',
    content: 'Explore our range of aircraft, from private jets to commercial airliners, all equipped with state-of-the-art technology.',
  },
]

const [state, send] = useMachine(collapse.machine({ id: useId() }), {
  context: controls.context,
})

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
      <h3 style="margin: 0;">
        <button
          :data-testid="`${item.id}:trigger`"
          v-bind="api.getItemTriggerProps({ value: item.title })"
          class="group collapse-item-trigger"
        >
          <div class="collapse-item-trigger-title">
            <span class="collapse-item-trigger-title-text">
              {{ item.title }}
            </span>
          </div>
          <div
            class="collapse-item-trigger-icon"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="M22 16L12 26l-1.4-1.4l8.6-8.6l-8.6-8.6L12 6z" /></svg>
          </div>
        </button>
      </h3>
      <div
        :data-testid="`${item.id}:content`"
        v-bind="api.getItemContentProps({ value: item.title })"
        class="collapse-item-content"
      >
        <div class="collapse-item-content-box">
          <p class="leading-relaxed">
            {{ item.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
