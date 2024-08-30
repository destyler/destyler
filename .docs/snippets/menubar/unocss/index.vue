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
        icon: 'carbon:new-tab',
        value: 'new-tab',
        label: 'New Tab',
        shortcut: '⌘T',
        type: 'item',
      },
      {
        icon: 'carbon:airplay',
        value: 'new-window',
        label: 'New Window',
        shortcut: '⌘N',
        type: 'item',
      },
      {
        icon: 'carbon:fingerprint-recognition',
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
        icon: 'carbon:share',
        value: 'share',
        label: 'Share',
        type: 'sub',
        items: [
          {
            icon: 'carbon:email',
            value: 'email-link',
            label: 'Email link',
            type: 'item',
          },
          {
            icon: 'carbon:chat',
            value: 'messages',
            label: 'Messages',
            type: 'item',
          },
          {
            icon: 'carbon:align-box-top-left',
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
        icon: 'carbon:printer',
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
        icon: 'carbon:undo',
        value: 'undo',
        label: 'Undo',
        shortcut: '⌘Z',
        type: 'item',
      },
      {
        icon: 'carbon:redo',
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
        icon: 'carbon:search',
        value: 'find',
        label: 'Find',
        type: 'sub',
        items: [
          {
            icon: 'carbon:application-web',
            value: 'search-the-web',
            label: 'Search the web',
            type: 'item',
          },
          {
            value: 'edit-shortcut-2',
            type: 'separator',
          },
          {
            icon: 'carbon:magnify',
            value: 'find...',
            label: 'Find...',
            type: 'item',
          },
          {
            icon: 'carbon:triangle-right-outline',
            value: 'find-next',
            label: 'Find Next',
            type: 'item',
          },
          {
            icon: 'carbon:triangle-left-outline',
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
        icon: 'carbon:cut',
        value: 'cut',
        label: 'Cut',
        type: 'item',
      },
      {
        icon: 'carbon:copy-file',
        value: 'copy',
        label: 'Copy',
        type: 'item',
      },
      {
        icon: 'carbon:paste',
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
        icon: 'carbon:update-now',
        value: 'reload',
        label: 'Reload',
        shortcut: '⌘R',
        type: 'item',
      },
      {
        icon: 'carbon:rotate-360',
        value: 'force-reload',
        label: 'Force Reload',
        shortcut: '⇧⌘R',
        disabled: true,
        type: 'item',
      },
      {
        value: 'view-shortcut-2',
        type: 'separator',
      },
      {
        icon: 'carbon:maximize',
        value: 'toggle-fullscreen',
        label: 'Toggle Fullscreen',
        type: 'item',
      },
      {
        value: 'view-shortcut-3',
        type: 'separator',
      },
      {
        icon: 'carbon:minimize',
        value: 'hide-sidebar',
        label: 'Hide Sidebar',
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
        icon: 'carbon:edit',
        value: 'edit',
        label: 'Edit...',
        type: 'item',
      },
      {
        value: 'profiles-shortcut-2',
        type: 'separator',
      },
      {
        icon: 'carbon:add-alt',
        value: 'add-profile',
        label: 'Add Profile...',
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
    flex="~"
    h="10"
    items="center"
    space="x-1"
    rounded="md"
    border="~"
    bg="background"
    p="1"
  >
    <MenubarMenu v-for="option in options" :key="option.value" :value="option.value">
      <MenubarTrigger
        text="dark dark:light sm hover:accent-foreground focus:accent-foreground data-[state=open]:accent-foreground"
        fle="~"
        cursor="pointer"
        select="none"
        items="center"
        rounded="sm"
        p="x-3 y-1.5"
        font="medium"
        outline="none"
        bg="hover:accent focus:accent data-[state=open]:accent"
      >
        {{ option.label }}
      </MenubarTrigger>
      <MenubarPortal>
        <MenubarContent
          align="start"
          :side-offset="8"
          :align-offset="-4"
          z="50"
          min-w="12rem "
          overflow="hidden"
          rounded="md"
          border="~"
          bg="popover"
          p="1"
          text="popover-foreground"
          shadow="md"
          class="
          data-[state=open]:animate-in
          data-[state=closed]:fade-out-0
          data-[state=open]:fade-in-0
          data-[state=closed]:zoom-out-95
          data-[state=open]:zoom-in-95
          data-[side=bottom]:slide-in-from-top-2
          data-[side=left]:slide-in-from-right-2
          data-[side=right]:slide-in-from-left-2
          data-[side=top]:slide-in-from-bottom-2
          "
        >
          <template
            v-for="item in option.items"
            :key="item?.value"
          >
            <MenubarItem
              v-if="item?.type === 'item'"
              :value="item?.value"
              :disabled="item?.disabled"
              :class="item?.class"
              relative="~"
              flex="~"
              select="none"
              items="center"
              rounded="sm"
              p="x-2 y-1.5"
              text="sm focus:accent-foreground"
              outline="none"
              bg="focus:accent"
              pointer="data-[disabled]:events-none"
              op="data-[disabled]:50"
            >
              <Icon
                v-if="item.icon"
                :name="item.icon"
                m="r-2"
                h="4"
                w="4"
              />
              {{ item?.label }}
              <Shortcut v-show="item?.shortcut">
                {{ item.shortcut }}
              </Shortcut>
            </MenubarItem>
            <MenubarSeparator
              v-else-if="item?.type === 'separator'"
              m="x--1 y-1"
              h="px"
              bg="muted"
            />
            <Sub v-else-if="item?.type === 'sub'" :items="item" />
            <MenubarCheckboxItem
              v-else-if="item?.type === 'checkbox'"
              v-model:checked="item.checked"
              relative="~"
              flex="~"
              cursor="pointer"
              select="none"
              items="center"
              rounded="sm"
              p="y-1.5 l-8 r-2"
              text="sm focus:accent-foreground"
              outline="none"
              bg="focus:accent"
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
                <MenubarItemIndicator>
                  <Icon
                    name="carbon:checkmark"
                    w="4"
                    h="4"
                    text="primary"
                  />
                </MenubarItemIndicator>
              </span>
              {{ item?.label }}
            </MenubarCheckboxItem>
            <MenubarRadioGroup
              v-else-if="item?.type === 'radio'"
              v-model="item.value"
            >
              <MenubarRadioItem
                v-for="radioItem in item.items"
                :key="radioItem.value"
                :value="radioItem.value"
                relative="~"
                flex="~"
                cursor="pointer"
                select="none"
                items="center"
                rounded="sm"
                p="y-1.5 l-8 r-2"
                text="sm focus:accent-foreground"
                outline="none"
                bg="focus:accent"
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
                  <MenubarItemIndicator>
                    <Icon
                      name="carbon:checkmark"
                      w="4"
                      h="4"
                      text="primary"
                    />
                  </MenubarItemIndicator>
                </span>
                {{ radioItem?.label }}
              </MenubarRadioItem>
            </MenubarRadioGroup>
          </template>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  </MenubarRoot>
</template>
