<script setup lang="ts">
import * as presence from '@destyler/presence'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, watch } from 'vue'

const { present, unmountOnExit } = defineProps<{
  present: boolean
  unmountOnExit?: boolean
}>()

const emit = defineEmits<{
  (e: 'exitComplete'): void
}>()

const [state, send] = useMachine(presence.machine({ present }), {
  context: { present, onExitComplete: () => emit('exitComplete') },
})

const api = computed(() =>
  presence.connect(state.value, send, normalizeProps),
)

const nodeRef = ref<HTMLElement | null>(null)

watch(nodeRef, () => {
  api.value.setNode(nodeRef.value)
})

const unmount = computed(() => !api.value.present && unmountOnExit)
</script>

<template>
  <div
    v-show="!unmount"
    ref="nodeRef"
    :hidden="!api.present"
    :data-state="api.skip ? undefined : present ? 'open' : 'closed'"
    v-bind="$attrs"
  />
</template>
