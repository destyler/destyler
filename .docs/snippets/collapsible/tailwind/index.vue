<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@destyler/button'
import { Icon } from '@destyler/icon'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from '@destyler/collapsible'

const isOpen = ref<boolean>(false)
</script>

<template>
  <CollapsibleRoot v-model:open="isOpen" class="w-[350px] space-y-2">
    <div class="flex items-center justify-between space-x-4 ">
      <h4 class="text-sm font-semibold text-primary!">
        The best framework
      </h4>
      <CollapsibleTrigger as-child>
        <Button class="w-9! p-0! hover:bg-[#F0F0F1] text-[#18181B] dark:hover:bg-[#27272A] dark:text-[#FAFAFA] inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 cursor-pointer">
          <Icon name="radix-icons:caret-sort" class="h-4 w-4" />
          <span class="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
    </div>
    <div class="rounded-md border text-dark dark:text-light px-4 py-3 font-mono text-sm border-[#E4E4E7] dark:border-[#27272A]">
      destyler
    </div>
    <CollapsibleContent class="space-y-2 overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
      <div class="rounded-md border text-dark dark:text-light px-4 py-3 font-mono text-sm border-[#E4E4E7] dark:border-[#27272A]">
        vue
      </div>
      <div class="rounded-md border text-dark dark:text-light px-4 py-3 font-mono text-sm border-[#E4E4E7] dark:border-[#27272A]">
        nuxt
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
