<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarItemIndicator,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarRoot,
  MenubarSeparator,
  MenubarTrigger,
} from '@destyler/menubar'
import Shortcut from './Shortcut.vue'
import Sub from './Sub.vue'

const options = ref([
  {
    value: 'file',
    label: 'File',
    items: [
      {
        value: 'new-tab',
        label: 'New Tab',
        shortcut: '⌘T',
        type: 'item',
      },
      {
        value: 'new-window',
        label: 'New Window',
        shortcut: '⌘N',
        type: 'item',
      },
      {
        value: 'new-incognito-window',
        label: 'New Incognito Window',
        disabled: true,
        type: 'item',
      },
      {
        value: 'file-shortcut-1',
        type: 'separator',
      },
      {
        value: 'share',
        label: 'Share',
        type: 'sub',
        items: [
          {
            value: 'email-link',
            label: 'Email link',
            type: 'item',
          },
          {
            value: 'messages',
            label: 'Messages',
            type: 'item',
          },
          {
            value: 'notes',
            label: 'Notes',
            type: 'item',
          },
        ],
      },
      {
        value: 'file-shortcut-1',
        type: 'separator',
      },
      {
        value: 'print',
        label: 'Print...',
        shortcut: '⌘P',
        type: 'item',
      },
    ],
  },
  {
    value: 'edit',
    label: 'Edit',
    items: [
      {
        value: 'undo',
        label: 'Undo',
        shortcut: '⌘Z',
        type: 'item',
      },
      {
        value: 'redo',
        label: 'Redo',
        shortcut: '⇧⌘Z',
        type: 'item',
      },
      {
        value: 'edit-shortcut-1',
        type: 'separator',
      },
      {
        value: 'find',
        label: 'Find',
        type: 'sub',
        items: [
          {
            value: 'search-the-web',
            label: 'Search the web',
            type: 'item',
          },
          {
            value: 'edit-shortcut-2',
            type: 'separator',
          },
          {
            value: 'find...',
            label: 'Find...',
            type: 'item',
          },
          {
            value: 'find-next',
            label: 'Find Next',
            type: 'item',
          },
          {
            value: 'find-previous',
            label: 'Find Previous',
            type: 'item',
          },
        ],
      },
      {
        value: 'edit-shortcut-2',
        type: 'separator',
      },
      {
        value: 'cut',
        label: 'Cut',
        type: 'item',
      },
      {
        value: 'copy',
        label: 'Copy',
        type: 'item',
      },
      {
        value: 'paste',
        label: 'Paste',
        type: 'item',
      },
    ],
  },
  {
    value: 'view',
    label: 'View',
    items: [
      {
        value: 'always-show-bookmarks-bar',
        label: 'Always Show Bookmarks Bar',
        type: 'checkbox',
        checked: false,
      },
      {
        value: 'always-show-full-urls',
        label: 'Always Show Full URLs',
        type: 'checkbox',
        checked: true,
      },
      {
        value: 'view-shortcut-1',
        type: 'separator',
      },
      {
        value: 'reload',
        label: 'Reload',
        shortcut: '⌘R',
        type: 'item',
        class: 'pl-8',
      },
      {
        value: 'force-reload',
        label: 'Force Reload',
        shortcut: '⇧⌘R',
        disabled: true,
        class: 'pl-8',
        type: 'item',
      },
      {
        value: 'view-shortcut-2',
        type: 'separator',
      },
      {
        value: 'toggle-fullscreen',
        label: 'Toggle Fullscreen',
        class: 'pl-8',
        type: 'item',
      },
      {
        value: 'view-shortcut-3',
        type: 'separator',
      },
      {
        value: 'hide-sidebar',
        label: 'Hide Sidebar',
        class: 'pl-8',
        type: 'item',
      },
    ],
  },
  {
    value: 'profiles',
    label: 'Profiles',
    items: [
      {
        type: 'radio',
        value: 'benoit',
        items: [
          {
            value: 'andy',
            label: 'Andy',
            class: 'pl-8',
            type: 'radio-item',
          },
          {
            value: 'benoit',
            label: 'Benoit',
            class: 'pl-8',
            type: 'radio-item',
          },
          {
            value: 'luis',
            label: 'Luis',
            class: 'pl-8',
            type: 'radio-item',
          },
        ],
      },
      {
        value: 'profiles-shortcut-1',
        type: 'separator',
      },
      {
        value: 'edit',
        label: 'Edit...',
        class: 'pl-8',
        type: 'item',
      },
      {
        value: 'profiles-shortcut-2',
        type: 'separator',
      },
      {
        value: 'add-profile',
        label: 'Add Profile...',
        class: 'pl-8',
        type: 'item',
      },
    ],
  },
])

const currentMenubar = ref('')
</script>

<template>
  <MenubarRoot
    v-model="currentMenubar"
    class="flex h-10 items-center space-x-1 rounded-md border bg-background p-1"
  >
    <MenubarMenu v-for="option in options" :key="option.value" :value="option.value">
      <MenubarTrigger
        class="text-dark dark:text-light flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
      >
        {{ option.label }}
      </MenubarTrigger>
      <MenubarPortal>
        <MenubarContent
          align="start"
          :side-offset="8"
          :align-offset="-4"
          class="z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <template
            v-for="item in option.items"
            :key="item?.value"
          >
            <MenubarItem
              v-if="item?.type === 'item'"
              :value="item?.value"
              :disabled="item?.disabled"
              class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              :class="item?.class"
            >
              {{ item?.label }}
              <Shortcut v-show="item?.shortcut">
                {{ item.shortcut }}
              </Shortcut>
            </MenubarItem>
            <MenubarSeparator v-else-if="item?.type === 'separator'" class="-mx-1 my-1 h-px bg-muted" />
            <Sub v-else-if="item?.type === 'sub'" :items="item" />
            <MenubarCheckboxItem
              v-else-if="item?.type === 'checkbox'"
              v-model:checked="item.checked"
              class="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <MenubarItemIndicator>
                  <Icon name="carbon:checkmark" class="w-4 h-4 text-primary" />
                </MenubarItemIndicator>
              </span>
              {{ item?.label }}
            </MenubarCheckboxItem>
            <MenubarRadioGroup
              v-else-if="item?.type === 'radio'"
              v-model="item.value"
            >
              <MenubarCheckboxItem
                v-for="radioItem in item.items"
                :key="radioItem.value"
                :value="radioItem.value"
                class="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <MenubarItemIndicator>
                    <Icon name="carbon:checkmark" class="w-4 h-4 text-primary" />
                  </MenubarItemIndicator>
                </span>
                {{ radioItem?.label }}
              </MenubarCheckboxItem>
            </MenubarRadioGroup>
          </template>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  </MenubarRoot>
</template>
