<script setup lang="ts">
import { ref } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxViewport,
} from '../src'

type ArrayOrWrapped<T> = T extends any[] ? T : Array<T>

const props = defineProps<{
  open: boolean
  multiple: boolean
  displayValue: (val: string | number | boolean | Record<string, any>) => string
  filterFunction: (val: ArrayOrWrapped<string | number | boolean | Record<string, any>>, term: string) => ArrayOrWrapped<string | number | boolean | Record<string, any>>
}>()
const v = ref<any>(props.multiple ? [] : '')
const options = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek']

const open = ref(props.open)
</script>

<template>
  <ComboboxRoot v-bind="props" v-model="v" v-model:open="open" name="test">
    <ComboboxAnchor>
      <ComboboxInput placeholder="Placeholder..." />
      <ComboboxTrigger>
        <svg name="down">
          <path />
        </svg>
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxContent>
      <ComboboxViewport>
        <ComboboxEmpty />

        <ComboboxGroup>
          <ComboboxLabel>
            Fruits
          </ComboboxLabel>

          <ComboboxItem
            v-for="(option, index) in options" :key="index"
            :value="option"
          >
            <ComboboxItemIndicator>
              <svg name="check">
                <path />
              </svg>
            </ComboboxItemIndicator>
            <span>
              {{ option }}
            </span>
          </ComboboxItem>
          <ComboboxSeparator />
        </ComboboxGroup>

        <ComboboxGroup>
          <ComboboxLabel>
            Vegetables
          </ComboboxLabel>
          <ComboboxItem
            v-for="(option, index) in vegetables" :key="index"
            :value="option"
          >
            <ComboboxItemIndicator>
              check
            </ComboboxItemIndicator>
            <span>
              {{ option }}
            </span>
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
