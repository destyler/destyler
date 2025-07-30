<script setup lang="ts">
import * as hoverCard from '@destyler/hover-card'
import { hoverCardControls } from '@destyler/shared-private'
import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '@destyler/shared-private/styles/hover-card.css'

const controls = useControls(hoverCardControls)

const [state, send] = useMachine(hoverCard.machine({ id: useId() }), {
  context: controls.context,
})

const api = computed(() => hoverCard.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="hover-card-root">
    <a
      href="https://twitter.com/elonehoo"
      target="_blank"
      v-bind="api.getTriggerProps()"
      class="hover-card-trigger"
    >
      Twitter
    </a>
    <div v-bind="api.getPositionerProps()">
      <div
        v-bind="api.getContentProps()"
        class="hover-card-content"
      >
        <div class="hover-card-context">
          <img
            src="https://github.com/elonehoo.png"
            alt="Profile"
            class="hover-card-avatar"

          >
          <div>
            <h3 >
              elonehoo
            </h3>
            <p >
              Frontend Developer
            </p>
          </div>
        </div>
        <div >
          Follow me on Twitter for web development tips and updates!
        </div>
        <div >
          @elonehoo
        </div>
      </div>
    </div>
  </div>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
