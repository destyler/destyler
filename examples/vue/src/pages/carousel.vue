<script setup lang="ts">
import * as carousel from '@destyler/carousel'
import { carouselControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/carousel.css'

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
    class="carousel-root"
  >
    <div v-bind="api.getItemGroupProps()" class="carousel-item-group">
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
      class="carousel-control"
    >
      <button
        v-bind="api.getPrevTriggerProps()"
        class="carousel-trigger"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="m20 24l-10-8l10-8z" /></svg>
      </button>
      <div v-bind="api.getIndicatorGroupProps()" class="carousel-indicator-group">
        <button
          v-for="(_, index) in api.pageSnapPoints"
          :key="index"
          v-bind="api.getIndicatorProps({ index })"
          class="carousel-indicator"
        />
      </div>
      <button
        v-bind="api.getNextTriggerProps()"
        class="carousel-trigger"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="m12 8l10 8l-10 8z" /></svg>
      </button>
    </div>
  </div>
  <div class="carousel-other-controls">
    <button class="button" @click="api.scrollToIndex(1)">
      Scroll to 1
    </button>
    <button v-bind="api.getAutoplayTriggerProps()" class="button">
      {{ api.isPlaying ? 'Stop' : 'Play' }}
    </button>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
