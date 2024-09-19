<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuItemIndicator, ContextMenuLabel, ContextMenuPortal, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuRoot, ContextMenuSeparator, ContextMenuTrigger } from '@destyler/context-menu'
import ContextMenuShortcut from './Shortcut.vue'
import SubItemIng from './SubItemIng.vue'
import './style.css'

const menu = ref([
  {
    label: 'Back',
    shortcut: '⌘ [',
    type: 'item',
  },
  {
    label: 'Forward',
    shortcut: '⌘ ]',
    disabled: true,
    type: 'item',
  },
  {
    label: 'Reload',
    shortcut: '⌘ R',
    type: 'item',
  },
  {
    label: 'More Tools',
    type: 'sub',
    items: [
      {
        label: 'Save Page As...',
        shortcut: '⇧ ⌘ S',
        type: 'item',
      },
      {
        label: 'Create Shortcut...',
        type: 'item',
      },
      {
        label: 'Name Window...',
        type: 'item',
      },
      {
        type: 'separator',
      },
      {
        label: 'Developer Tools',
        type: 'sub',
        items: [
          {
            label: 'Vue.js',
            type: 'check',
            checked: true,
          },
          {
            label: 'React.js',
            type: 'check',
            checked: false,
          },
        ],
      },
    ],
  },
  {
    type: 'separator',
  },
  {
    label: 'Show Bookmarks Bar',
    shortcut: '⌘ ⇧ B',
    type: 'check',
    checked: true,
  },
  {
    label: 'Show Full URLs',
    type: 'check',
    checked: false,
  },
  {
    type: 'separator',
  },
  {
    label: 'pedro',
    type: 'radio',
    items: [
      {
        label: 'Pedro Duarte',
        value: 'pedro',
        type: 'item',
      },
      {
        label: 'Colm Tuite',
        value: 'colm',
        type: 'item',
      },
    ],
  },
])

const radioValue = ref('pedro')
</script>

<template>
  <ContextMenuRoot>
    <ContextMenuTrigger class="contextMenuTrigger">
      <span class="contextMenuTrigger-span">Right click me</span>
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent
        class="contextMenuContent"
        :side-offset="5"
      >
        <template v-for="item in menu" :key="item.label">
          <ContextMenuItem
            v-if="item.type === 'item'"
            class="contextMenuAllItem"
            :disabled="item.disabled"
          >
            <span>{{ item.label }}</span>
            <ContextMenuShortcut>{{ item.shortcut }}</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuCheckboxItem
            v-else-if="item.type === 'check'"
            :checked="item.checked"
            class="contextMenuAllItem"
          >
            <span class="contextMenuItemIndicator">
              <ContextMenuItemIndicator>
                <Icon name="carbon:checkmark" class="icon" />
              </ContextMenuItemIndicator>
            </span>
            <span>{{ item.label }}</span>
            <ContextMenuShortcut>{{ item.shortcut }}</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuRadioGroup
            v-else-if="item.type === 'radio'"
            v-model="radioValue"
          >
            <ContextMenuLabel
              class="contextMenuLabel"
            >
              {{ item.label }}
            </ContextMenuLabel>
            <ContextMenuSeparator class="separator" />
            <ContextMenuRadioItem
              v-for="radioItem in item.items"
              :key="radioItem.label"
              :value="radioItem.value"
              class="contextMenuAllItem"
            >
              <span class="contextMenuItemIndicator">
                <ContextMenuItemIndicator>
                  <Icon name="carbon:dot-mark" class="icon fill-current" />
                </ContextMenuItemIndicator>
              </span>
              {{ radioItem.label }}
              <ContextMenuShortcut>{{ item.shortcut }}</ContextMenuShortcut>
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <SubItemIng
            v-else-if="item.type === 'sub'"
            :item="item"
            class="pl-8"
          />
          <ContextMenuSeparator
            v-else-if="item.type === 'separator'"
            class="separator"
          />
        </template>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
