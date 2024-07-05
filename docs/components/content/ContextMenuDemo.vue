<script setup lang="ts">
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  Icon,
} from 'destyler'
</script>

<template>
  <ContextMenuRoot>
    <ContextMenuTrigger
      class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-black border-op-9 dark:border-white dark:border-op-9 border-dashed text-sm"
    >
      Right click here
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent
        :side-offset="5"
        class="z-50 w-64 min-w-[8rem] overflow-hidden rounded-md border border-black border-op-9 dark:border-white dark:border-op-9 bg-#FFFFFF dark:bg-#09090B p-1 text-#09090B dark:text-#FAFAFA shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      >
        <ContextMenuItem
          class="pl-8! relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-#F4F4F5 dark:focus:bg-#27272A focus:text-#18181B dark:focus:text-#FAFAFA data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          Back
          <span class="ml-auto text-xs tracking-widest text-#71717A dark:text-#A1A1AA">
            ⌘[
          </span>
        </ContextMenuItem>
        <ContextMenuItem
          disabled
          class="pl-8! relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-#F4F4F5 dark:focus:bg-#27272A focus:text-#18181B dark:focus:text-#FAFAFA data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          Forward
          <span class="ml-auto text-xs tracking-widest text-#71717A dark:text-#A1A1AA">
            ⌘]
          </span>
        </ContextMenuItem>
        <ContextMenuItem
          class="pl-8! relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-#F4F4F5 dark:focus:bg-#27272A focus:text-#18181B dark:focus:text-#FAFAFA data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          Reload
          <span class="ml-auto text-xs tracking-widest text-#71717A dark:text-#A1A1AA">
            ⌘R
          </span>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger
            class="pl-8! flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-#F4F4F5 dark:focus:bg-#27272A dark:focus:text-#FAFAFA focus:text-#18181B dark:data-[state=open]:bg-#27272A data-[state=open]:bg-#F4F4F5 data-[state=open]:text-#18181B dark:data-[state=open]:text-#FAFAFA"
          >
            More Tools
            <span class="ml-auto text-xs tracking-widest text-#71717A dark:text-#A1A1AA">
              <Icon name="radix-icons:chevron-right" class="ml-auto h-4 w-4" />
            </span>
          </ContextMenuSubTrigger>
          <ContextMenuPortal>
            <ContextMenuSubContent
              class="z-50 w-48 min-w-[8rem] overflow-hidden rounded-md border border-black border-op-9 dark:border-white dark:border-op-9 dark:bg-#09090B bg-#FFFFFF p-1 dark:text-#FAFAFA text-#09090B shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            >
              <ContextMenuItem
                class="pl-6! relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-#F4F4F5 dark:focus:bg-#27272A focus:text-#18181B dark:focus:text-#FAFAFA data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                Save Page As...
                <span class="ml-auto text-xs tracking-widest text-#71717A dark:text-#A1A1AA">
                  ⇧⌘S
                </span>
              </ContextMenuItem>
              <ContextMenuSeparator class="-mx-1 my-1 h-px dark:bg-#27272A bg-#E4E4E7" />
              <ContextMenuItem
                class="pl-6! relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-#F4F4F5 dark:focus:bg-#27272A focus:text-#18181B dark:focus:text-#FAFAFA data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                Developer Tools
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuPortal>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
