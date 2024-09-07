<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from '@destyler/select'

const value = ref('')

const options = ref([
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Pineapple', value: 'pineapple' },
])
</script>

<template>
  <SelectRoot v-model="value">
    <SelectTrigger
      class="
      flex h-9 w-[180px] items-center justify-between whitespace-nowrap
      rounded-md border border-input bg-transparent px-3 py-2 text-sm
      shadow-sm ring-offset-background placeholder:text-muted-foreground
      focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed
      disabled:opacity-50 [&>span]:line-clamp-1 text-dark dark:text-light
      "
    >
      <SelectValue placeholder="Select a fruit" />
      <Icon name="carbon:chevron-sort" class="h-4 w-4 opacity-50" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        class="
        relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md
        border bg-popover text-popover-foreground shadow-md
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
        data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
        data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
        data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1
        data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1
        "
        position="popper"
      >
        <SelectScrollUpButton class="flex cursor-default items-center justify-center py-1">
          <Icon name="carbon:chevron-up" class="h-4 w-4" />
        </SelectScrollUpButton>
        <SelectViewport
          class="
          p-1 h-[var(--destyler-select-trigger-height)]
          w-full min-w-[var(--destyler-select-trigger-width)]
          "
        >
          <SelectGroup>
            <SelectLabel class="px-2 py-1.5 text-sm font-semibold">
              Fruits
            </SelectLabel>
            <SelectItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                <SelectItemIndicator>
                  <Icon name="carbon:checkmark" class="h-4 w-4" />
                </SelectItemIndicator>
              </span>
              <SelectItemText>
                {{ option.label }}
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectViewport>
        <SelectScrollDownButton class="flex cursor-default items-center justify-center py-1">
          <Icon name="carbon:chevron-down" class="h-4 w-4" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
