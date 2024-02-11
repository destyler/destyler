<script setup lang="ts">
import { ref } from 'vue'
import {
  DestylerIcon,
  DestylerToolbarButton,
  DestylerToolbarLink,
  DestylerToolbarRoot,
  DestylerToolbarSeparator,
  DestylerToolbarToggleGroup,
  DestylerToolbarToggleItem,
} from 'destyler'

const toggleStateSingle = ref('center')
const toggleStateMultiple = ref([])
</script>

<template>
  <DestylerToolbarRoot
    class="flex p-[10px] w-full max-w-[610px] !min-w-max rounded-md bg-#ffffff dark:bg-#09090b shadow-[0_2px_10px]"
    aria-label="Formatting options"
  >
    <DestylerToolbarToggleGroup v-model="toggleStateMultiple" type="multiple" aria-label="Text formatting">
      <DestylerToolbarToggleItem
        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#71717A dark:hover:text-#A1A1AA focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-#F4F4F5 dark:data-[state=on]:bg-#27272A data-[state=on]:text-#18181B dark:data-[state=on]:text-#FAFAFA bg-transparent h-9 px-3"
        value="bold"
        aria-label="Bold"
      >
        <DestylerIcon class="w-4 h-4" name="radix-icons:font-bold" />
      </DestylerToolbarToggleItem>
      <DestylerToolbarToggleItem
        class="ml-0.5 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#71717A dark:hover:text-#A1A1AA focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-#F4F4F5 dark:data-[state=on]:bg-#27272A data-[state=on]:text-#18181B dark:data-[state=on]:text-#FAFAFA bg-transparent h-9 px-3"
        value="italic"
        aria-label="Italic"
      >
        <DestylerIcon class="w-4 h-4" name="radix-icons:font-italic" />
      </DestylerToolbarToggleItem>
      <DestylerToolbarToggleItem
        class="ml-0.5 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#71717A dark:hover:text-#A1A1AA focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-#F4F4F5 dark:data-[state=on]:bg-#27272A data-[state=on]:text-#18181B dark:data-[state=on]:text-#FAFAFA bg-transparent h-9 px-3"
        value="strikethrough"
        aria-label="Strike through"
      >
        <DestylerIcon class="w-4 h-4" name="radix-icons:strikethrough" />
      </DestylerToolbarToggleItem>
    </DestylerToolbarToggleGroup>
    <DestylerToolbarSeparator
      class="w-[1px] bg-#E4E4E7 dark:bg-#27272A  mx-[10px]"
    />
    <DestylerToolbarToggleGroup v-model="toggleStateSingle" type="single" aria-label="Text Alignment">
      <DestylerToolbarToggleItem
        class="ml-0.5 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#71717A dark:hover:text-#A1A1AA focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-#F4F4F5 dark:data-[state=on]:bg-#27272A data-[state=on]:text-#18181B dark:data-[state=on]:text-#FAFAFA bg-transparent h-9 px-3"
        value="left"
        aria-label="Left Aligned"
      >
        <DestylerIcon class="w-4 h-4" name="radix-icons:text-align-left" />
      </DestylerToolbarToggleItem>
      <DestylerToolbarToggleItem
        value="center"
        class="ml-0.5 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#71717A dark:hover:text-#A1A1AA focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-#F4F4F5 dark:data-[state=on]:bg-#27272A data-[state=on]:text-#18181B dark:data-[state=on]:text-#FAFAFA bg-transparent h-9 px-3"
        aria-label="Center Aligned"
      >
        <DestylerIcon class="w-4 h-4" name="radix-icons:text-align-center" />
      </DestylerToolbarToggleItem>
      <DestylerToolbarToggleItem
        value="right"
        class="ml-0.5 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#71717A dark:hover:text-#A1A1AA focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-#F4F4F5 dark:data-[state=on]:bg-#27272A data-[state=on]:text-#18181B dark:data-[state=on]:text-#FAFAFA bg-transparent h-9 px-3"
        aria-label="Right Aligned"
      >
        <DestylerIcon class="w-4 h-4" name="radix-icons:text-align-right" />
      </DestylerToolbarToggleItem>
    </DestylerToolbarToggleGroup>
    <DestylerToolbarSeparator
      class="w-[1px] bg-#E4E4E7 dark:bg-#27272A  mx-[10px]"
    />
    <DestylerToolbarLink
      href="#"
      target="_blank"
      class="ml-0.5 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-#F4F4F5 dark:data-[state=on]:bg-#27272A data-[state=on]:text-#18181B dark:data-[state=on]:text-#FAFAFA bg-transparent h-9 px-3"
      style="margin-right: 10"
    >
      Edited 2 hours ago
    </DestylerToolbarLink>
    <DestylerToolbarButton
      class="ml-0.5 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:bg-#FAFAFA dark:hover:bg-#FAFAFA/90 bg-#18181B hover:bg-#18181B/90 dark:text-#18181B text-#FAFAFA shadow h-9 px-4 py-2"
      style="margin-left: auto"
    >
      Share
    </DestylerToolbarButton>
  </DestylerToolbarRoot>
</template>
