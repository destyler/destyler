<script setup lang="ts">
import { ref } from 'vue'
import {
  MenuAnchor,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuPortal,
  MenuRoot,
  MenuSeparator,
} from '../src'

const open = ref<boolean>(false)

const foodGroups = [
  {
    label: 'Fruits',
    foods: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'blueberry', label: 'Blueberry' },
      { value: 'grapes', label: 'Grapes' },
      { value: 'pineapple', label: 'Pineapple' },
    ],
  },
  {
    label: 'Vegetables',
    foods: [
      { value: 'aubergine', label: 'Aubergine' },
      { value: 'broccoli', label: 'Broccoli' },
      { value: 'carrot', label: 'Carrot', disabled: true },
      { value: 'courgette', label: 'Courgette' },
      { value: 'leek', label: 'Leek' },
    ],
  },
  {
    label: 'Meat',
    foods: [
      { value: 'beef', label: 'Beef' },
      { value: 'beef-with-sauce', label: 'Beef with sauce' },
      { value: 'chicken', label: 'Chicken' },
      { value: 'lamb', label: 'Lamb' },
      { value: 'pork', label: 'Pork' },
    ],
  },
  {
    foods: [
      { value: 'candies', label: 'Candies' },
      { value: 'chocolates', label: 'Chocolates' },
    ],
  },
]

function handleToggle(value: boolean) {
  if (!value)
    open.value = value
}
</script>

<template>
  <button @click="open = true">
    open
  </button>
  <MenuRoot :open="open" :modal="false" @update:open="handleToggle">
    <MenuAnchor :style="{ display: 'inline-block' }" />
    <MenuPortal>
      <MenuContent
        class="inline-block box-border min-w-[130px] bg-white border border-gray-100 rounded-[6px] p-[5px] shadow-md font-sans text-[13px] focus-within:border-black"
        align="start"
      >
        <MenuGroup v-for="(foodGroup, index) in foodGroups" :key="index">
          <MenuLabel
            v-if="foodGroup.label"
            class="flex items-center justify-between leading-[1] cursor-default select-none whitespace-nowrap h-[25px] px-[10px] text-black rounded-[3] text-gray-400 my-2"
          >
            {{ foodGroup.label }}
          </MenuLabel>
          <MenuItem
            v-for="(food, index) in foodGroup.foods"
            :key="index"
            class="flex items-center justify-between leading-[1] cursor-default select-none whitespace-nowrap h-[25px] px-[10px] text-black rounded-[3px] outline-none data-[highlighted]:bg-black data-[highlighted]:text-white data-[disabled]:text-gray-100"
          >
            {{ food.label }}
          </MenuItem>
          <MenuSeparator v-if="index < foodGroups.length - 1" />
        </MenuGroup>
      </MenuContent>
    </MenuPortal>
  </MenuRoot>
</template>
