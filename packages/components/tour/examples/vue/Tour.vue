<script setup lang="ts">
import { tourControls, tourData } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as tour from '../../index'
import '../style.css'

const controls = useControls(tourControls)

const [state, send] = useMachine(
  tour.machine({
    id: useId(),
    steps: tourData,
  }),
  {
    context: controls.context,
  },
)

const api = computed(() => tour.connect(state.value, send, normalizeProps))
const overlayVisible = computed(() => api.value.open && api.value.step)
const iframeContent = `<div class="tour__frame-inner"><h1 id="step-2a">Iframe Content</h1><p>Vue tours can highlight nodes rendered inside iframes.</p><p>Floating UI keeps positioning in sync.</p></div>`

function start() {
  api.value.start()
}
</script>

<template>
  <Layout>
    <main class="tour">
      <section>
        <button class="tour__start" @click="start">
          Start Tour
        </button>

        <div class="steps__container">
          <h3 id="step-1">
            Step 1 · Welcome
          </h3>

          <div class="overflow__container">
            <div class="h-200px" />
            <h3 id="step-2">
              Step 2 · Scroll-aware
            </h3>
            <div class="h-100px" />
          </div>

          <iframe class="tour__frame" title="tour-frame" :srcdoc="iframeContent" />

          <h3 id="step-3">
            Step 3 · Normal flow
          </h3>
          <h3 id="step-4">
            Step 4 · Near the bottom
          </h3>
        </div>
      </section>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" :omit="['steps']" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>

  <Teleport v-if="overlayVisible" to="body">
    <div>
      <div v-if="api.step?.backdrop" v-bind="api.getBackdropProps()" />
      <div v-bind="api.getSpotlightProps()" />
      <div v-bind="api.getPositionerProps()">
        <div v-bind="api.getContentProps()">
          <div v-if="api.step?.arrow" v-bind="api.getArrowProps()">
            <div v-bind="api.getArrowTipProps()" />
          </div>

          <p v-bind="api.getTitleProps()">
            {{ api.step?.title }}
          </p>
          <div v-bind="api.getDescriptionProps()">
            {{ api.step?.description }}
          </div>
          <div v-bind="api.getProgressTextProps()">
            {{ api.getProgressText() }}
          </div>

          <div v-if="api.step?.actions" class="tour button__group">
            <button
              v-for="action in api.step?.actions"
              :key="action.label"
              v-bind="api.getActionTriggerProps({ action })"
            >
              {{ action.label }}
            </button>
          </div>

          <button v-bind="api.getCloseTriggerProps()">
            ×
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
