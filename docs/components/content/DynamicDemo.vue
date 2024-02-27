<script setup lang="ts">
import { ref } from 'vue'
import {
  DestylerDynamicInput,
  DestylerDynamicItem,
  DestylerDynamicItemDelete,
  DestylerDynamicItemText,
  DestylerDynamicRoot,
  DestylerIcon,
  DestylerLabel,
} from 'destyler'

const modelValue = ref(['Vue', 'Nuxt'])
</script>

<template>
  <div class="space-y-2 flex flex-col items-start">
    <DestylerLabel class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-left">
      Topics
    </DestylerLabel>
    <DestylerDynamicRoot
      v-model="modelValue"
      class="w-full flex gap-3 flex-col"
    >
      <div class="rounded-md max-w-[450px] flex flex-wrap gap-2">
        <DestylerDynamicItem v-for="item in modelValue" :key="item" :value="item" class="dark:text-#09090B text-#FAFAFA flex shadow-md items-center justify-center gap-2 bg-#18181B dark:bg-#FAFAFA rounded p-1">
          <DestylerDynamicItemText class="text-sm pl-1" />
          <DestylerDynamicItemDelete class="p-0.5 rounded bg-transparent hover:bg-#f4f4f5 dark:hover:bg-#27272a hover:bg-op-30! dark:hover:bg-op-30!">
            <DestylerIcon name="radix-icons:cross-2" />
          </DestylerDynamicItemDelete>
        </DestylerDynamicItem>
      </div>
      <div class="w-full">
        <DestylerDynamicInput placeholder="Fruits..." class="flex h-10 rounded-md border-solid border-b border-black border-op-9 dark:border-white dark:border-op-9 bg-white dark:bg-#09090B px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium dark:placeholder:text-#A1A1AA placeholder:text-#71717A focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-#D4D4D8 dark:focus-visible:ring-#09090B focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full sm:min-w-[450px]" />
      </div>
    </DestylerDynamicRoot>
  </div>
</template>
