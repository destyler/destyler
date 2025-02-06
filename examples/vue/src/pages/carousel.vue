<script setup lang="ts">
import * as carousel from '@destyler/carousel'
import { carouselControls } from '@destyler/shared'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useControls } from '../composables/useControls'

const controls = useControls(carouselControls)

const items = [
  'https://elonehoo.me/coffee/01.jpeg',
  'https://elonehoo.me/coffee/02.jpeg',
]

const [state, send] = useMachine(
  carousel.machine({
    id: useId(),
    slideCount: items.length,
    spacing: '20px',
    slidesPerPage: 1,
  }),
  {
    context: controls.context,
  },
)

const api = computed(() =>
  carousel.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div
    v-bind="api.getRootProps()"
    class="flex items-center justify-center flex-col gap-4 w-100 relative"
  >
    <div v-bind="api.getItemGroupProps()" class="rounded-xl">
      <div
        v-for="(image, index) in items"
        :key="index"
        v-bind="api.getItemProps({ index })"
      >
        <img :src="image" alt="">
      </div>
    </div>

    <!-- control -->
    <div
      v-bind="api.getControlProps()"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center bg-dark rounded-md px-2 py-1"
    >
      <button
        v-bind="api.getPrevTriggerProps()"
        class="w-4 h-4 text-light i-carbon:caret-left"
      />
      <div v-bind="api.getIndicatorGroupProps()" class="flex gap-2 mx-2">
        <button
          v-for="(_, index) in api.pageSnapPoints"
          :key="index"
          v-bind="api.getIndicatorProps({ index })"
          class="w-2 h-2 bg-gray rounded-full data-[current]:bg-green"
        />
      </div>
      <button
        v-bind="api.getNextTriggerProps()"
        class="w-4 h-4 text-light i-carbon:caret-right"
      />
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
