<script setup lang="ts">
import { ref } from 'vue'
import {
  DestylerDynamicInput,
  DestylerDynamicItem,
  DestylerDynamicItemDelete,
  DestylerDynamicItemText,
  DestylerDynamicRoot,
  DestylerIcon,
} from 'destyler'

const modelValue = ref(['Vue', 'Nuxt'])
</script>

<template>
  <DestylerDynamicRoot
    v-model="modelValue"
    class="flex gap-2 items-center border p-2 rounded-lg w-full max-w-[480px] flex-wrap border-solid border-b border-black border-op-9 dark:border-white dark:border-op-9 "
  >
    <DestylerDynamicItem v-for="item in modelValue" :key="item" :value="item" class="dark:text-#09090B text-#FAFAFA flex shadow-md items-center justify-center gap-2 bg-#18181B dark:bg-#FAFAFA rounded p-1">
      <DestylerDynamicItemText class="text-sm pl-1" />
      <DestylerDynamicItemDelete class="p-0.5 rounded bg-transparent hover:bg-#f4f4f5 dark:hover:bg-#27272a hover:bg-op-30! dark:hover:bg-op-30!">
        <DestylerIcon name="radix-icons:cross-2" />
      </DestylerDynamicItemDelete>
    </DestylerDynamicItem>

    <DestylerDynamicInput placeholder="Fruits..." class="text-sm focus:outline-none flex-1 rounded text-#09090B dark:text-#FAFAFA bg-transparent placeholder:text-#71717A dark:placeholder:text-#A1A1A px-1" />
  </DestylerDynamicRoot>
</template>
