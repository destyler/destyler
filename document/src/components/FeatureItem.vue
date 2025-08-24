<script setup lang="ts">
import { until, useElementVisibility } from '@vueuse/core'
import { computed, effectScope, onMounted, ref } from 'vue'

const el = ref<HTMLDivElement>()
const state = ref(0)

function reset() {
  state.value = 0
  setTimeout(() => {
    state.value = Math.random() > 0.9 ? 2 : 1
    if (state.value === 2) {
      setTimeout(reset, 1000)
    }
  }, Math.round(Math.random() * 3000) + 400)
}

const color = computed(() => {
  return {
    '--vp-c-brand-1': state.value === 1
      ? '#66ba1c'
      : state.value === 2
        ? 'rgba(248, 113, 113)'
        : 'rgba(250, 204, 21)',
  } as any
})

const scope = effectScope()

const visibility = scope.run(() => useElementVisibility(el))

onMounted(async () => {
  await until(visibility).toBe(true)

  scope.stop()
  reset()
})
</script>

<template>
  <li :style="color">
    <div
      ref="el"
      class="relative my-a mr-1 w-5 h-5 flex-none align-mid"
    >
      <div class="absolute transition duration-300 mt-0!" :class="state ? 'flip' : ''">
        <div class="i-carbon:circle-dash animate-spin animate-2s text-yellow4 w-5 h-5" />
      </div>
      <div class="absolute transition duration-300 mt-0!" :class="state === 2 ? '' : 'flip'">
        <div class="text-red4 w-5 h-5 i-carbon:close-outline" />
      </div>
      <div class="absolute transition duration-300 mt-0!" :class="state === 1 ? '' : 'flip'">
        <div class="text-$vp-c-brand-1 i-carbon:checkmark-outline w-5 h-5" />
      </div>
    </div>
    <div class="font-bold mt-0! mb-0!">
      <slot />
    </div>
  </li>
</template>

<style>
.flip {
  transform: rotateY(90deg);
}
</style>
