<script setup lang="ts">
import { ref } from 'vue'
import {
  DropdownArrow,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownPortal,
  DropdownRoot,
  DropdownSeparator,
  DropdownTrigger,
} from '@destyler/dropdown'
import Shortcut from './Shortcut.vue'

const items = ref([
  [
    {
      value: 'profile',
      label: 'Profile',
      shortcut: '⇧⌘P',
    },
    {
      value: 'billing',
      label: 'Billing',
      shortcut: '⌘B',
    },
    {
      value: 'settings',
      label: 'Settings',
      shortcut: '⌘S',
    },
    {
      value: 'keyboard-shortcuts',
      label: 'Keyboard Shortcuts',
      shortcut: '⌘K',
    },
  ],
])
</script>

<template>
  <DropdownRoot>
    <DropdownTrigger
      class="
        inline-flex items-center justify-center whitespace-nowrap
        rounded-md text-sm font-medium transition-colors
        shadow h-9 px-4 py-2
        focus-visible:outline-none focus-visible:ring-1
        disabled:pointer-events-none disabled:opacity-50
        bg-primary hover:bg-primary/90 text-primary-foreground
        "
    >
      Open
    </DropdownTrigger>
    <DropdownPortal>
      <DropdownContent
        class="
        z-50 min-w-32 overflow-hidden rounded-md border w-56
        bg-popover p-1 text-popover-foreground shadow-md
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
        data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
        data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        :side-offset="5"
      >
        <DropdownLabel class="px-2 py-1.5 text-sm font-semibold text-primary">
          My Account
        </DropdownLabel>
        <DropdownSeparator class="-mx-1 my-1 h-px bg-muted" />
        <DropdownGroup v-for="(menu, index) in items" :key="index">
          <DropdownItem
            v-for="item in menu"
            :key="item.value"
            :value="item.value"
            class="
            relative flex cursor-default select-none items-center
            rounded-sm px-2 py-1.5 text-sm outline-none
            focus:bg-accent focus:text-accent-foreground
            data-[disabled]:pointer-events-none data-[disabled]:opacity-50
            "
          >
            {{ item.label }}
            <Shortcut v-if="item.shortcut">
              {{ item.shortcut }}
            </Shortcut>
          </DropdownItem>
        </DropdownGroup>
        <DropdownArrow class="fill-white" />
      </DropdownContent>
    </DropdownPortal>
  </DropdownRoot>
</template>
