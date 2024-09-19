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
      flex="~"
      h="9"
      w="180px"
      items="center"
      justify="between"
      whitespace="nowrap"
      rounded="md"
      border="~ input"
      bg="transparent"
      p="x-3 y-2"
      text="sm placeholder:muted-foreground dark dark:light"
      shadow="sm"
      ring-offset="background"
      outline="focus:none"
      ring="focus:1"
      cursor="disabled:not-allowed"
      op="disabled:50"
      line="[&>span]:clamp-1"
    >
      <SelectValue placeholder="Select a fruit" />
      <Icon name="carbon:chevron-sort" class="h-4 w-4 opacity-50" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        relative="~"
        z="50"
        max-h="96"
        min-w="8rem"
        overflow="hidden"
        rounded="md"
        border="~"
        bg="popover"
        text="popover-foreground"
        shadow="md"
        class="
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
        <SelectScrollUpButton
          flex="~"
          cursor="default"
          items="center"
          justify="center"
          p="y-1"
        >
          <Icon name="carbon:chevron-up" h="4" w="4" />
        </SelectScrollUpButton>
        <SelectViewport
          p="1"
          h="[var(--destyler-select-trigger-height)]"
          w="full"
          min-w="[var(--destyler-select-trigger-width)]"
        >
          <SelectGroup>
            <SelectLabel
              p="x-2 y-1.5"
              text="sm"
              font="semibold"
            >
              Fruits
            </SelectLabel>
            <SelectItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              relative="~"
              flex="~"
              w="full"
              cursor="pointer"
              select="none"
              items="center"
              rounded="sm focus:accent-foreground"
              p="y-1.5 l-2 r-8"
              text="sm"
              outline="none"
              bg="focus:accent"
              pointer-events="data-[disabled]:none"
              op="data-[disabled]:50"
            >
              <SelectItemText>
                {{ option.label }}
              </SelectItemText>
              <span
                absolute="~"
                right="2"
                flex="~"
                h="3.5"
                w="3.5"
                items="center"
                justify="center"
              >
                <SelectItemIndicator>
                  <Icon name="carbon:checkmark" h="4" w="4" />
                </SelectItemIndicator>
              </span>
            </SelectItem>
          </SelectGroup>
        </SelectViewport>
        <SelectScrollDownButton
          flex="~"
          cursor="default"
          items="center"
          justify="center"
          p="y-1"
        >
          <Icon name="carbon:chevron-down" h="4" w="4" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
