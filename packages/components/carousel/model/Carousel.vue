<script setup lang="ts">
import { carouselControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as carousel from '../index'

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
    autoplay: false,
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
  >
    <div v-bind="api.getItemGroupProps()">
      <div
        v-for="(image, index) in items"
        :key="index"
        v-bind="api.getItemProps({ index })"
      >
        <img :src="image" alt="">
      </div>
    </div>
    <button @click="api.scrollToIndex(1)">
      Scroll to 1
    </button>
    <div
      v-bind="api.getControlProps()"
    >
      <button v-bind="api.getAutoplayTriggerProps()">
        {{ api.isPlaying ? 'Stop' : 'Play' }}
      </button>
      <button
        v-bind="api.getPrevTriggerProps()"
      />
      <div v-bind="api.getIndicatorGroupProps()">
        <button
          v-for="(_, index) in api.pageSnapPoints"
          :key="index"
          v-bind="api.getIndicatorProps({ index })"
        />
      </div>
      <button
        v-bind="api.getNextTriggerProps()"
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
