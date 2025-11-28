<script setup lang="ts">
import { toastControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as toast from '../../index'
import Item from '../../snippets/Item.vue'
import '../style.css'

const controls = useControls(toastControls)

const [state, send] = useMachine(
  toast.group.machine({
    id: useId(),
    ...controls.context.value,
  }),
  {
    context: controls.context,
  },
)

const api = computed(() => toast.group.connect(state.value as any, send, normalizeProps))

function pushBasic(type: toast.Type, description?: string) {
  api.value.create({
    title: type === 'success' ? 'Deployment shipped' : 'Heads up',
    description: description
      ?? (type === 'error'
        ? 'We could not restart the worker nodes.'
        : 'Your teammates are waiting for approval.'),
    type,
  })
}

function pushPromise() {
  const task = new Promise<string>((resolve, reject) => {
    const shouldFail = Math.random() < 0.35
    setTimeout(() => {
      if (shouldFail)
        reject(new Error('Report generation failed.'))
      else resolve('Report generated and emailed to you.')
    }, 1800)
  })

  api.value.promise(task, {
    loading: { title: 'Generating report...', type: 'loading' },
    success: value => ({ title: 'Report ready', description: value, type: 'success' }),
    error: error => ({ title: 'Report failed', description: error.message, type: 'error' }),
  })
}
</script>

<template>
  <Layout>
    <main class="toast-demo">
      <section class="toast-demo__actions">
        <button @click="() => pushBasic('info', 'Production deploy has started.')">
          Info toast
        </button>
        <button class="secondary" @click="() => pushBasic('success')">
          Success toast
        </button>
        <button class="secondary" @click="() => pushBasic('error')">
          Error toast
        </button>
        <button class="ghost" @click="() => api.dismiss()">
          Dismiss all
        </button>
      </section>

      <section class="toast-demo__actions">
        <button @click="pushPromise">
          Promise toast
        </button>
        <button
          class="ghost"
          @click="() => api.create({ title: 'Nightly backup', description: 'Running in the background.', type: 'info', duration: 9000 })"
        >
          Long toast
        </button>
      </section>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>

    <Teleport to="body">
      <div
        v-for="placement in api.getPlacements()"
        :key="placement"
        data-layout="toast-examples"
        class="toast-demo__region"
        v-bind="api.getGroupProps({ placement })"
      >
        <Item
          v-for="toastActor in api.getToastsByPlacement(placement)"
          :key="toastActor.id"
          :actor="toastActor"
        />
      </div>
    </Teleport>
  </Layout>
</template>
