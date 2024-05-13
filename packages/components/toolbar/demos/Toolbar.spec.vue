<script setup lang="ts">
import { ref } from 'vue'
import {
  DestylerToolbarButton,
  DestylerToolbarLink,
  DestylerToolbarRoot,
  DestylerToolbarSeparator,
  DestylerToolbarToggleGroup,
  DestylerToolbarToggleItem,
} from '../dist'

const toggleStateSingle = ref('center')
const toggleStateMultiple = ref([])
</script>

<template>
  <DestylerToolbarRoot
    class="flex p-[10px] w-full min-w-max rounded-md bg-white shadow-[0_2px_10px] shadow-blackA7"
    aria-label="Formatting options"
  >
    <DestylerToolbarToggleGroup
      v-model="toggleStateMultiple"
      type="multiple"
      aria-label="Text formatting"
    >
      <DestylerToolbarToggleItem
        class="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet5 data-[state=on]:text-violet11"
        value="bold"
        aria-label="Bold"
      >
        <svg>
          <path />
        </svg>
      </DestylerToolbarToggleItem>
      <DestylerToolbarToggleItem
        class="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet5 data-[state=on]:text-violet11"
        value="italic"
        aria-label="Italic"
      >
        <svg>
          <path />
        </svg>
      </DestylerToolbarToggleItem>
      <DestylerToolbarToggleItem
        class="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet5 data-[state=on]:text-violet11"
        value="strikethrough"
        aria-label="Strike through"
      >
        <svg>
          <path />
        </svg>
      </DestylerToolbarToggleItem>
    </DestylerToolbarToggleGroup>
    <DestylerToolbarSeparator class="w-[1px] bg-mauve6 mx-[10px]" />
    <DestylerToolbarToggleGroup
      v-model="toggleStateSingle"
      type="single"
      aria-label="Text Alignment"
    >
      <DestylerToolbarToggleItem
        class="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet5 data-[state=on]:text-violet11"
        value="left"
        aria-label="Left Aligned"
      >
        <svg>
          <path />
        </svg>
      </DestylerToolbarToggleItem>
      <DestylerToolbarToggleItem
        class="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet5 data-[state=on]:text-violet11"
        value="center"
        aria-label="Center Aligned"
      >
        <svg>
          <path />
        </svg>
      </DestylerToolbarToggleItem>
      <DestylerToolbarToggleItem
        class="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet5 data-[state=on]:text-violet11"
        value="right"
        aria-label="Right Aligned"
      >
        <svg>
          <path />
        </svg>
      </DestylerToolbarToggleItem>
    </DestylerToolbarToggleGroup>
    <DestylerToolbarSeparator class="w-[1px] bg-mauve6 mx-[10px]" />
    <DestylerToolbarLink
      class="bg-transparent text-mauve11 inline-flex justify-center items-center hover:bg-transparent hover:cursor-pointer flex-shrink-0 flex-grow-0 basis-auto h-[25px] px-[5px] rounded text-[13px] leading-none bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet5 data-[state=on]:text-violet11"
      href="#"
      target="_blank"
      style="margin-right: 10"
    >
      Edited 2 hours ago
    </DestylerToolbarLink>
    <DestylerToolbarButton
      class="px-[10px] text-white bg-violet9 flex-shrink-0 flex-grow-0 basis-auto h-[25px] rounded inline-flex text-[13px] leading-none items-center justify-center outline-none hover:bg-violet10 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7"
      style="margin-left: auto"
    >
      Share
    </DestylerToolbarButton>
  </DestylerToolbarRoot>
</template>
