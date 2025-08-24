<script setup lang="ts">
import * as collapse from '@destyler/collapse'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

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
    class="flex flex-col w-full justify-center items-center mt-4"
  >
    <div
      v-for="item in data"
      :key="item.title"
      v-bind="api.getItemProps({ value: item.title })"
      class="border-b border-primary/15 w-full mt-0"
    >
      <h3 class="flex">
        <button
          v-bind="api.getItemTriggerProps({ value: item.title })"
          class="group cursor-pointer text-primary/80 flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline"
        >
          <span>{{ item.title }}</span>
          <div
            class="h-4 w-4 shrink-0 text-accent-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
            :style="{
              backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"currentColor\" d=\"M16 22L6 12l1.4-1.4 8.6 8.6 8.6-8.6L26 12z\"/></svg>\')',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }"
          />
        </button>
      </h3>
      <div
        v-bind="api.getItemContentProps({ value: item.title })"
        class="overflow-hidden text-black dark:text-white text-sm mt-0"
      >
        <div class="pb-4 pt-0">
          <p class="text-muted-foreground mt-0">
            {{ item.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
