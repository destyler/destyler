<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import {
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from '../src'

const fruit = ref()

const options = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
</script>

<template>
  <SelectRoot v-model="fruit" :default-open="false">
    <SelectTrigger
      class="flex h-9 w-[180px] items-center justify-between whitespace-nowrap rounded-md border border-#E4E4E7 dark:border-#27272A bg-transparent px-3 py-2 text-sm shadow-sm ring-white dark:ring-#09090B placeholder:text-#A1A1AA focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
    >
      <SelectValue placeholder="Select a fruit">
        {{ fruit }}
      </SelectValue>
      <SelectIcon :as-child="true">
        <Icon name="radix-icons:caret-sort" class="w-4 h-4 op-50" />
      </SelectIcon>
    </SelectTrigger>
    <SelectContent :side-offset="4" :autocapitalize="true" position="popper" class="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-#E4E4E7 dark:border-#27272A bg-white dark:bg-#09090B text-#18181B dark:text-#FAFAFA shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ">
      <SelectScrollUpButton class="flex cursor-default items-center justify-center py-1">
        <Icon name="radix-icons:chevron-up" />
      </SelectScrollUpButton>
      <SelectViewport
        class="p-1 w-full"
        style="height: var(--destyler_select_trigger_height); min-width: var(--destyler_select_trigger_width);"
      >
        <SelectGroup>
          <SelectLabel class="px-2 py-1.5 text-sm font-semibold">
            Fruits
          </SelectLabel>
          <SelectItem
            v-for="option in options"
            :key="option"
            :value="option"
            class="relative cursor-pointer flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-#F4F4F5 focus:text-#18181B dark:focus:bg-#27272A dark:focus:text-#FAFAFA data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            <span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
              <SelectItemIndicator>
                <Icon name="radix-icons:check" class="w-4 h-4" />
              </SelectItemIndicator>
            </span>
            <SelectItemText>
              {{ option }}
            </SelectItemText>
          </SelectItem>
        </SelectGroup>
      </SelectViewport>
      <SelectScrollDownButton class="flex cursor-default items-center justify-center py-1">
        <Icon name="radix-icons:chevron-down" />
      </SelectScrollDownButton>
    </SelectContent>
  </SelectRoot>
</template>
