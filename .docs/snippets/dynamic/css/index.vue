<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@destyler/label'
import { Icon } from '@destyler/icon'
import { DynamicInput, DynamicItem, DynamicItemDelete, DynamicItemText, DynamicRoot } from '@destyler/dynamic'
import './style.css'

const modelValue = ref(['Vue', 'Destyler UI'])
</script>

<template>
  <div class="box">
    <Label
      class="label"
    >
      Topics
    </Label>
    <DynamicRoot
      v-model="modelValue"
      class="dynamicRoot"
    >
      <div class="dynamicItemBox">
        <DynamicItem
          v-for="item in modelValue"
          :key="item"
          :value="item"
          class="dynamicItem"
        >
          <DynamicItemText class="dynamicItemText" />
          <DynamicItemDelete class="dynamicItemDelete">
            <Icon name="radix-icons:cross-2" />
          </DynamicItemDelete>
        </DynamicItem>
      </div>
      <div class="dynamicInputBox">
        <DynamicInput
          placeholder="Fruits..."
          class="dynamicInput"
        />
      </div>
    </DynamicRoot>
  </div>
</template>
