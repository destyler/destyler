<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { ToolbarButton, ToolbarLink, ToolbarRoot, ToolbarSeparator, ToolbarToggleGroup, ToolbarToggleItem } from '@destyler/toolbar'
import './style.css'

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
    class="toolbar-root"
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
            class="toolbar-item"
            :value="item.value"
          >
            <Icon
              v-if="item.icon"
              :name="item.icon"
              class="icon"
            />
          </ToolbarToggleItem>
        </template>
      </ToolbarToggleGroup>
      <ToolbarSeparator
        v-else-if="option.element === 'separator'"
        :key="`separator-${index}`"
        class="toolbar-separator"
      />
      <ToolbarLink
        v-if="option.element === 'link'"
        :key="`link-${index}`"
        class="toolbar-link"
      >
        {{ option.label }}
      </ToolbarLink>
      <ToolbarButton
        v-if="option.element === 'button'"
        :key="`button-${index}`"
        class="toolbar-button"
      >
        {{ option.label }}
      </ToolbarButton>
    </template>
  </ToolbarRoot>
</template>
