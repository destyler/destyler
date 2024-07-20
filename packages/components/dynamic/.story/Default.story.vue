<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { DynamicInput, DynamicItem, DynamicItemDelete, DynamicItemText, DynamicRoot } from '../src'

const modelValue = ref(['Test'])
</script>

<template>
  <Story title="Dynamic/Default" :layout="{ type: 'single', iframe: false }">
    <Variant title="default">
      <DynamicRoot
        v-model="modelValue"
        class="flex gap-2 items-center border p-2 rounded-lg bg-blackA3 w-[300px] flex-wrap border-blackA7"
      >
        <DynamicItem
          v-for="item in modelValue" :key="item" :value="item"
          class=" data-[disabled]:opacity-50 flex items-center justify-center gap-2 bg-green8 aria-[current=true]:bg-green9 rounded px-2 py-1"
        >
          <DynamicItemText class="text-sm" />
          <DynamicItemDelete>
            <Icon name="lucide:x" />
          </DynamicItemDelete>
        </DynamicItem>

        <DynamicInput placeholder="Anything..." class="focus:outline-none flex-1 rounded bg-transparent text-white placeholder:text-mauve10 px-1" />
      </DynamicRoot>
    </Variant>
  </Story>
</template>
