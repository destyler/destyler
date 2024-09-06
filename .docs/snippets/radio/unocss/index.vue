<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@destyler/label'
import {
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupRoot,
} from '@destyler/radio'

const value = ref('default')

const items = [
  { value: 'default', label: 'Default' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
]
</script>

<template>
  <RadioGroupRoot
    v-model="value"
    grid="~"
    gap="2"
  >
    <div
      v-for="item in items"
      :key="item.value"
      flex="~"
      items="center"
      space="x-2"
    >
      <RadioGroupItem
        aspect="square"
        h="4"
        w="4"
        p="px"
        rounded="full"
        border="border primary"
        text="primary"
        ring-offset="background"
        focus="outline-none"
        focus-visible="ring-2 ring-ring ring-offset-2"
        cursor="disabled:not-allowed"
        op="disabled:50"
        :value="item.value"
      >
        <RadioGroupIndicator
          flex="~"
          items="center"
          justify="center"
        >
          <div
            bg="primary"
            w="3"
            h="3"
            rounded="full"
          />
        </RadioGroupIndicator>
      </RadioGroupItem>
      <Label
        text="sm black dark:white"
        font="medium"
        leading="none"
        peer-disabled="cursor-not-allowed op-70"
      >
        {{ item.label }}
      </Label>
    </div>
  </RadioGroupRoot>
</template>
