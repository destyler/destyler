<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@destyler/icon'
import { ComboboxAnchor, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxLabel, ComboboxRoot, ComboboxTrigger, ComboboxViewport } from '../src'

const people = [
  { id: 1, name: 'One' },
  { id: 2, name: 'Two' },
  { id: 3, name: 'Three' },
  { id: 4, name: 'Four' },
  { id: 5, name: 'Five' },
]

const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek'].map((v, i) => ({ id: i, name: v }))

const searchTerm = ref('')
const v = ref(people[0])

const filteredPeople = computed(() => people.filter(i => i.name.toLowerCase().includes(searchTerm.value.toLowerCase())))
const filteredVege = computed(() => vegetables.filter(i => i.name.toLowerCase().includes(searchTerm.value.toLowerCase())))
function filterFunction(list: any[], term: string) {
  return list.filter(i => i.name.toLowerCase().includes(term.toLowerCase()))
}

function handleUpdate(ev: any) {
  console.log(ev)
}
</script>

<template>
  <Story title="Combobox/Object" :layout="{ type: 'grid', width: '50%' }">
    <Variant title="Default" auto-props-disabled>
      <ComboboxRoot v-model="v" :filter-function="filterFunction" :display-value="ev => ev.name" @update:model-value="handleUpdate">
        <ComboboxAnchor class="min-w-[160px] inline-flex items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-grass11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-grass9 outline-none">
          <ComboboxInput class="bg-transparent outline-none text-grass11 placeholder-gray-400" placeholder="Test" />
          <ComboboxTrigger>
            <Icon name="radix-icons:chevron-down" class="h-4 w-4 text-grass11" />
          </ComboboxTrigger>
        </ComboboxAnchor>
        <ComboboxContent class="mt-2 min-w-[160px] bg-white overflow-hidden rounded shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade">
          <ComboboxViewport class="p-[5px]">
            <ComboboxEmpty class="text-gray-400  text-xs font-medium text-center py-2" />

            <ComboboxGroup>
              <ComboboxLabel class="px-[25px] text-xs leading-[25px] text-mauve11">
                People
              </ComboboxLabel>

              <ComboboxItem
                v-for="(option, index) in people" :key="index"
                class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-grass9 data-[highlighted]:text-grass1"
                :value="option"
              >
                <ComboboxItemIndicator
                  class="absolute left-0 w-[25px] inline-flex items-center justify-center"
                >
                  <Icon name="radix-icons:check" />
                </ComboboxItemIndicator>
                <span>
                  {{ option.name }}
                </span>
              </ComboboxItem>
            </ComboboxGroup>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxRoot>
    </Variant>

    <Variant title="Manual filtering" auto-props-disabled>
      <ComboboxRoot v-model:search-term="searchTerm" v-model="v" @update:model-value="handleUpdate">
        <ComboboxAnchor class="min-w-[160px] inline-flex items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-grass11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-grass9 outline-none">
          <ComboboxInput class="bg-transparent outline-none text-grass11 placeholder-gray-400" placeholder="Test" />
          <ComboboxTrigger>
            <Icon name="radix-icons:chevron-down" class="h-4 w-4 text-grass11" />
          </ComboboxTrigger>
        </ComboboxAnchor>
        <ComboboxContent class="mt-2 min-w-[160px] bg-white overflow-hidden rounded shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade">
          <ComboboxViewport class="p-[5px]">
            <ComboboxEmpty class="text-gray-400  text-xs font-medium text-center py-2" />

            <ComboboxGroup>
              <ComboboxLabel class="px-[25px] text-xs leading-[25px] text-mauve11">
                People
              </ComboboxLabel>

              <ComboboxItem
                v-for="option in filteredPeople" :key="option.id"
                class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-grass9 data-[highlighted]:text-grass1"
                :value="option"
              >
                <ComboboxItemIndicator
                  class="absolute left-0 w-[25px] inline-flex items-center justify-center"
                >
                  <Icon name="radix-icons:check" />
                </ComboboxItemIndicator>
                <span>
                  {{ option.name }}
                </span>
              </ComboboxItem>
            </ComboboxGroup>

            <ComboboxGroup>
              <ComboboxLabel class="px-[25px] text-xs leading-[25px] text-mauve11">
                Vegetables
              </ComboboxLabel>

              <ComboboxItem
                v-for="option in filteredVege" :key="option.id"
                class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-grass9 data-[highlighted]:text-grass1"
                :value="option"
              >
                <ComboboxItemIndicator
                  class="absolute left-0 w-[25px] inline-flex items-center justify-center"
                >
                  <Icon name="radix-icons:check" />
                </ComboboxItemIndicator>
                <span>
                  {{ option.name }}
                </span>
              </ComboboxItem>
            </ComboboxGroup>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxRoot>
    </Variant>
  </Story>
</template>
