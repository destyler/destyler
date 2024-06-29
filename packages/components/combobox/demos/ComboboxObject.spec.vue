<script setup lang="ts">
import { ref } from 'vue'
import { ComboboxAnchor, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxLabel, ComboboxRoot, ComboboxTrigger, ComboboxViewport } from '../src'

type ArrayOrWrapped<T> = T extends any[] ? T : Array<T>

const props = defineProps<{
  open: boolean
  multiple: boolean
  displayValue: (val: string | number | boolean | Record<string, any>) => string
  filterFunction: (val: ArrayOrWrapped<string | number | boolean | Record<string, any>>, term: string) => ArrayOrWrapped<string | number | boolean | Record<string, any>>
}>()
const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
]
const v = ref<any>(people[0])
const open = ref(props.open)
</script>

<template>
  <ComboboxRoot v-bind="props" v-model="v" v-model:open="open" name="test">
    <ComboboxAnchor>
      <ComboboxInput placeholder="Placeholder..." />
      <ComboboxTrigger>
        down
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxContent>
      <ComboboxViewport>
        <ComboboxEmpty />

        <ComboboxGroup>
          <ComboboxLabel>
            People
          </ComboboxLabel>

          <ComboboxItem
            v-for="(option, index) in people" :key="index"
            :value="option"
          >
            <ComboboxItemIndicator>
              check
            </ComboboxItemIndicator>
            <span>
              {{ option.name }}
            </span>
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
