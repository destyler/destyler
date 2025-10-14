<script setup lang="ts">
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as toast from '../index'
import Item from './Item.vue'
import './style.css'

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
    title: 'What to say?',
    type: 'info',
  })
}
</script>

<template>
  <div>
    <button class="btn" @click="handleNotify">
      Notify
    </button>

    <Teleport to="body">
      <div v-for="placement in api.getPlacements()" data-layout="sinppets" :key="placement" v-bind="api.getGroupProps({ placement })">
        <Item
          v-for="toast in api.getToastsByPlacement(placement)"
          :key="toast.id"
          :actor="toast"
        />
      </div>
    </Teleport>
  </div>
</template>
