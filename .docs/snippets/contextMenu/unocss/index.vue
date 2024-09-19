<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuItemIndicator, ContextMenuLabel, ContextMenuPortal, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuRoot, ContextMenuSeparator, ContextMenuTrigger } from '@destyler/context-menu'
import ContextMenuShortcut from './Shortcut.vue'
import SubItemIng from './SubItemIng.vue'

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
    <ContextMenuTrigger
      flex="~"
      h="37"
      w="75"
      items="center"
      justify="center"
      rounded="md"
      border="~ dashed primary/40"
      text="sm"
    >
      <span text="primary/70" font="bold">Right click me</span>
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent
        class="
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
        data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
        data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
        "
        z="50"
        w="58"
        min-w="32"
        overflow="hidden"
        rounded="md"
        border="~"
        bg="popover"
        p="1"
        text="popover-foreground"
        shadow="lg"
        :side-offset="5"
      >
        <template v-for="item in menu" :key="item.label">
          <ContextMenuItem
            v-if="item.type === 'item'"
            relative="~"
            flex="~"
            cursor="default"
            select="none"
            items="center"
            rounded="sm"
            p="x-2 y-1.5 l-4"
            text="sm"
            outline="none"
            focus="bg-accent text-accent-foreground"
            pointer="data-[disabled]:events-none"
            op="data-[disabled]:50"
            :disabled="item.disabled"
          >
            <span>{{ item.label }}</span>
            <ContextMenuShortcut>{{ item.shortcut }}</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuCheckboxItem
            v-else-if="item.type === 'check'"
            :checked="item.checked"
            relative="~"
            flex="~"
            cursor="default"
            select="none"
            items="center"
            rounded="sm"
            p="x-2 y-1.5 l-4"
            text="sm"
            outline="none"
            focus="bg-accent text-accent-foreground"
            pointer="data-[disabled]:events-none"
            op="data-[disabled]:50"
          >
            <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
              <ContextMenuItemIndicator>
                <Icon name="carbon:checkmark" w="4" h="4" text="primary" />
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
              class="px-2 py-1.5 text-sm font-semibold text-foreground pl-8"
            >
              {{ item.label }}
            </ContextMenuLabel>
            <ContextMenuSeparator m="x--1 y-1 " h="px" bg="border" />
            <ContextMenuRadioItem
              v-for="radioItem in item.items"
              :key="radioItem.label"
              :value="radioItem.value"
              relative="~"
              flex="~"
              cursor="default"
              select="none"
              items="center"
              rounded="sm"
              p="x-2 y-1.5 l-4"
              text="sm"
              outline="none"
              focus="bg-accent text-accent-foreground"
              pointer="data-[disabled]:events-none"
              op="data-[disabled]:50"
            >
              <span
                absolute="~"
                left="2"
                flex="~"
                h="3.5"
                w="3.5"
                items="center"
                justify="center"
              >
                <ContextMenuItemIndicator>
                  <Icon name="carbon:dot-mark" w="4" h="4" fill="current" text="primary" />
                </ContextMenuItemIndicator>
              </span>
              {{ radioItem.label }}
              <ContextMenuShortcut>{{ item.shortcut }}</ContextMenuShortcut>
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <SubItemIng
            v-else-if="item.type === 'sub'"
            :item="item"
            p="l-8"
          />
          <ContextMenuSeparator
            v-else-if="item.type === 'separator'"
            m="x--1 y-1 " h="px" bg="border"
          />
        </template>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
