<script setup lang="ts">
import * as toast from '@destyler/toast'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/toast.css'

const [state, send] = useMachine(
  toast.group.machine({
    id: useId(),
    placement: 'bottom-end',
    overlap: true,
    removeDelay: 200,
  }),
)

const api = computed(() => toast.group.connect(state.value as any, send, normalizeProps))

function handleNotify() {
  api.value.create({
    title: 'Loading',
    type: 'info',
  })
}
</script>

<template>
  <div>
    <button class="create-trigger" @click="handleNotify">
      Notify (Info)
    </button>

    <Teleport to="body">
      <div v-for="placement in api.getPlacements()" :key="placement" v-bind="api.getGroupProps({ placement })">
        <ToastItem
          v-for="toast in api.getToastsByPlacement(placement)"
          :key="toast.id"
          :actor="toast"
        />
      </div>
    </Teleport>
  </div>
</template>
