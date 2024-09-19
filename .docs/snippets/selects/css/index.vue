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
      class="select-trigger"
    >
      <SelectValue placeholder="Select a fruit" />
      <Icon name="carbon:chevron-sort" class="icon op-50" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        class="select-content"
        position="popper"
      >
        <SelectScrollUpButton class="select-scroll-up-button">
          <Icon name="carbon:chevron-up" class="icon" />
        </SelectScrollUpButton>
        <SelectViewport
          class="select-viewport"
        >
          <SelectGroup>
            <SelectLabel class="select-label">
              Fruits
            </SelectLabel>
            <SelectItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              class="select-item"
            >
              <span class="span">
                <SelectItemIndicator>
                  <Icon name="carbon:checkmark" class="icon" />
                </SelectItemIndicator>
              </span>
              <SelectItemText>
                {{ option.label }}
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectViewport>
        <SelectScrollDownButton class="select-scroll-down-button">
          <Icon name="carbon:chevron-down" class="icon" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
