<script setup lang="ts">
import {
  Button,
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
} from 'destyler'

const hoverState = ref(false)
</script>

<template>
  <HoverCardRoot v-model:open="hoverState">
    <HoverCardTrigger :as-child="true">
      <Button
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-#18181B dark:text-#FAFAFA underline-offset-4 hover:underline h-9 px-4 py-2"
      >
        Nuxt
      </Button>
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        class="z-50 w-80 rounded-md border border-black border-op-9 dark:border-white dark:border-op-9 bg-#FFFFFF dark:bg-#09090B p-4 text-#09090B dark:text-#FAFAFA shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        :side-offset="5"
      >
        <div class="flex justify-between space-x-4">
          <div class="space-y-1">
            <h4 class="text-sm font-semibold">
              nuxt.js
            </h4>
            <p class="text-sm">
              Nuxt is a free and open-source framework with an intuitive and extendable way to create type-safe, performant and production-grade full-stack web applications and websites with Vue.js.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
