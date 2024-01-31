<script setup lang="ts">
import { ref } from 'vue'
import {
  DestylerSelectContent,
  DestylerSelectGroup,
  DestylerSelectIcon,
  DestylerSelectItem,
  DestylerSelectItemIndicator,
  DestylerSelectItemText,
  DestylerSelectLabel,
  DestylerSelectRoot,
  DestylerSelectScrollDownButton,
  DestylerSelectScrollUpButton,
  DestylerSelectTrigger,
  DestylerSelectValue,
  DestylerSelectViewport,
} from '../src'

const fruit = ref()

const options = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
</script>

<template>
  <DestylerSelectRoot v-model="fruit">
    <DestylerSelectTrigger
      class="flex h-9 w-[180px] items-center justify-between whitespace-nowrap rounded-md border border-#27272A bg-transparent px-3 py-2 text-sm shadow-sm ring-#09090B placeholder:text-#A1A1AA focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
    >
      <DestylerSelectValue placeholder="Select a fruit">
        {{ fruit }}
      </DestylerSelectValue>
      <DestylerSelectIcon :as-child="true">
        <DestylerIcon name="radix-icons:caret-sort" class="w-4 h-4 op-50" />
      </DestylerSelectIcon>
    </DestylerSelectTrigger>
    <DestylerSelectContent :side-offset="4" :autocapitalize="true" position="popper" class="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-#09090B text-#FAFAFA shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1">
      <DestylerSelectScrollUpButton class="flex cursor-default items-center justify-center py-1">
        <DestylerIcon name="radix-icons:chevron-up" />
      </DestylerSelectScrollUpButton>
      <DestylerSelectViewport
        class="p-1 w-full"
        style="height: var(--destyler_select_trigger_height); min-width: var(--destyler_select_trigger_width);"
      >
        <DestylerSelectGroup>
          <DestylerSelectLabel class="px-2 py-1.5 text-sm font-semibold">
            Fruits
          </DestylerSelectLabel>
          <DestylerSelectItem
            v-for="option in options"
            :key="option"
            :value="option"
            class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-#27272A focus:text-#FAFAFA data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            <span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
              <DestylerSelectItemIndicator>
                <DestylerIcon name="radix-icons:check" class="w-4 h-4" />
              </DestylerSelectItemIndicator>
              <DestylerSelectItemText>
                {{ option }}
              </DestylerSelectItemText>
            </span>
          </DestylerSelectItem>
        </DestylerSelectGroup>
      </DestylerSelectViewport>
      <DestylerSelectScrollDownButton class="flex cursor-default items-center justify-center py-1">
        <DestylerIcon name="radix-icons:chevron-down" />
      </DestylerSelectScrollDownButton>
    </DestylerSelectContent>
  </DestylerSelectRoot>
</template>
