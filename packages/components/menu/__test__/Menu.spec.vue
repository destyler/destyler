<script setup lang="ts">
import { DestylerMenuGroup, DestylerMenuItem, DestylerMenuLabel, DestylerMenuSeparator } from '../src'
import DestylerMenuWithAnchor from './MenuWithAnchor.spec.vue'

const emits = defineEmits(['select'])

function handleSelect() {
}

const foodGroups: Array<{
  label?: string
  foods: Array<{ value: string, label: string, disabled?: boolean }>
}> = [
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
</script>

<template>
  <DestylerMenuWithAnchor>
    <DestylerMenuGroup v-for="(foodGroup, index) in foodGroups" :key="index">
      <DestylerMenuLabel
        v-if="foodGroup.label"
      >
        {{ foodGroup.label }}
      </DestylerMenuLabel>
      <DestylerMenuItem
        v-for="(food, index) in foodGroup.foods"
        :key="index"
        @select="handleSelect(); emits('select', $event)"
      >
        {{ food.label }}
      </DestylerMenuItem>
      <DestylerMenuSeparator v-if="index < foodGroups.length - 1" />
    </DestylerMenuGroup>
  </DestylerMenuWithAnchor>
</template>
