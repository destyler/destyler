<script setup lang="ts">
import { ref } from 'vue'
import { DestylerComboboxAnchor, DestylerComboboxContent, DestylerComboboxEmpty, DestylerComboboxGroup, DestylerComboboxInput, DestylerComboboxItem, DestylerComboboxItemIndicator, DestylerComboboxLabel, DestylerComboboxRoot, DestylerComboboxTrigger, DestylerComboboxViewport } from '../src'

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
  <DestylerComboboxRoot v-bind="props" v-model="v" v-model:open="open" name="test">
    <DestylerComboboxAnchor>
      <DestylerComboboxInput placeholder="Placeholder..." />
      <DestylerComboboxTrigger>
        down
      </DestylerComboboxTrigger>
    </DestylerComboboxAnchor>
    <DestylerComboboxContent>
      <DestylerComboboxViewport>
        <DestylerComboboxEmpty />

        <DestylerComboboxGroup>
          <DestylerComboboxLabel>
            People
          </DestylerComboboxLabel>

          <DestylerComboboxItem
            v-for="(option, index) in people" :key="index"
            :value="option"
          >
            <DestylerComboboxItemIndicator>
              check
            </DestylerComboboxItemIndicator>
            <span>
              {{ option.name }}
            </span>
          </DestylerComboboxItem>
        </DestylerComboboxGroup>
      </DestylerComboboxViewport>
    </DestylerComboboxContent>
  </DestylerComboboxRoot>
</template>
