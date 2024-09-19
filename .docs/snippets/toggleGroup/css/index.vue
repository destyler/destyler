<script setup lang="ts">
import { ref } from 'vue'
import { ToggleGroupItem, ToggleGroupRoot } from '@destyler/toggle'
import { Icon } from '@destyler/icon'
import './style.css'

const value = ref<string[]>(['bold'])

const options = ref<{ value: string, icon: string }[]>([
  {
    value: 'bold',
    icon: 'radix-icons:font-bold',
  },
  {
    value: 'italic',
    icon: 'radix-icons:font-italic',
  },
  {
    value: 'line',
    icon: 'radix-icons:underline',
  },
])
</script>

<template>
  <ToggleGroupRoot
    v-model="value"
    class="root"
    type="multiple"
  >
    <ToggleGroupItem
      v-for="option in options" :key="option.value" :value="option.value"
      class="toggle"
    >
      <Icon :name="option.icon" class="icon" />
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
