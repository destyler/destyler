<script setup lang="ts">
import { ref } from 'vue'
import {
  DestylerComboboxAnchor,
  DestylerComboboxContent,
  DestylerComboboxEmpty,
  DestylerComboboxGroup,
  DestylerComboboxInput,
  DestylerComboboxItem,
  DestylerComboboxItemIndicator,
  DestylerComboboxLabel,
  DestylerComboboxRoot,
  DestylerComboboxSeparator,
  DestylerComboboxTrigger,
  DestylerComboboxViewport,
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
  <DestylerComboboxRoot v-bind="props" v-model="v" v-model:open="open" name="test">
    <DestylerComboboxAnchor>
      <DestylerComboboxInput placeholder="Placeholder..." />
      <DestylerComboboxTrigger>
        <svg name="down">
          <path />
        </svg>
      </DestylerComboboxTrigger>
    </DestylerComboboxAnchor>
    <DestylerComboboxContent>
      <DestylerComboboxViewport>
        <DestylerComboboxEmpty />

        <DestylerComboboxGroup>
          <DestylerComboboxLabel>
            Fruits
          </DestylerComboboxLabel>

          <DestylerComboboxItem
            v-for="(option, index) in options" :key="index"
            :value="option"
          >
            <DestylerComboboxItemIndicator>
              <svg name="check">
                <path />
              </svg>
            </DestylerComboboxItemIndicator>
            <span>
              {{ option }}
            </span>
          </DestylerComboboxItem>
          <DestylerComboboxSeparator />
        </DestylerComboboxGroup>

        <DestylerComboboxGroup>
          <DestylerComboboxLabel>
            Vegetables
          </DestylerComboboxLabel>
          <DestylerComboboxItem
            v-for="(option, index) in vegetables" :key="index"
            :value="option"
          >
            <DestylerComboboxItemIndicator>
              check
            </DestylerComboboxItemIndicator>
            <span>
              {{ option }}
            </span>
          </DestylerComboboxItem>
        </DestylerComboboxGroup>
      </DestylerComboboxViewport>
    </DestylerComboboxContent>
  </DestylerComboboxRoot>
</template>
