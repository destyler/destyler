<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { DestylerDynamicInput, DestylerDynamicItem, DestylerDynamicItemDelete, DestylerDynamicItemText, DestylerDynamicRoot } from '../src'

const modelValue = ref(['Apple', 'Banana'])
</script>

<template>
  <DestylerDynamicRoot
    v-model="modelValue"
    class="flex gap-2 items-center border p-2 rounded-lg w-full max-w-[480px] flex-wrap border-#00000080 bg-white"
  >
    <DestylerDynamicItem v-for="item in modelValue" :key="item" :value="item" class="text-white flex shadow-md items-center justify-center gap-2 bg-#2F7C57 aria-[current=true]:bg-#30A46C rounded p-1">
      <DestylerDynamicItemText class="text-sm pl-1" />
      <DestylerDynamicItemDelete class="p-0.5 rounded bg-transparent hover:bg-#00000033">
        <Icon icon="lucide:x" />
      </DestylerDynamicItemDelete>
    </DestylerDynamicItem>

    <DestylerDynamicInput placeholder="Fruits..." class="text-sm focus:outline-none flex-1 rounded text-#30A46C bg-transparent placeholder:text-#6F6D78 px-1" />
  </DestylerDynamicRoot>
</template>
