<script setup lang="ts">
  import * as carousel from "@destyler/carousel"
  import { normalizeProps, useMachine } from "@destyler/vue"
  import { computed,useId } from "vue"

  const items = [
    "https://elonehoo.me/coffee/01.jpeg",
    "https://elonehoo.me/coffee/02.jpeg",
  ]

  const [state, send] = useMachine(
    carousel.machine({ id: useId(), slideCount: items.length }),
  )

  const api = computed(() =>
    carousel.connect(state.value, send, normalizeProps),
  )
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div v-bind="api.getControlProps()">
      <button v-bind="api.getPrevTriggerProps()">Prev</button>
      <button v-bind="api.getNextTriggerProps()">Next</button>
    </div>

    <div v-bind="api.getItemGroupProps()">
      <div
        v-for="(image, index) in items"
        :key="index"
        v-bind="api.getItemProps({ index })"
      >
        <img :src="image" alt="" />
      </div>
    </div>

    <div v-bind="api.getIndicatorGroupProps()">
      <button
        v-for="(_, index) in api.pageSnapPoints"
        :key="index"
        v-bind="api.getIndicatorProps({ index })"
      ></button>
    </div>
  </div>
</template>
