<script setup lang="ts">
import {
  MenubarItem,
  MenubarPortal,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '@destyler/menubar'
import { Icon } from '@destyler/icon'
import Shortcut from './Shortcut.vue'

const props = defineProps<{
  items?: any
}>()
</script>

<template>
  <MenubarSub>
    <MenubarSubTrigger
      class="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
    >
      <Icon v-if="props.items.icon" :name="props.items.icon" class="mr-2 h-4 w-4" />
      {{ props.items.label }}
      <Icon name="carbon:chevron-right" class="ml-auto h-4 w-4" />
    </MenubarSubTrigger>
    <MenubarPortal>
      <MenubarSubContent
        :align-offset="-5"
        class="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      >
        <template
          v-for="item in props.items.items"
          :key="item?.value"
        >
          <MenubarItem
            v-if="item?.type === 'item'"
            :value="item?.value"
            :disabled="item?.disabled"
            class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            :class="item?.class"
          >
            <Icon v-if="item.icon" :name="item.icon" class="mr-2 h-4 w-4" />
            {{ item?.label }}
            <Shortcut v-show="item?.shortcut">
              {{ item.shortcut }}
            </Shortcut>
          </MenubarItem>
          <MenubarSeparator v-else-if="item?.type === 'separator'" class="-mx-1 my-1 h-px bg-muted" />
          <Sub v-else-if="item?.type === 'sub'" :items="item" />
        </template>
      </MenubarSubContent>
    </MenubarPortal>
  </MenubarSub>
</template>
