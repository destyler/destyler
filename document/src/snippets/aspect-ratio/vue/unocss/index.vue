<script setup lang="ts">
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'


const [state, send] = useMachine(aspectRatio.machine({ 
  id: useId(),
  ratio: 16 / 9,
}))
const api = computed(() =>
  aspectRatio.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <main>
    <div class="w-full! sm:w-75! overflow-hidden! rounded-md!">
      <div v-bind="api.getRootProps()">
        <div v-bind="api.getContentProps()">
          <img
            class="h-full! w-full! object-cover!"
            src="https://images.unsplash.com/photo-1498855926480-d98e83099315?w=300&dpr=2&q=80"
          >
        </div>
      </div>
    </div>
  </main>
</template>
