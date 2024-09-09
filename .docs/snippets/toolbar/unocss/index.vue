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
    flex="~"
    p="10px"
    w="full"
    max-w="610px"
    min-w="max!"
    rounded="md"
    bg="#ffffff dark:#09090b"
    shadow="[0_2px_10px]"
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
            inline="flex"
            items="center"
            justify="center"
            rounded="md"
            text="sm dark:text-#71717A dark:hover:#A1A1AA data-[state=on]:#18181B dark:data-[state=on]:#FAFAFA"
            font="medium"
            transition="colors"
            bg="#F4F4F5 dark:#27272A data-[state=on]:#F4F4F5 dark:data-[state=on]:#27272A transparent"
            focus-visible="outline-none ring-1"
            pointer-events="disabled:none"
            op="disabled:50"
            h="9"
            p="x-3"
            m="l-1 first:l-0"
            :value="item.value"
          >
            <Icon
              v-if="item.icon"
              :name="item.icon"
              w="4"
              h="4"
              text="dark dark:text-light"
            />
          </ToolbarToggleItem>
        </template>
      </ToolbarToggleGroup>
      <ToolbarSeparator
        v-else-if="option.element === 'separator'"
        :key="`separator-${index}`"
        w="px"
        bg="#E4E4E7 dark:#27272A"
        m="x-10px"
        s
      />
      <ToolbarLink
        v-if="option.element === 'link'"
        :key="`link-${index}`"
        line="flex"
        items="center"
        justify="center"
        rounded="md"
        text="sm data-[state=on]:#18181B dark:data-[state=on]:#FAFAFA"
        font="medium"
        transition="colors"
        focus-visible="outline-none ring-1"
        pointer-events="disabled:none"
        op="disabled:50"
        bg="data-[state=on]:#F4F4F5 dark:data-[state=on]:#27272A transparent"
        h="9"
        p="x-3"
        cursor="pointer"
      >
        {{ option.label }}
      </ToolbarLink>
      <ToolbarButton
        v-if="option.element === 'button'"
        :key="`button-${index}`"
        inline="flex"
        items="center"
        justify="center"
        whitespace="nowrap"
        rounded="md"
        text="sm dark:#18181B #FAFAFA"
        font="medium"
        transition="colors"
        focus-visible="outline-none ring-1"
        pointer-events="disabled:none"
        op="disabled:50"
        bg="dark:#FAFAFA dark:hover:#FAFAFA/90 #18181B hover:#18181B/90"
        shadow="~"
        h="9"
        p="x-4 y-2"
        m="l-auto"
      >
        {{ option.label }}
      </ToolbarButton>
    </template>
  </ToolbarRoot>
</template>
