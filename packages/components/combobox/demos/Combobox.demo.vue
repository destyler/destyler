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

const v = ref('')
const options = ref(['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'])
const vegetables = ref(['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek'])
</script>

<template>
  <div>{{ v }}</div>
  <DestylerComboboxRoot v-model="v" class="relative">
    <DestylerComboboxAnchor class="min-w-[160px] inline-flex items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-#71D083 shadow-[0_2px_10px] shadow-black/10 hover:bg-white hover:bg-op-5 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-#46A758 outline-none">
      <DestylerComboboxInput class="!bg-transparent outline-none text-#71D083 h-full selection:bg-#25482D placeholder-#625F69" placeholder="Placeholder..." />
      <DestylerComboboxTrigger>
        <svg>
          <path/>
        </svg>
      </DestylerComboboxTrigger>
    </DestylerComboboxAnchor>

    <DestylerComboboxContent class="absolute z-10 w-full mt-2 min-w-[160px] bg-white overflow-hidden rounded shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade">
      <DestylerComboboxViewport class="p-[5px]">
        <DestylerComboboxEmpty class="text-#625F69 text-xs font-medium text-center py-2" />

        <DestylerComboboxGroup>
          <DestylerComboboxLabel class="px-[25px] text-xs leading-[25px] text-#B5B2BC">
            Fruits
          </DestylerComboboxLabel>

          <DestylerComboboxItem
            v-for="(option, index) in options" :key="index"
            class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-#46A758 data-[highlighted]:text-#0E1511"
            :value="option"
          >
            <DestylerComboboxItemIndicator
              class="absolute left-0 w-[25px] inline-flex items-center justify-center"
            >
            <svg>
              <path/>
            </svg>
            </DestylerComboboxItemIndicator>
            <span>
              {{ option }}
            </span>
          </DestylerComboboxItem>
          <DestylerComboboxSeparator class="h-[1px] bg-#2D5736 m-[5px]" />
        </DestylerComboboxGroup>
      </DestylerComboboxViewport>
    </DestylerComboboxContent>
  </DestylerComboboxRoot>
</template>
