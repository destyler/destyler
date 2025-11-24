<script setup lang="ts">
import * as separator from '@destyler/separator'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId } from 'vue'
import '../style.css'

const items = ref([
  { label: 'Blog', value: 'blog' },
  { label: 'Docs', value: 'docs' },
  { label: 'Source', value: 'source' },
])

const [state, send] = useMachine(separator.machine({ id: useId() }))
const api = computed(() => separator.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <section class="separator-example">
      <header class="separator-example__header">
        <p class="separator-example__title">
          Destyler UI
        </p>
        <p class="separator-example__subtitle">
          Unstyled components for Vue.
        </p>
      </header>

      <div
        v-bind="api.getRootProps()"
        class="separator-line separator-example__divider"
      />

      <nav class="separator-example__nav" aria-label="Secondary">
        <template v-for="(item, index) in items" :key="item.value">
          <span class="separator-example__nav-item">{{ item.label }}</span>
          <div
            v-if="index < items.length - 1"
            v-bind="api.getRootProps('vertical')"
            class="separator-line separator-example__divider--vertical"
          />
        </template>
      </nav>
    </section>

    <Toolbar viz>
      <StateVisualizer :state="state" />
    </Toolbar>
  </Layout>
</template>
