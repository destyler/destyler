<script setup lang="ts">
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarPortal,
  MenubarRoot,
  MenubarTrigger,
} from 'destyler'
</script>

<template>
  <MenubarRoot class="flex h-9 items-center space-x-1 rounded-md border dark:border-#27272A dark:bg-#09090B p-1 shadow-sm">
    <MenubarMenu>
      <MenubarTrigger
        class="flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none dark:hover:bg-#27272A hover:bg-#F4F4F5 hover:text-#18181B dark:hover:text-#FAFAFA dark:data-[state=open]:bg-#27272A data-[state=open]:bg-#F4F4F5 data-[state=open]:text-#18181B dark:data-[state=open]:text-#FAFAFA"
      >
        File
      </MenubarTrigger>
      <MenubarPortal>
        <MenubarContent
          align="start"
          :align-offset="-4"
          :side-offset="8"
          class="z-50 p-1 min-w-[12rem] overflow-hidden rounded-md border border-black border-op-9 dark:border-white dark:border-op-9 bg-#FFFFFF dark:bg-#09090B text-#09090B dark:text-#FAFAFA shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <MenubarItem class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#18181B dark:hover:text-#FAFAFA data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            New File
            <span class="ml-auto text-xs tracking-widest text-#71717A dark:text-#A1A1AA">
              ⌘T
            </span>
          </MenubarItem>
          <MenubarItem class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#18181B dark:hover:text-#FAFAFA data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            New Window
            <span class="ml-auto text-xs tracking-widest text-#71717A dark:text-#A1A1AA">
              ⌘N
            </span>
          </MenubarItem>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger
        class="flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none dark:hover:bg-#27272A hover:bg-#F4F4F5 hover:text-#18181B dark:hover:text-#FAFAFA dark:data-[state=open]:bg-#27272A data-[state=open]:bg-#F4F4F5 data-[state=open]:text-#18181B dark:data-[state=open]:text-#FAFAFA"
      >
        Edit
      </MenubarTrigger>
      <MenubarPortal>
        <MenubarContent
          align="start"
          :align-offset="-4"
          :side-offset="8"
          class="z-50 p-1 min-w-[12rem] overflow-hidden rounded-md border border-black border-op-9 dark:border-white dark:border-op-9 bg-#FFFFFF dark:bg-#09090B text-#09090B dark:text-#FAFAFA shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <MenubarItem class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#18181B dark:hover:text-#FAFAFA data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            Undo
            <span class="ml-auto text-xs tracking-widest text-#71717A dark:text-#A1A1AA">
              ⌘Z
            </span>
          </MenubarItem>
          <MenubarItem class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#18181B dark:hover:text-#FAFAFA data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            Redo
            <span class="ml-auto text-xs tracking-widest text-#71717A dark:text-#A1A1AA">
              ⇧⌘Z
            </span>
          </MenubarItem>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  </MenubarRoot>
</template>
