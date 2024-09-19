<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@destyler/label'
import { Icon } from '@destyler/icon'
import { DynamicInput, DynamicItem, DynamicItemDelete, DynamicItemText, DynamicRoot } from '@destyler/dynamic'

const modelValue = ref(['Vue', 'Destyler UI'])
</script>

<template>
  <div class="space-y-2 flex flex-col items-start">
    <Label class="text-sm text-primary font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-left">
      Topics
    </Label>
    <DynamicRoot
      v-model="modelValue"
      class="w-full flex gap-3 flex-col"
    >
      <div class="rounded-md max-w-450px flex flex-wrap gap-2">
        <DynamicItem
          v-for="item in modelValue"
          :key="item"
          :value="item"
          class="
          text-primary-foreground flex
          shadow-md items-center justify-center gap-2
          bg-primary rounded p-1"
        >
          <DynamicItemText class="text-sm pl-1" />
          <DynamicItemDelete class="p-0.5 rounded bg-transparent hover:bg-accent hover:bg-op-10">
            <Icon name="radix-icons:cross-2" />
          </DynamicItemDelete>
        </DynamicItem>
      </div>
      <div class="w-450px text-primary">
        <DynamicInput
          placeholder="Fruits..."
          class="
          flex h-10 w-full rounded-md
          border border-input
          bg-background px-3 py-2 text-sm
          ring-offset-background file:border-0 file:bg-transparent
          file:text-sm file:font-medium placeholder:text-muted-foreground
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </DynamicRoot>
  </div>
</template>
