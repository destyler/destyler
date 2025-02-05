<script setup lang="ts">
  import * as presence from "@destyler/presence"
  import { useMachine, normalizeProps } from "@destyler/vue"
  import { computed, watch, ref } from "vue"

  const {present, unmountOnExit } = defineProps<{
    present: boolean
    unmountOnExit?: boolean
  }>()

  const emit = defineEmits<{
    (e: "exit-complete"): void
  }>()

  const [state, send] = useMachine(presence.machine({ present }), {
    context: { present, onExitComplete: () => emit("exit-complete") },
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
    :hidden="!api.present"
    :data-state="api.skip ? undefined : present ? 'open' : 'closed'"
    ref="nodeRef"
    v-bind="$attrs"
  />
</template>
