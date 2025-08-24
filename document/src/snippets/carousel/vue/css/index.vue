<script setup lang="ts">
import * as carousel from '@destyler/carousel'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './index.css'

const items = [
  'https://images.unsplash.com/photo-1620315808304-66597517f188?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1620837953336-8274c0623a3c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1606318005254-bdb2bcd14d34?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1619806629131-959b8fdc50a1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1617982324703-442ecdc0fbab?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
]

const [state, send] = useMachine(
  carousel.machine({
    id: useId(),
    slideCount: items.length,
    spacing: '20px',
    slidesPerPage: 1,
  }))

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
        class="carousel-item"
      >
        <img :src="image" alt="" class="carousel-image">
      </div>
    </div>

    <!-- control -->
    <div
      v-bind="api.getControlProps()"
      class="carousel-control"
    >
      <button
        v-bind="api.getPrevTriggerProps()"
        class="carousel-prev-button"
      />
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
        class="carousel-next-button"
      />
    </div>
  </div>
</template>
