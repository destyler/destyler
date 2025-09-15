<script setup lang="ts">
import * as hoverCard from '@destyler/hover-card'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import '../../styles/components/hover-card.css'

const [state, send] = useMachine(hoverCard.machine({ id: useId() }))

const api = computed(() => hoverCard.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="mt-0!">
    <a
      href="https://twitter.com/elonehoo"
      target="_blank"
      v-bind="api.getTriggerProps()"
    >
      Hover
    </a>
    <Teleport v-if="api.open" to="body">
      <div v-bind="api.getPositionerProps()" data-layout="sinppets">
        <div v-bind="api.getContentProps()">
          <div>
            <img
              src="https://github.com/elonehoo.png"
              alt="Profile"
            >
            <div>
              <h4>
                elonehoo
              </h4>
              <p>
                Frontend Developer
              </p>
            </div>
          </div>
          <div>
            I hope every sunny afternoon can be wasted.
          </div>
          <div>
            <div />
            @elonehoo
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
