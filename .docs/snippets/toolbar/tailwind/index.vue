<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { ToolbarButton, ToolbarLink, ToolbarRoot, ToolbarSeparator, ToolbarToggleGroup, ToolbarToggleItem } from '@destyler/toolbar'

const options = ref<{
  element: 'item' | 'link' | 'group' | 'separator' | 'button'
  type?: any
  icon?: string
  value?: any
  label?: string
  items?: {
    element: 'item' | 'link' | 'group' | 'separator'
    type?: any
    icon?: string
    value?: any
    label?: string
  }[]
}[]>([
  {
    element: 'group',
    type: 'multiple',
    value: ['bold'],
    items: [
      {
        element: 'item',
        value: 'bold',
        icon: 'radix-icons:font-bold',
      },
      {
        element: 'item',
        value: 'italic',
        icon: 'radix-icons:font-italic',
      },
      {
        element: 'item',
        value: 'line',
        icon: 'radix-icons:underline',
      },
    ],
  },
  {
    element: 'separator',
  },
  {
    element: 'group',
    type: 'single',
    value: 'left',
    items: [
      {
        element: 'item',
        value: 'left',
        icon: 'radix-icons:text-align-left',
      },
      {
        element: 'item',
        value: 'center',
        icon: 'radix-icons:text-align-center',
      },
      {
        element: 'item',
        value: 'right',
        icon: 'radix-icons:text-align-right',
      },
    ],
  },
  {
    element: 'separator',
  },
  {
    element: 'link',
    label: 'Edited 2 hours ago',
  },
  {
    element: 'button',
    label: 'Share',
  },
])
</script>

<template>
  <ToolbarRoot
    class="flex p-[10px] w-full max-w-[610px] !min-w-max rounded-md bg-#ffffff dark:bg-#09090b shadow-[0_2px_10px]"
  >
    <template v-for="(option, index) in options">
      <ToolbarToggleGroup
        v-if="option.element === 'group'"
        :key="`group-${index}`"
        v-model="option.value"
        :type="option.type"
      >
        <template v-for="(item, index) in option.items">
          <ToolbarToggleItem
            v-if="item.element === 'item'"
            :key="`item-${index}`"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#71717A dark:hover:text-#A1A1AA focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-#F4F4F5 dark:data-[state=on]:bg-#27272A data-[state=on]:text-#18181B dark:data-[state=on]:text-#FAFAFA bg-transparent h-9 px-3 ml-1 first:ml-0"
            :value="item.value"
          >
            <Icon
              v-if="item.icon"
              :name="item.icon"
              class="w-4 h-4 text-dark dark:text-light"
            />
          </ToolbarToggleItem>
        </template>
      </ToolbarToggleGroup>
      <ToolbarSeparator
        v-else-if="option.element === 'separator'"
        :key="`separator-${index}`"
        class="w-[1px] bg-#E4E4E7 dark:bg-#27272A  mx-[10px]"
      />
      <ToolbarLink
        v-if="option.element === 'link'"
        :key="`link-${index}`"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-#F4F4F5 dark:data-[state=on]:bg-#27272A data-[state=on]:text-#18181B dark:data-[state=on]:text-#FAFAFA bg-transparent h-9 px-3 border-none! cursor-pointer"
      >
        {{ option.label }}
      </ToolbarLink>
      <ToolbarButton
        v-if="option.element === 'button'"
        :key="`button-${index}`"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:bg-#FAFAFA dark:hover:bg-#FAFAFA/90 bg-#18181B hover:bg-#18181B/90 dark:text-#18181B text-#FAFAFA shadow h-9 px-4 py-2 ml-auto"
      >
        {{ option.label }}
      </ToolbarButton>
    </template>
  </ToolbarRoot>
</template>
