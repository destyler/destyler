<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@destyler/label'
import {
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupRoot,
} from '@destyler/radio'
import './style.css'

const value = ref('default')

const items = [
  { value: 'default', label: 'Default' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
]
</script>

<template>
  <RadioGroupRoot v-model="value" class="radio-group-root">
    <div v-for="item in items" :key="item.value" class="radio-item space-x-2">
      <RadioGroupItem
        class="radio-group-item"
        :value="item.value"
      >
        <RadioGroupIndicator class="radio-group-indicator">
          <div class="check" />
        </RadioGroupIndicator>
      </RadioGroupItem>
      <Label class="label">
        {{ item.label }}
      </Label>
    </div>
  </RadioGroupRoot>
</template>
