<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { DynamicInput, DynamicItem, DynamicItemDelete, DynamicItemText, DynamicRoot } from '../src'

export interface TestProps {
  addOnTab?: boolean
  addOnBlur?: boolean
}

withDefaults(defineProps<TestProps>(), {
  addOnBlur: false,
  addOnTab: false,
})

const modelValue = ref(['Test'])
</script>

<template>
  <DynamicRoot
    v-model="modelValue"
    :add-on-blur="addOnBlur"
    :add-on-tab="addOnTab"
  >
    <DynamicItem v-for="item in modelValue" :key="item" :value="item">
      <DynamicItemText>
        {{ item }}
      </DynamicItemText>
      <DynamicItemDelete>
        <Icon name="lucide:x" />
      </DynamicItemDelete>
    </DynamicItem>

    <DynamicInput placeholder="Anything..." />
  </DynamicRoot>
</template>
