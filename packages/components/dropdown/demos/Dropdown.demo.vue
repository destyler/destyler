<script setup lang="ts">
import {
  DestylerDropdownContent,
  DestylerDropdownGroup,
  DestylerDropdownItem,
  DestylerDropdownLabel,
  DestylerDropdownPortal,
  DestylerDropdownRoot,
  DestylerDropdownSeparator,
  DestylerDropdownSub,
  DestylerDropdownSubContent,
  DestylerDropdownSubTrigger,
  DestylerDropdownTrigger,
} from '../src'
</script>

<template>
  <DestylerDropdownRoot>
    <DestylerDropdownTrigger class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border dark:border-#27272A border-#E4E4E7 dark:bg-#09090B bg-#FFFFFF shadow-sm dark:hover:bg-#27272A hover:bg-#F4F4F5 dark:hover:text-#FAFAFA hover:text-#18181B h-9 px-4 py-2">
      Open Dropdown
    </DestylerDropdownTrigger>
    <DestylerDropdownPortal>
      <DestylerDropdownContent :side-offset="2" class="w-56 z-50 min-w-32 overflow-hidden rounded-md border border-black border-op-9 dark:border-white dark:border-op-9 dark:bg-#09090B bg-#FFFFFF p-1 dark:text-#FAFAFA text-#09090B shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
        <DestylerDropdownLabel class="px-2 py-1.5 text-sm font-semibold">
          My Account
        </DestylerDropdownLabel>
        <DestylerDropdownSeparator class="-mx-1 my-1 h-px bg-#F4F4F5 dark:bg-#27272A" />
        <DestylerDropdownGroup>
          <DestylerDropdownItem class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors dark:focus:bg-#27272A focus:bg-#F4F4F5 dark:focus:text-#FAFAFA focus:text-#18181B data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <span>Profile</span>
            <span class="ml-auto text-xs tracking-widest opacity-60">⇧⌘P</span>
          </DestylerDropdownItem>
          <DestylerDropdownItem class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors dark:focus:bg-#27272A focus:bg-#F4F4F5 dark:focus:text-#FAFAFA focus:text-#18181B data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <span>Billing</span>
            <span class="ml-auto text-xs tracking-widest opacity-60">⌘B</span>
          </DestylerDropdownItem>
          <DestylerDropdownItem class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors dark:focus:bg-#27272A focus:bg-#F4F4F5 dark:focus:text-#FAFAFA focus:text-#18181B data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <span>Settings</span>
            <span class="ml-auto text-xs tracking-widest opacity-60">⌘S</span>
          </DestylerDropdownItem>
        </DestylerDropdownGroup>
        <DestylerDropdownSeparator class="-mx-1 my-1 h-px bg-#F4F4F5 dark:bg-#27272A" />
        <DestylerDropdownGroup>
          <DestylerDropdownItem class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors dark:focus:bg-#27272A focus:bg-#F4F4F5 dark:focus:text-#FAFAFA focus:text-#18181B data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <span>Team</span>
          </DestylerDropdownItem>
          <DestylerDropdownSub>
            <DestylerDropdownSubTrigger
              class="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none dark:focus:bg-#27272A focus:bg-#F4F4F5 data-[state=open]:bg-#F4F4F5 dark:data-[state=open]:bg-#27272A"
            >
              <span>Invite users</span>
            </DestylerDropdownSubTrigger>
            <DestylerDropdownPortal>
              <DestylerDropdownSubContent
                :side-offset="6"
                :align-offset="5"
                class="z-50 min-w-32 overflow-hidden rounded-md border border-black border-op-9 dark:border-white dark:border-op-9 dark:bg-#09090B bg-#FFFFFF p-1 dark:text-#FAFAFA text-#09090B shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              >
                <DestylerDropdownItem class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors dark:focus:bg-#27272A focus:bg-#F4F4F5 dark:focus:text-#FAFAFA focus:text-#18181B data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  <span>Email</span>
                </DestylerDropdownItem>
                <DestylerDropdownItem class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors dark:focus:bg-#27272A focus:bg-#F4F4F5 dark:focus:text-#FAFAFA focus:text-#18181B data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  <span>Manager</span>
                </DestylerDropdownItem>
                <DestylerDropdownSeparator class="-mx-1 my-1 h-px bg-#F4F4F5 dark:bg-#27272A" />
                <DestylerDropdownItem class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors dark:focus:bg-#27272A focus:bg-#F4F4F5 dark:focus:text-#FAFAFA focus:text-#18181B data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  <span>More...</span>
                </DestylerDropdownItem>
              </DestylerDropdownSubContent>
            </DestylerDropdownPortal>
          </DestylerDropdownSub>
        </DestylerDropdownGroup>
      </DestylerDropdownContent>
    </DestylerDropdownPortal>
  </DestylerDropdownRoot>
</template>
