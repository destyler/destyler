<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { ref } from 'vue'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from '../src'

const fruit = ref('')

const options = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
</script>

<template>
  <div>
    <SelectRoot
      v-model="fruit"
      name="test"
      aria-label="Fruits"
    >
      <SelectTrigger
        aria-label="Customise options"
      >
        <SelectValue placeholder="Please select a fruit">
          {{ fruit }}
        </SelectValue>
        <Icon name="radix-icons:chevron-down" class="h-4 w-4" />
      </SelectTrigger>

      <SelectPortal to="#here">
        <SelectContent
          :side-offset="5"
          position="popper"
        >
          <SelectViewport>
            <SelectLabel>
              Fruits
            </SelectLabel>
            <SelectGroup>
              <SelectItem
                v-for="(option, index) in options"
                :key="index"
                :value="option"
              >
                <SelectItemIndicator>
                  <Icon name="radix-icons:check" />
                </SelectItemIndicator>
                <SelectItemText>
                  {{ option }}
                </SelectItemText>
              </SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectLabel>
              Vegetables
            </SelectLabel>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>

    <div id="here" />
  </div>
</template>
