<script setup lang="ts">
import * as hoverCard from '@destyler/hover-card'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(hoverCard.machine({ id: useId() }))

const api = computed(() => hoverCard.connect(state.value, send, normalizeProps))
</script>

<template>
  <div class="mt-0!">
    <a
      href="https://twitter.com/elonehoo"
      target="_blank"
      v-bind="api.getTriggerProps()"
      class="focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 
      font-medium rounded-md text-sm gap-x-2.5 px-3.5 py-2.5 shadow-sm text-primary-foreground! 
      bg-primary! hover:bg-primary/90! focus-visible:outline-2 focus-visible:outline-offset-2 
      focus-visible:outline-light-500 group-data-[theme=dark]:focus-visible:outline-light-400 
      inline-flex items-center no-underline!"
    >
      Hover
    </a>
    <Teleport v-if="api.open" to="body">
      <div v-bind="api.getPositionerProps()">
        <div
          v-bind="api.getContentProps()"
          class="z-50 w-64 rounded-md border border-border! bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in zoom-in-90"
        >
          <div class="flex gap-4 mt-0!">
            <img
              src="https://github.com/elonehoo.png"
              alt="Profile"
              class="h-12 w-12 rounded-full border border-border!"
            >
            <div class="space-y-1">
              <h4 class="text-sm font-semibold">
                elonehoo
              </h4>
              <p class="text-sm text-muted-foreground">
                Frontend Developer
              </p>
            </div>
          </div>
          <div class="mt-4 text-sm text-muted-foreground">
            I hope every sunny afternoon can be wasted.
          </div>
          <div class="mt-4 flex items-center text-sm text-muted-foreground">
            <div class="w-4 h-4 i-carbon:logo-x mr-2" />
            @elonehoo
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
