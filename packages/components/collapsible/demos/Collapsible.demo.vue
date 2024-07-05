<script setup lang="ts">
import { ref } from 'vue'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from '../src'

const isOpen = ref<boolean>(false)
</script>

<template>
  <CollapsibleRoot v-model:open="isOpen" class="w-[350px] space-y-2">
    <div class="flex items-center justify-between space-x-4 px-4">
      <h4 class="text-sm font-semibold">
        The best framework
      </h4>
      <CollapsibleTrigger as-child>
        <button class="w-9! p-0! hover:bg-#F4F4F5 hover:text-#18181B dark:hover:bg-#27272A dark:hover:text-#FAFAFA inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 cursor-pointer">
          >
          <span class="sr-only">Toggle</span>
        </button>
      </CollapsibleTrigger>
    </div>
    <div class="rounded-md border px-4 py-3 font-mono text-sm border-#E4E4E7 dark:border-#27272A">
      vue
    </div>
    <CollapsibleContent class="space-y-2 overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
      <div class="rounded-md border px-4 py-3 font-mono text-sm border-#E4E4E7 dark:border-#27272A">
        nuxt
      </div>
      <div class="rounded-md border px-4 py-3 font-mono text-sm border-#E4E4E7 dark:border-#27272A">
        destyler
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>

<style scoped>
.data-\[state\=open\]\:animate-collapsible-down[data-state=open] {
    animation: collapsible-down .2s ease-in-out
}
.data-\[state\=closed\]\:animate-collapsible-up[data-state=closed] {
    animation: collapsible-up .2s ease-in-out
}
@keyframes collapsible-up {
  0% {
    height: var(--destyler_collapsible_content_height)
  }
  to {
    height: 0
  }
}

@keyframes collapsible-down {
  0% {
    height: 0
  }
  to {
    height: var(--destyler_collapsible_content_height)
  }
}
</style>
