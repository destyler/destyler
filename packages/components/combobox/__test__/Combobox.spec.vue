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
    <DestylerComboboxAnchor class="min-w-[160px] inline-flex items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-grass11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-grass9 outline-none">
      <DestylerComboboxInput class="bg-transparent outline-none text-grass11 placeholder-gray-400" placeholder="Placeholder..." />
      <DestylerComboboxTrigger>
        <svg name="down" />
      </DestylerComboboxTrigger>
    </DestylerComboboxAnchor>
    <DestylerComboboxContent class="mt-2 min-w-[160px] bg-white overflow-hidden rounded shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade">
      <DestylerComboboxViewport class="p-[5px]">
        <DestylerComboboxEmpty class="text-gray-400  text-xs font-medium text-center py-2" />

        <DestylerComboboxGroup>
          <DestylerComboboxLabel class="px-[25px] text-xs leading-[25px] text-mauve11">
            Fruits
          </DestylerComboboxLabel>

          <DestylerComboboxItem
            v-for="(option, index) in options" :key="index"
            class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-grass9 data-[highlighted]:text-grass1"
            :value="option"
          >
            <DestylerComboboxItemIndicator
              class="absolute left-0 w-[25px] inline-flex items-center justify-center"
            >
              <svg name="check" />
            </DestylerComboboxItemIndicator>
            <span>
              {{ option }}
            </span>
          </DestylerComboboxItem>
          <DestylerComboboxSeparator class="h-[1px] bg-grass6 m-[5px]" />
        </DestylerComboboxGroup>

        <DestylerComboboxGroup>
          <DestylerComboboxLabel
            class="px-[25px] text-xs leading-[25px] text-mauve11"
          >
            Vegetables
          </DestylerComboboxLabel>
          <DestylerComboboxItem
            v-for="(option, index) in vegetables" :key="index"
            class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-grass9 data-[highlighted]:text-grass1"
            :value="option"
          >
            <DestylerComboboxItemIndicator
              class="absolute left-0 w-[25px] inline-flex items-center justify-center"
            >
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
